/**
 * Privacy Shield Scanner - Storage Utility
 * Handles all Chrome storage operations
 */

const StorageUtil = {
  // Get settings from storage
  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage. sync.get('settings', (result) => {
        resolve(result.settings || {
          autoScan: true,
          showNotifications: true,
          theme: 'auto',
          detailedReports: true
        });
      });
    });
  },
  
  // Save settings to storage
  async saveSettings(settings) {
    return new Promise((resolve) => {
      chrome.storage. sync.set({ settings }, resolve);
    });
  },
  
  // Get scan history
  async getHistory() {
    return new Promise((resolve) => {
      chrome. storage.local.get('scanHistory', (result) => {
        resolve(result.scanHistory || []);
      });
    });
  },
  
  // Add scan to history
  async addToHistory(scanResult) {
    const history = await this.getHistory();
    
    // Keep only last 100 scans
    if (history.length >= 100) {
      history.shift();
    }
    
    history.push({
      ... scanResult,
      timestamp: Date.now()
    });
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ scanHistory: history }, resolve);
    });
  },
  
  // Clear history
  async clearHistory() {
    return new Promise((resolve) => {
      chrome.storage.local.remove('scanHistory', resolve);
    });
  },
  
  // Get whitelist
  async getWhitelist() {
    return new Promise((resolve) => {
      chrome. storage.sync.get('whitelist', (result) => {
        resolve(result.whitelist || []);
      });
    });
  },
  
  // Add domain to whitelist
  async addToWhitelist(domain) {
    const whitelist = await this. getWhitelist();
    if (!whitelist.includes(domain)) {
      whitelist.push(domain);
    }
    return new Promise((resolve) => {
      chrome.storage.sync.set({ whitelist }, resolve);
    });
  },
  
  // Remove domain from whitelist
  async removeFromWhitelist(domain) {
    let whitelist = await this.getWhitelist();
    whitelist = whitelist.filter(d => d !== domain);
    return new Promise((resolve) => {
      chrome.storage.sync.set({ whitelist }, resolve);
    });
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageUtil;
}