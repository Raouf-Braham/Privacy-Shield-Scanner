/**
 * Privacy Shield Scanner - Options Page JavaScript
 * Enhanced version with sidebar navigation
 */

(function() {
  'use strict';

  // ==========================================
  // DOM ELEMENTS
  // ==========================================

  const elements = {
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    menuToggle: document.getElementById('menuToggle'),
    navItems: document.querySelectorAll('.nav-item'),

    // Welcome
    welcomeBanner: document.getElementById('welcomeBanner'),
    closeWelcome: document.getElementById('closeWelcome'),

    // Settings - General
    autoScan: document.getElementById('autoScan'),
    deepScan: document.getElementById('deepScan'),
    showNotifications: document.getElementById('showNotifications'),
    soundAlerts: document.getElementById('soundAlerts'),
    detailedReports: document.getElementById('detailedReports'),

    // Settings - Appearance
    themeLight: document.getElementById('themeLight'),
    themeDark: document.getElementById('themeDark'),
    themeAuto: document.getElementById('themeAuto'),
    compactMode: document.getElementById('compactMode'),
    animations: document.getElementById('animations'),

    // Settings - Privacy
    saveHistory: document.getElementById('saveHistory'),
    anonymousStats: document.getElementById('anonymousStats'),

    // Whitelist
    whitelistInput: document.getElementById('whitelistInput'),
    addWhitelist: document.getElementById('addWhitelist'),
    whitelistItems: document.getElementById('whitelistItems'),
    whitelistEmpty: document.getElementById('whitelistEmpty'),
    whitelistCount: document.getElementById('whitelistCount'),

    // Data Management
    historyCount: document.getElementById('historyCount'),
    historySize: document.getElementById('historySize'),
    clearHistory: document.getElementById('clearHistory'),
    exportData: document.getElementById('exportData'),
    importData: document. getElementById('importData'),
    importFile: document.getElementById('importFile'),
    resetSettings: document.getElementById('resetSettings'),

    // Modal
    confirmModal: document.getElementById('confirmModal'),
    modalIcon: document.getElementById('modalIcon'),
    modalTitle: document.getElementById('modalTitle'),
    modalMessage: document.getElementById('modalMessage'),
    modalCancel: document.getElementById('modalCancel'),
    modalConfirm: document.getElementById('modalConfirm'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  // Current modal action
  let currentModalAction = null;

  // ==========================================
  // INITIALIZATION
  // ==========================================

  async function init() {
    console.log('[Options] Initializing...');
    
    initTheme();
    await loadSettings();
    await loadWhitelist();
    await updateDataStats();
    checkWelcome();
    setupEventListeners();
    setupNavigation();
    
    console.log('[Options] Initialized successfully');
  }

  // ==========================================
  // THEME MANAGEMENT
  // ==========================================

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== 'auto') {
      document.documentElement. setAttribute('data-theme', savedTheme);
    }
  }

  function applyTheme(theme) {
    localStorage.setItem('theme', theme);
    
    if (theme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document. documentElement.setAttribute('data-theme', theme);
    }
    
    showToast('✓', `Theme changed to ${theme}`, 'success');
  }

  // ==========================================
  // NAVIGATION
  // ==========================================

  function setupNavigation() {
    // Handle nav item clicks
    elements.navItems. forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.dataset.section;
        navigateToSection(sectionId);
        
        // Close mobile sidebar
        if (window.innerWidth <= 768) {
          elements. sidebar?. classList.remove('open');
        }
      });
    });

    // Handle initial hash
    const hash = window.location.hash. slice(1);
    if (hash) {
      navigateToSection(hash);
    }

    // Handle browser back/forward
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash. slice(1);
      if (hash) {
        navigateToSection(hash, false);
      }
    });
  }

  function navigateToSection(sectionId, updateHash = true) {
    // Update nav items
    elements.navItems. forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    // Update sections
    document.querySelectorAll('.settings-section').forEach(section => {
      section.classList.toggle('active', section.id === sectionId);
    });

    // Update URL hash
    if (updateHash) {
      history.pushState(null, '', `#${sectionId}`);
    }

    // Scroll to top of content
    document.querySelector('.content-wrapper')?.scrollTo(0, 0);
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================

  function setupEventListeners() {
    // Mobile menu toggle
    elements.menuToggle?.addEventListener('click', () => {
      elements.sidebar?.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        if (!elements.sidebar?.contains(e.target) && 
            !elements.menuToggle?.contains(e.target)) {
          elements.sidebar?.classList. remove('open');
        }
      }
    });

    // Welcome banner
    elements.closeWelcome?.addEventListener('click', () => {
      elements.welcomeBanner. style.display = 'none';
      const url = new URL(window.location);
      url.searchParams.delete('welcome');
      window.history.replaceState({}, '', url);
    });

    // General settings
    elements.autoScan?.addEventListener('change', saveSettings);
    elements.deepScan?.addEventListener('change', saveSettings);
    elements.showNotifications?.addEventListener('change', saveSettings);
    elements.soundAlerts?. addEventListener('change', saveSettings);
    elements.detailedReports?.addEventListener('change', saveSettings);

    // Appearance settings
    elements.themeLight?.addEventListener('change', () => applyTheme('light'));
    elements.themeDark?.addEventListener('change', () => applyTheme('dark'));
    elements.themeAuto?.addEventListener('change', () => applyTheme('auto'));
    elements.compactMode?.addEventListener('change', saveSettings);
    elements.animations?.addEventListener('change', saveSettings);

    // Privacy settings
    elements.saveHistory?.addEventListener('change', saveSettings);
    elements.anonymousStats?. addEventListener('change', saveSettings);

    // Whitelist
    elements.addWhitelist?.addEventListener('click', addToWhitelist);
    elements. whitelistInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addToWhitelist();
    });

    // Data management
    elements. clearHistory?.addEventListener('click', () => {
      showModal(
        'Clear History',
        'Are you sure you want to clear all scan history?  This action cannot be undone.',
        clearHistory
      );
    });

    elements.exportData?.addEventListener('click', exportAllData);
    
    elements.importData?.addEventListener('click', () => {
      elements.importFile?. click();
    });

    elements.importFile?.addEventListener('change', handleImport);

    elements.resetSettings?.addEventListener('click', () => {
      showModal(
        'Reset All Settings',
        'This will reset all settings to their defaults and clear your whitelist and scan history.  This action cannot be undone.',
        resetAllSettings
      );
    });

    // Modal
    elements.modalCancel?.addEventListener('click', hideModal);
    elements.modalConfirm?.addEventListener('click', () => {
      if (currentModalAction) {
        currentModalAction();
      }
      hideModal();
    });

    elements.confirmModal?.addEventListener('click', (e) => {
      if (e.target === elements.confirmModal) {
        hideModal();
      }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements. confirmModal?.classList.contains('show')) {
        hideModal();
      }
    });
  }

  // ==========================================
  // WELCOME BANNER
  // ==========================================

  function checkWelcome() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('welcome') === 'true') {
      elements.welcomeBanner.style. display = 'flex';
    }
  }

  // ==========================================
  // SETTINGS MANAGEMENT
  // ==========================================

  function getDefaultSettings() {
    return {
      autoScan: true,
      deepScan: false,
      showNotifications: true,
      soundAlerts: false,
      detailedReports: true,
      theme: 'auto',
      compactMode: false,
      animations: true,
      saveHistory: true,
      anonymousStats: false
    };
  }

  async function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('settings', (result) => {
        const settings = {...getDefaultSettings(),...result. settings };

        // General
        if (elements.autoScan) elements.autoScan.checked = settings.autoScan;
        if (elements.deepScan) elements.deepScan.checked = settings.deepScan;
        if (elements.showNotifications) elements.showNotifications.checked = settings.showNotifications;
        if (elements.soundAlerts) elements.soundAlerts.checked = settings.soundAlerts;
        if (elements.detailedReports) elements.detailedReports.checked = settings.detailedReports;

        // Appearance
        if (settings.theme === 'light' && elements.themeLight) {
          elements.themeLight. checked = true;
        } else if (settings.theme === 'dark' && elements.themeDark) {
          elements.themeDark.checked = true;
        } else if (elements.themeAuto) {
          elements.themeAuto. checked = true;
        }
        if (elements.compactMode) elements.compactMode.checked = settings.compactMode;
        if (elements.animations) elements.animations.checked = settings.animations;

        // Privacy
        if (elements.saveHistory) elements.saveHistory.checked = settings.saveHistory;
        if (elements.anonymousStats) elements.anonymousStats. checked = settings.anonymousStats;

        resolve();
      });
    });
  }

  function saveSettings() {
    const settings = {
      autoScan: elements.autoScan?. checked ??  true,
      deepScan: elements.deepScan?.checked ?? false,
      showNotifications: elements.showNotifications?.checked ?? true,
      soundAlerts: elements.soundAlerts?.checked ?? false,
      detailedReports: elements.detailedReports?.checked ?? true,
      theme: elements.themeLight?.checked ? 'light' : 
             elements.themeDark?.checked ?  'dark' : 'auto',
      compactMode: elements.compactMode?.checked ?? false,
      animations: elements.animations?.checked ?? true,
      saveHistory: elements.saveHistory?.checked ?? true,
      anonymousStats: elements.anonymousStats?.checked ?? false
    };

    chrome.storage.sync.set({ settings }, () => {
      showToast('✓', 'Settings saved', 'success');
    });
  }

  // ==========================================
  // WHITELIST MANAGEMENT
  // ==========================================

  async function loadWhitelist() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('whitelist', (result) => {
        const whitelist = result.whitelist || [];
        renderWhitelist(whitelist);
        resolve();
      });
    });
  }

  function renderWhitelist(whitelist) {
    // Update count badge
    if (elements.whitelistCount) {
      elements.whitelistCount. textContent = whitelist.length;
    }

    // Show/hide empty state
    if (whitelist.length === 0) {
      if (elements.whitelistItems) elements.whitelistItems.innerHTML = '';
      if (elements.whitelistEmpty) elements.whitelistEmpty.style.display = 'flex';
      return;
    }

    if (elements.whitelistEmpty) elements.whitelistEmpty. style.display = 'none';
    
    if (elements.whitelistItems) {
      elements.whitelistItems.innerHTML = whitelist.map(domain => `
        <li class="whitelist-item">
          <span class="whitelist-domain">${escapeHtml(domain)}</span>
          <button class="whitelist-remove" data-domain="${escapeHtml(domain)}" title="Remove" aria-label="Remove ${escapeHtml(domain)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </li>
      `).join('');

      // Add remove listeners
      elements.whitelistItems.querySelectorAll('.whitelist-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          removeFromWhitelist(btn.dataset.domain);
        });
      });
    }
  }

  function addToWhitelist() {
    const input = elements.whitelistInput;
    if (! input) return;

    const domain = input.value.trim(). toLowerCase();

    if (! domain) {
      showToast('⚠️', 'Please enter a domain', 'error');
      return;
    }

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    if (!domainRegex.test(domain)) {
      showToast('⚠️', 'Invalid domain format', 'error');
      return;
    }

    chrome.storage.sync.get('whitelist', (result) => {
      const whitelist = result.whitelist || [];

      if (whitelist.includes(domain)) {
        showToast('⚠️', 'Domain already in whitelist', 'error');
        return;
      }

      whitelist.push(domain);
      whitelist.sort();
      
      chrome.storage.sync.set({ whitelist }, () => {
        input.value = '';
        renderWhitelist(whitelist);
        showToast('✓', 'Domain added to whitelist', 'success');
      });
    });
  }

  function removeFromWhitelist(domain) {
    chrome.storage.sync.get('whitelist', (result) => {
      let whitelist = result.whitelist || [];
      whitelist = whitelist.filter(d => d !== domain);

      chrome.storage.sync.set({ whitelist }, () => {
        renderWhitelist(whitelist);
        showToast('✓', 'Domain removed', 'success');
      });
    });
  }

  // ==========================================
  // DATA MANAGEMENT
  // ==========================================

  async function updateDataStats() {
    try {
      const result = await chrome.storage.local.get('scanHistory');
      const history = result. scanHistory || {};
      const entries = Object.keys(history).length;
      
      if (elements.historyCount) {
        elements.historyCount. textContent = entries;
      }

      // Estimate storage size
      const size = new Blob([JSON.stringify(history)]).size;
      const sizeKB = (size / 1024).toFixed(1);
      
      if (elements.historySize) {
        elements.historySize.textContent = `${sizeKB} KB`;
      }
    } catch (e) {
      console.error('[Options] Failed to get data stats:', e);
    }
  }

  function clearHistory() {
    chrome.storage.local.remove('scanHistory', () => {
      updateDataStats();
      showToast('✓', 'Scan history cleared', 'success');
    });
  }

  function exportAllData() {
    chrome.storage.sync.get(null, (syncData) => {
      chrome.storage.local.get(null, (localData) => {
        const exportData = {
          settings: syncData.settings || getDefaultSettings(),
          whitelist: syncData.whitelist || [],
          scanHistory: localData.scanHistory || {},
          exportedAt: new Date().toISOString(),
          version: '1.0.0'
        };

        const blob = new Blob([JSON. stringify(exportData, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-shield-backup-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        showToast('✓', 'Data exported successfully', 'success');
      });
    });
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader. onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Validate data structure
        if (!data.version) {
          throw new Error('Invalid backup file');
        }

        // Import settings
        if (data.settings) {
          await chrome.storage.sync.set({ settings: data.settings });
        }

        // Import whitelist
        if (data.whitelist) {
          await chrome.storage. sync.set({ whitelist: data.whitelist });
        }

        // Import scan history
        if (data.scanHistory) {
          await chrome.storage.local.set({ scanHistory: data.scanHistory });
        }

        // Reload UI
        await loadSettings();
        await loadWhitelist();
        await updateDataStats();

        showToast('✓', 'Data imported successfully', 'success');
      } catch (err) {
        console.error('[Options] Import error:', err);
        showToast('✕', 'Failed to import data.  Invalid file format. ', 'error');
      }
    };

    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  }

  function resetAllSettings() {
    const defaultSettings = getDefaultSettings();

    chrome.storage.sync.set({
      settings: defaultSettings,
      whitelist: []
    }, () => {
      chrome.storage.local.remove('scanHistory', async () => {
        await loadSettings();
        renderWhitelist([]);
        await updateDataStats();
        applyTheme('auto');
        showToast('✓', 'All settings reset to defaults', 'success');
      });
    });
  }

  // ==========================================
  // MODAL
  // ==========================================

  function showModal(title, message, action) {
    if (elements.modalTitle) elements.modalTitle.textContent = title;
    if (elements.modalMessage) elements.modalMessage.textContent = message;
    currentModalAction = action;
    elements.confirmModal?. classList.add('show');
    
    // Focus on cancel button for accessibility
    setTimeout(() => elements.modalCancel?.focus(), 100);
  }

  function hideModal() {
    elements.confirmModal?.classList.remove('show');
    currentModalAction = null;
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================

  function showToast(icon, message, type = 'info') {
    if (! elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
    `;

    elements.toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ==========================================
  // INITIALIZE
  // ==========================================

  if (document.readyState === 'loading') {
    document. addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();