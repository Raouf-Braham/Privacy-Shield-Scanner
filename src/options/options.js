/**
 * Privacy Shield Scanner - Options Page JavaScript
 */

(function() {
  'use strict';

  // DOM Elements
  const elements = {
    // Welcome
    welcomeBanner: document.getElementById('welcomeBanner'),
    closeWelcome: document.getElementById('closeWelcome'),

    // Settings
    autoScan: document.getElementById('autoScan'),
    showNotifications: document.getElementById('showNotifications'),
    detailedReports: document.getElementById('detailedReports'),
    theme: document.getElementById('theme'),

    // Whitelist
    whitelistInput: document.getElementById('whitelistInput'),
    addWhitelist: document.getElementById('addWhitelist'),
    whitelistItems: document.getElementById('whitelistItems'),
    whitelistEmpty: document.getElementById('whitelistEmpty'),

    // Data Management
    clearHistory: document.getElementById('clearHistory'),
    exportData: document.getElementById('exportData'),
    resetSettings: document.getElementById('resetSettings'),

    // Modal
    confirmModal: document.getElementById('confirmModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalMessage: document.getElementById('modalMessage'),
    modalCancel: document.getElementById('modalCancel'),
    modalConfirm: document.getElementById('modalConfirm')
  };

  // Current modal action
  let currentModalAction = null;

  // Initialize
  async function init() {
    await loadSettings();
    await loadWhitelist();
    checkWelcome();
    setupEventListeners();
  }

  // Check if welcome banner should be shown
  function checkWelcome() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('welcome') === 'true') {
      elements.welcomeBanner.style.display = 'flex';
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Close welcome banner
    elements.closeWelcome?. addEventListener('click', () => {
      elements.welcomeBanner.style.display = 'none';
      // Remove welcome param from URL
      const url = new URL(window.location);
      url.searchParams.delete('welcome');
      window.history.replaceState({}, '', url);
    });

    // Settings changes
    elements.autoScan. addEventListener('change', saveSettings);
    elements.showNotifications.addEventListener('change', saveSettings);
    elements.detailedReports.addEventListener('change', saveSettings);
    elements.theme. addEventListener('change', () => {
      saveSettings();
      applyTheme(elements.theme.value);
    });

    // Whitelist
    elements.addWhitelist. addEventListener('click', addToWhitelist);
    elements. whitelistInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addToWhitelist();
    });

    // Data management
    elements.clearHistory. addEventListener('click', () => {
      showModal(
        'Clear History',
        'Are you sure you want to clear all scan history? This action cannot be undone.',
        clearHistory
      );
    });

    elements.exportData.addEventListener('click', exportAllData);

    elements.resetSettings.addEventListener('click', () => {
      showModal(
        'Reset Settings',
        'Are you sure you want to reset all settings to default?  This will also clear your whitelist.',
        resetAllSettings
      );
    });

    // Modal
    elements.modalCancel.addEventListener('click', hideModal);
    elements.modalConfirm.addEventListener('click', () => {
      if (currentModalAction) {
        currentModalAction();
      }
      hideModal();
    });

    // Close modal on outside click
    elements.confirmModal.addEventListener('click', (e) => {
      if (e.target === elements.confirmModal) {
        hideModal();
      }
    });
  }

  // Load settings from storage
  async function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('settings', (result) => {
        const settings = result.settings || getDefaultSettings();

        elements.autoScan.checked = settings.autoScan;
        elements.showNotifications.checked = settings.showNotifications;
        elements.detailedReports.checked = settings.detailedReports;
        elements.theme.value = settings.theme;

        applyTheme(settings.theme);
        resolve();
      });
    });
  }

  // Save settings to storage
  function saveSettings() {
    const settings = {
      autoScan: elements.autoScan.checked,
      showNotifications: elements.showNotifications.checked,
      detailedReports: elements.detailedReports.checked,
      theme: elements.theme.value
    };

    chrome.storage.sync.set({ settings }, () => {
      showToast('Settings saved', 'success');
    });
  }

  // Get default settings
  function getDefaultSettings() {
    return {
      autoScan: true,
      showNotifications: true,
      detailedReports: true,
      theme: 'auto'
    };
  }

  // Apply theme
  function applyTheme(theme) {
    if (theme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document. documentElement.setAttribute('data-theme', theme);
    }
  }

  // Load whitelist
  async function loadWhitelist() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('whitelist', (result) => {
        const whitelist = result.whitelist || [];
        renderWhitelist(whitelist);
        resolve();
      });
    });
  }

  // Render whitelist
  function renderWhitelist(whitelist) {
    if (whitelist.length === 0) {
      elements.whitelistItems.innerHTML = '';
      elements.whitelistEmpty.style.display = 'block';
      return;
    }

    elements.whitelistEmpty.style.display = 'none';
    elements.whitelistItems.innerHTML = whitelist.map(domain => `
      <li class="whitelist-item">
        <span class="whitelist-domain">${escapeHtml(domain)}</span>
        <button class="whitelist-remove" data-domain="${escapeHtml(domain)}" title="Remove">×</button>
      </li>
    `). join('');

    // Add remove listeners
    elements.whitelistItems.querySelectorAll('.whitelist-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromWhitelist(btn.dataset.domain);
      });
    });
  }

  // Add to whitelist
  function addToWhitelist() {
    const domain = elements.whitelistInput.value.trim(). toLowerCase();

    if (! domain) {
      showToast('Please enter a domain', 'error');
      return;
    }

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    if (!domainRegex.test(domain)) {
      showToast('Invalid domain format', 'error');
      return;
    }

    chrome.storage.sync.get('whitelist', (result) => {
      const whitelist = result.whitelist || [];

      if (whitelist.includes(domain)) {
        showToast('Domain already in whitelist', 'error');
        return;
      }

      whitelist.push(domain);
      chrome.storage.sync.set({ whitelist }, () => {
        elements.whitelistInput.value = '';
        renderWhitelist(whitelist);
        showToast('Domain added to whitelist', 'success');
      });
    });
  }

  // Remove from whitelist
  function removeFromWhitelist(domain) {
    chrome.storage. sync.get('whitelist', (result) => {
      let whitelist = result.whitelist || [];
      whitelist = whitelist.filter(d => d !== domain);

      chrome.storage.sync.set({ whitelist }, () => {
        renderWhitelist(whitelist);
        showToast('Domain removed', 'success');
      });
    });
  }

  // Clear history
  function clearHistory() {
    chrome.storage.local.remove('scanHistory', () => {
      showToast('History cleared', 'success');
    });
  }

  // Export all data
  function exportAllData() {
    chrome.storage.sync.get(null, (syncData) => {
      chrome.storage.local.get(null, (localData) => {
        const exportData = {
          settings: syncData.settings || getDefaultSettings(),
          whitelist: syncData.whitelist || [],
          scanHistory: localData.scanHistory || [],
          exportedAt: new Date().toISOString(),
          version: '1.0. 0'
        };

        const blob = new Blob([JSON. stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-shield-backup-${Date.now()}.json`;
        a.click();

        URL. revokeObjectURL(url);
        showToast('Data exported successfully', 'success');
      });
    });
  }

  // Reset all settings
  function resetAllSettings() {
    const defaultSettings = getDefaultSettings();

    chrome.storage.sync.set({
      settings: defaultSettings,
      whitelist: []
    }, () => {
      chrome.storage.local.remove('scanHistory', () => {
        loadSettings();
        renderWhitelist([]);
        showToast('All settings reset to default', 'success');
      });
    });
  }

  // Show modal
  function showModal(title, message, action) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    currentModalAction = action;
    elements.confirmModal.classList.add('show');
  }

  // Hide modal
  function hideModal() {
    elements.confirmModal.classList.remove('show');
    currentModalAction = null;
  }

  // Show toast
  function showToast(message, type = 'info') {
    const existingToast = document.querySelector('. toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document. addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();