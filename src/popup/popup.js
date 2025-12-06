/**
 * Privacy Shield Scanner - Popup JavaScript
 * Enhanced version with improved UI/UX
 */

(function() {
  'use strict';

  // ==========================================
  // CONSTANTS
  // ==========================================

  const SCAN_STAGES = [
    { text: 'Connecting to page...', detail: 'Establishing connection', progress: 10 },
    { text: 'Analyzing trackers...', detail: 'Checking for tracking scripts', progress: 30 },
    { text: 'Detecting fingerprinting...', detail: 'Scanning for browser fingerprinting', progress: 50 },
    { text: 'Checking third-parties...', detail: 'Identifying external domains', progress: 70 },
    { text: 'Analyzing cookies...', detail: 'Examining stored cookies', progress: 85 },
    { text: 'Generating report...', detail: 'Calculating privacy score', progress: 95 }
  ];

  const PRIVACY_TIPS = [
    'Use a VPN to encrypt your internet connection and hide your IP address.',
    'Clear your cookies regularly to reduce tracking across websites.',
    'Consider using a privacy-focused browser like Firefox or Brave.',
    'Enable "Do Not Track" in your browser settings.',
    'Use browser extensions to block third-party trackers.',
    'Be cautious with browser permissions - only grant what\'s necessary.',
    'Use private/incognito mode for sensitive browsing.',
    'Review and limit app permissions on your devices.',
    'Use strong, unique passwords with a password manager.',
    'Enable two-factor authentication wherever possible.'
  ];

  const MAX_RETRIES = 8;
  const RETRY_DELAY = 500;

  // ==========================================
  // STATE
  // ==========================================

  let currentScanData = null;
  let retryCount = 0;
  let scanStageIndex = 0;
  let scanInterval = null;

  // ==========================================
  // DOM ELEMENTS
  // ==========================================

  const elements = {
    // Containers
    loading: document.getElementById('loading'),
    mainContent: document.getElementById('mainContent'),
    errorState: document.getElementById('errorState'),
    errorMessage: document.getElementById('errorMessage'),
    
    // Header
    themeToggle: document.getElementById('themeToggle'),
    settingsBtn: document.getElementById('settingsBtn'),
    
    // Loading
    scanStatus: document.getElementById('scanStatus'),
    scanDetail: document.getElementById('scanDetail'),
    progressFill: document.getElementById('progressFill'),
    
    // Score
    scoreSection: document.getElementById('scoreSection'),
    scoreGrade: document.getElementById('scoreGrade'),
    scoreValue: document.getElementById('scoreValue'),
    scoreLabel: document.getElementById('scoreLabel'),
    scoreRingProgress: document.getElementById('scoreRingProgress'),
    scoreGlow: document.getElementById('scoreGlow'),
    gradientStart: document.getElementById('gradientStart'),
    gradientEnd: document.getElementById('gradientEnd'),
    domainName: document.getElementById('domainName'),
    gradeText: document.getElementById('gradeText'),
    scoreTrend: document.getElementById('scoreTrend'),
    trendIcon: document.getElementById('trendIcon'),
    trendText: document.getElementById('trendText'),
    
    // Stats
    trackerCount: document.getElementById('trackerCount'),
    fingerprintCount: document.getElementById('fingerprintCount'),
    thirdPartyCount: document.getElementById('thirdPartyCount'),
    cookieCount: document.getElementById('cookieCount'),
    trackerDot: document.getElementById('trackerDot'),
    fingerprintDot: document.getElementById('fingerprintDot'),
    thirdPartyDot: document.getElementById('thirdPartyDot'),
    cookieDot: document.getElementById('cookieDot'),
    trackerBar: document.getElementById('trackerBar'),
    fingerprintBar: document.getElementById('fingerprintBar'),
    thirdPartyBar: document.getElementById('thirdPartyBar'),
    cookieBar: document.getElementById('cookieBar'),
    
    // Security
    securityItems: document.getElementById('securityItems'),
    
    // Accordion
    trackerBadge: document.getElementById('trackerBadge'),
    fingerprintBadge: document.getElementById('fingerprintBadge'),
    thirdPartyBadge: document.getElementById('thirdPartyBadge'),
    cookieBadge: document.getElementById('cookieBadge'),
    trackerList: document.getElementById('trackerList'),
    fingerprintList: document.getElementById('fingerprintList'),
    thirdPartyList: document.getElementById('thirdPartyList'),
    cookieList: document.getElementById('cookieList'),
    
    // Recommendations
    recommendationsSection: document.getElementById('recommendationsSection'),
    recommendations: document.getElementById('recommendations'),
    
    // Tips
    tipText: document.getElementById('tipText'),
    
    // Buttons
    rescanBtn: document.getElementById('rescanBtn'),
    reportBtn: document.getElementById('reportBtn'),
    shareBtn: document.getElementById('shareBtn'),
    retryBtn: document.getElementById('retryBtn'),
    helpLink: document.getElementById('helpLink'),
    feedbackLink: document.getElementById('feedbackLink'),
    
    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================

  async function init() {
    console.log('[Popup] Initializing...');
    
    initTheme();
    setupEventListeners();
    setupAccordions();
    setRandomTip();
    startScanAnimation();
    await loadScanResults();
  }

  // ==========================================
  // THEME MANAGEMENT
  // ==========================================

  function initTheme() {
    // Check for saved theme first, then system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Detect system preference and set it explicitly
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', systemTheme);
    }
    
    // Update icon visibility based on current theme
    updateThemeIcon();
  }

  function toggleTheme() {
    const currentTheme = document.documentElement. getAttribute('data-theme');
    // If no theme set, detect from system
    const effectiveTheme = currentTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon visibility
    updateThemeIcon();
    
    showToast(
      newTheme === 'dark' ?  '🌙' : '☀️',
      `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`,
      'info'
    );
  }

  function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const iconSun = document.querySelector('.theme-toggle .icon-sun');
    const iconMoon = document.querySelector('.theme-toggle .icon-moon');
    
    if (iconSun && iconMoon) {
      if (currentTheme === 'dark') {
        iconSun.style.display = 'block';  // Show sun (to switch to light)
        iconMoon.style.display = 'none';
      } else {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block'; // Show moon (to switch to dark)
      }
    }
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================

  function setupEventListeners() {
    // Theme toggle
    elements.themeToggle?.addEventListener('click', toggleTheme);
    
    // Settings button
    elements.settingsBtn?.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });

    // Rescan button
    elements.rescanBtn?.addEventListener('click', handleRescan);

    // Copy report button
    elements.reportBtn?.addEventListener('click', copyReport);
    
    // Share button
    elements.shareBtn?.addEventListener('click', shareResults);

    // Retry button
    elements.retryBtn?.addEventListener('click', () => {
      showLoading();
      retryCount = 0;
      startScanAnimation();
      chrome.runtime.sendMessage({ type: 'REQUEST_SCAN' });
      setTimeout(loadScanResults, 1000);
    });

    // Help link
    elements.helpLink?.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/Raouf-Braham/Privacy-Shield-Scanner#readme' });
    });

    // Feedback link
    elements.feedbackLink?.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/Raouf-Braham/Privacy-Shield-Scanner/issues' });
    });

    // Stat card clicks
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('click', () => {
        const category = card.dataset.category;
        openAccordionByCategory(category);
      });
      
      // Keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const category = card.dataset.category;
          openAccordionByCategory(category);
        }
      });
    });
  }

  // ==========================================
  // ACCORDION FUNCTIONALITY
  // ==========================================

  function setupAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function() {
        const accordionItem = this.parentElement;
        const isCurrentlyOpen = accordionItem.classList.contains('open');
        const content = accordionItem.querySelector('.accordion-content');
        
        // Update ARIA
        this.setAttribute('aria-expanded', !isCurrentlyOpen);
        
        // Close all accordions
        document.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('open');
          item.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
        });
        
        // Open clicked one if it wasn't already open
        if (!isCurrentlyOpen) {
          accordionItem.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
          
          // Smooth scroll into view
          setTimeout(() => {
            accordionItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });
      
      // Keyboard support
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  function openAccordionByCategory(category) {
    const map = {
      'trackers': 'trackersAccordion',
      'fingerprinting': 'fingerprintAccordion',
      'thirdparty': 'thirdPartyAccordion',
      'cookies': 'cookiesAccordion'
    };

    const accordionId = map[category];
    if (!accordionId) return;

    // Close all
    document.querySelectorAll('.accordion-item').forEach(item => {
      item.classList.remove('open');
      item.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
    });

    // Open target
    const accordion = document.getElementById(accordionId);
    if (accordion) {
      accordion.classList.add('open');
      accordion.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'true');
      
      setTimeout(() => {
        accordion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  // ==========================================
  // SCAN ANIMATION
  // ==========================================

  function startScanAnimation() {
    scanStageIndex = 0;
    updateScanStage();
    
    scanInterval = setInterval(() => {
      scanStageIndex++;
      if (scanStageIndex < SCAN_STAGES.length) {
        updateScanStage();
      } else {
        // Loop back for visual effect
        scanStageIndex = SCAN_STAGES.length - 1;
      }
    }, 600);
  }

  function updateScanStage() {
    const stage = SCAN_STAGES[scanStageIndex];
    if (!stage) return;
    
    if (elements.scanStatus) {
      elements.scanStatus.textContent = stage.text;
    }
    if (elements.scanDetail) {
      elements.scanDetail.textContent = stage.detail;
    }
    if (elements.progressFill) {
      elements.progressFill.style.width = `${stage.progress}%`;
    }
  }

  function stopScanAnimation() {
    if (scanInterval) {
      clearInterval(scanInterval);
      scanInterval = null;
    }
    
    // Complete the progress bar
    if (elements.progressFill) {
      elements.progressFill.style.width = '100%';
    }
  }

  // ==========================================
  // PRIVACY TIPS
  // ==========================================

  function setRandomTip() {
    if (elements.tipText) {
      const randomTip = PRIVACY_TIPS[Math.floor(Math.random() * PRIVACY_TIPS.length)];
      elements.tipText.textContent = randomTip;
    }
  }

  // ==========================================
  // LOAD SCAN RESULTS
  // ==========================================

  async function loadScanResults() {
    console.log('[Popup] Loading scan results... (attempt', retryCount + 1, ')');
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.url) {
        stopScanAnimation();
        showError('No active tab found.');
        return;
      }

      if (!canScanUrl(tab.url)) {
        stopScanAnimation();
        showError('Cannot scan this page. Try a regular website like google.com');
        return;
      }

      chrome.runtime.sendMessage({ type: 'GET_SCAN_RESULTS' }, (response) => {
        console.log('[Popup] Got response:', response);
        
        if (response && response.data) {
          stopScanAnimation();
          currentScanData = response.data;
          displayResults(response.data);
          saveScanHistory(response.data);
        } else if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log('[Popup] No results yet, retrying in', RETRY_DELAY, 'ms...');
          chrome.runtime.sendMessage({ type: 'REQUEST_SCAN' });
          setTimeout(loadScanResults, RETRY_DELAY);
        } else {
          stopScanAnimation();
          showError('Scan timeout. Please reload the page and try again.');
        }
      });

    } catch (error) {
      console.error('[Popup] Error:', error);
      stopScanAnimation();
      showError('Failed to load scan results.');
    }
  }

  function canScanUrl(url) {
    const blocked = [
      'chrome://',
      'chrome-extension://',
      'about:',
      'file://',
      'edge://',
      'moz-extension://',
      'brave://'
    ];
    return !blocked.some(p => url.startsWith(p));
  }

  // ==========================================
  // SCAN HISTORY
  // ==========================================

  async function saveScanHistory(data) {
    try {
      const result = await chrome.storage.local.get('scanHistory');
      const history = result.scanHistory || {};
      
      history[data.domain] = {
        score: data.score,
        timestamp: Date.now()
      };
      
      // Keep only last 100 entries
      const entries = Object.entries(history);
      if (entries.length > 100) {
        entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
        const trimmed = Object.fromEntries(entries.slice(0, 100));
        await chrome.storage.local.set({ scanHistory: trimmed });
      } else {
        await chrome.storage.local.set({ scanHistory: history });
      }
    } catch (e) {
      console.error('[Popup] Failed to save history:', e);
    }
  }

  async function getPreviousScore(domain) {
    try {
      const result = await chrome.storage.local.get('scanHistory');
      const history = result.scanHistory || {};
      return history[domain]?.score || null;
    } catch (e) {
      return null;
    }
  }

  // ==========================================
  // DISPLAY RESULTS
  // ==========================================

  async function displayResults(data) {
    console.log('[Popup] Displaying results:', data);
    
    hideLoading();
    showMainContent();

    // Update score with animation
    await updateScore(data.score, data.domain);
    
    // Update domain
    if (elements.domainName) {
      elements.domainName.textContent = data.domain || 'Unknown';
    }
    
    // Update stats with animations
    updateStats(data);

    // Update sections
    updateSecuritySection(data.security);
    updateTrackerList(data.trackers);
    updateFingerprintList(data.fingerprinting);
    updateThirdPartyList(data.thirdParty);
    updateCookieList(data.cookies);
    updateRecommendations(data);
  }

  // ==========================================
  // UPDATE SCORE
  // ==========================================

  async function updateScore(score, domain) {
    const grade = getGrade(score);
    const previousScore = await getPreviousScore(domain);
    
    // Update grade letter
    if (elements.scoreGrade) {
      elements.scoreGrade.textContent = grade.letter;
      elements.scoreGrade.style.background = grade.gradient;
      elements.scoreGrade.style.webkitBackgroundClip = 'text';
      elements.scoreGrade.style.webkitTextFillColor = 'transparent';
    }
    
    // Animate score value
    if (elements.scoreValue) {
      animateNumber(elements.scoreValue, 0, score, 1000, '/100');
    }
    
    // Update grade text
    if (elements.gradeText) {
      elements.gradeText.textContent = `Privacy Grade: ${grade.letter} - ${grade.label}`;
    }
    
    // Update gradient colors
    if (elements.gradientStart) {
      elements.gradientStart.setAttribute('stop-color', grade.colors[0]);
    }
    if (elements.gradientEnd) {
      elements.gradientEnd.setAttribute('stop-color', grade.colors[1]);
    }
    
    // Update glow
    if (elements.scoreGlow) {
      elements.scoreGlow.style.background = grade.glow;
    }
    
    // Animate ring progress
    if (elements.scoreRingProgress) {
      const circumference = 2 * Math.PI * 42;
      const offset = circumference - (score / 100) * circumference;
      
      setTimeout(() => {
        elements.scoreRingProgress.style.strokeDasharray = circumference;
        elements.scoreRingProgress.style.strokeDashoffset = offset;
      }, 100);
    }
    
    // Show trend if we have previous data
    if (previousScore !== null && elements.scoreTrend) {
      const diff = score - previousScore;
      if (diff !== 0) {
        elements.scoreTrend.style.display = 'inline-flex';
        elements.scoreTrend.className = 'score-trend ' + (diff > 0 ? 'positive' : 'negative');
        
        if (elements.trendIcon) {
          elements.trendIcon.textContent = diff > 0 ? '↑' : '↓';
        }
        if (elements.trendText) {
          elements.trendText.textContent = `${diff > 0 ? '+' : ''}${diff} from last visit`;
        }
      }
    }
  }

  function getGrade(score) {
    if (score >= 90) return {
      letter: 'A+',
      label: 'Excellent',
      colors: ['#10b981', '#059669'],
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      glow: 'rgba(16, 185, 129, 0.4)'
    };
    if (score >= 80) return {
      letter: 'A',
      label: 'Very Good',
      colors: ['#22c55e', '#16a34a'],
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      glow: 'rgba(34, 197, 94, 0.4)'
    };
    if (score >= 70) return {
      letter: 'B',
      label: 'Good',
      colors: ['#84cc16', '#65a30d'],
      gradient: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
      glow: 'rgba(132, 204, 22, 0.4)'
    };
    if (score >= 60) return {
      letter: 'C',
      label: 'Moderate',
      colors: ['#eab308', '#ca8a04'],
      gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
      glow: 'rgba(234, 179, 8, 0.4)'
    };
    if (score >= 50) return {
      letter: 'D',
      label: 'Poor',
      colors: ['#f97316', '#ea580c'],
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      glow: 'rgba(249, 115, 22, 0.4)'
    };
    if (score >= 30) return {
      letter: 'E',
      label: 'Bad',
      colors: ['#ef4444', '#dc2626'],
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      glow: 'rgba(239, 68, 68, 0.4)'
    };
    return {
      letter: 'F',
      label: 'Critical',
      colors: ['#dc2626', '#b91c1c'],
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      glow: 'rgba(220, 38, 38, 0.4)'
    };
  }

  function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeProgress);
      
      element.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // ==========================================
  // UPDATE STATS
  // ==========================================

  function updateStats(data) {
    const trackerCount = data.trackers?.length || 0;
    const fingerprintCount = data.fingerprinting?.length || 0;
    const thirdPartyCount = data.thirdParty?.count || 0;
    const cookieCount = data.cookies?.total || 0;
    
    // Update tracker stat
    updateStatCard('trackers', trackerCount, [
      { threshold: 5, status: 'danger' },
      { threshold: 1, status: 'warning' },
      { threshold: 0, status: 'success' }
    ]);
    
    // Update fingerprinting stat
    updateStatCard('fingerprinting', fingerprintCount, [
      { threshold: 1, status: 'danger' },
      { threshold: 0, status: 'success' }
    ]);
    
    // Update third-party stat
    updateStatCard('thirdparty', thirdPartyCount, [
      { threshold: 20, status: 'danger' },
      { threshold: 10, status: 'warning' },
      { threshold: 0, status: 'success' }
    ]);
    
    // Update cookie stat
    updateStatCard('cookies', cookieCount, [
      { threshold: 20, status: 'warning' },
      { threshold: 0, status: 'success' }
    ]);
  }

    function updateStatCard(category, count, thresholds) {
    const card = document. querySelector(`.stat-card[data-category="${category}"]`);
    
    // Map category names to actual element ID prefixes
    const idPrefixMap = {
      'trackers': 'tracker',
      'fingerprinting': 'fingerprint',
      'thirdparty': 'thirdParty',
      'cookies': 'cookie'
    };
    
    const idPrefix = idPrefixMap[category];
    if (!idPrefix || !card) return;
    
    const valueEl = document.getElementById(`${idPrefix}Count`);
    const dotEl = document. getElementById(`${idPrefix}Dot`);
    const barEl = document.getElementById(`${idPrefix}Bar`);
    
    // Determine status
    let status = 'success';
    for (const t of thresholds) {
      if (count >= t. threshold) {
        status = t.status;
        break;
      }
    }
    
    // Update card class
    card.classList.remove('success', 'warning', 'danger');
    if (status !== 'success') {
      card.classList. add(status);
    }
    
    // Update value with animation
    if (valueEl) {
      animateNumber(valueEl, 0, count, 600);
    }
    
    // Update status dot
    if (dotEl) {
      dotEl.classList.remove('success', 'warning', 'danger');
      dotEl.classList.add(status);
    }
    
    // Animate bar
    if (barEl) {
      setTimeout(() => {
        barEl. style.transform = 'scaleX(1)';
      }, 300);
    }
  }

  // ==========================================
  // UPDATE SECURITY SECTION
  // ==========================================

  function updateSecuritySection(security) {
    if (!security || !elements.securityItems) return;

    const items = [
      {
        icon: security.https ? '🔒' : '🔓',
        label: 'HTTPS',
        status: security.https ? 'secure' : 'insecure',
        statusText: security.https ? 'Secure' : 'Not Secure',
        statusIcon: security.https ? '✓' : '✕'
      },
      {
        icon: !security.mixedContent ? '✓' : '⚠️',
        label: 'Mixed Content',
        status: !security.mixedContent ? 'secure' : 'warning',
        statusText: !security.mixedContent ? 'None' : 'Detected',
        statusIcon: !security.mixedContent ? '✓' : '!'
      }
    ];

    elements.securityItems.innerHTML = items.map(item => `
      <div class="security-card">
        <div class="security-icon ${item.status}">
          <span>${item.icon}</span>
        </div>
        <div class="security-info">
          <span class="security-label">${item.label}</span>
          <span class="security-status ${item.status}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              ${item.status === 'secure' 
                ? '<polyline points="20 6 9 17 4 12"></polyline>' 
                : item.status === 'insecure'
                  ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
                  : '<line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'
              }
            </svg>
            ${item.statusText}
          </span>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // UPDATE TRACKER LIST
  // ==========================================

  function updateTrackerList(trackers) {
    const count = trackers?.length || 0;

    // Update badge
    updateBadge(elements.trackerBadge, count, [
      { threshold: 1, status: 'danger' }
    ]);

    // Update list
    if (!elements.trackerList) return;

    if (count === 0) {
      elements.trackerList.innerHTML = `
        <li class="empty-state">
          <span class="empty-icon">✅</span>
          <span>No trackers detected</span>
        </li>
      `;
      return;
    }

    elements.trackerList.innerHTML = trackers.map(tracker => `
      <li>
        <span class="tracker-name">${escapeHtml(tracker.pattern || tracker.name || 'Unknown')}</span>
        <span class="tracker-category ${getCategoryClass(tracker.category)}">${escapeHtml(tracker.category || 'tracker')}</span>
      </li>
    `).join('');
  }

  // ==========================================
  // UPDATE FINGERPRINT LIST
  // ==========================================

  function updateFingerprintList(fingerprinting) {
    const count = fingerprinting?.length || 0;

    // Update badge
    updateBadge(elements.fingerprintBadge, count, [
      { threshold: 1, status: 'danger' }
    ]);

    // Update list
    if (!elements.fingerprintList) return;

    if (count === 0) {
      elements.fingerprintList.innerHTML = `
        <li class="empty-state">
          <span class="empty-icon">✅</span>
          <span>No fingerprinting detected</span>
        </li>
      `;
      return;
    }

    elements.fingerprintList.innerHTML = fingerprinting.map(fp => `
      <li>
        <span class="tracker-name">${escapeHtml(fp.technique || fp.name || 'Unknown technique')}</span>
        <span class="tracker-category danger">detected</span>
      </li>
    `).join('');
  }

  // ==========================================
  // UPDATE THIRD PARTY LIST
  // ==========================================

  function updateThirdPartyList(thirdParty) {
    const count = thirdParty?.count || 0;
    const domains = thirdParty?.domains || [];

    // Update badge
    updateBadge(elements.thirdPartyBadge, count, [
      { threshold: 20, status: 'warning' },
      { threshold: 10, status: '' }
    ]);

    // Update list
    if (!elements.thirdPartyList) return;

    if (count === 0) {
      elements.thirdPartyList.innerHTML = `
        <li class="empty-state">
          <span class="empty-icon">✅</span>
          <span>No third-party domains</span>
        </li>
      `;
      return;
    }

    const shown = domains.slice(0, 15);
    const html = shown.map(domain => `
      <li>
        <span class="domain-item">${escapeHtml(domain)}</span>
      </li>
    `).join('');

    const more = domains.length > 15 
      ? `<li class="empty-state"><span>... and ${domains.length - 15} more</span></li>` 
      : '';

    elements.thirdPartyList.innerHTML = html + more;
  }

  // ==========================================
  // UPDATE COOKIE LIST
  // ==========================================

  function updateCookieList(cookies) {
    const count = cookies?.total || 0;
    const cookieList = cookies?.list || [];

    // Update badge
    updateBadge(elements.cookieBadge, count, [
      { threshold: 20, status: 'warning' }
    ]);

    // Update list
    if (!elements.cookieList) return;

    if (count === 0) {
      elements.cookieList.innerHTML = `
        <li class="empty-state">
          <span class="empty-icon">✅</span>
          <span>No cookies found</span>
        </li>
      `;
      return;
    }

    // Show summary if we have details
    if (cookies.firstParty !== undefined || cookies.thirdParty !== undefined) {
      const summaryItems = [];
      if (cookies.firstParty) summaryItems.push(`${cookies.firstParty} first-party`);
      if (cookies.thirdParty) summaryItems.push(`${cookies.thirdParty} third-party`);
      if (cookies.session) summaryItems.push(`${cookies.session} session`);
      if (cookies.persistent) summaryItems.push(`${cookies.persistent} persistent`);
      
      elements.cookieList.innerHTML = summaryItems.map(item => `
        <li>
          <span class="tracker-name">${escapeHtml(item)}</span>
        </li>
      `).join('');
    } else {
      elements.cookieList.innerHTML = `
        <li>
          <span class="tracker-name">${count} cookie${count !== 1 ? 's' : ''} found</span>
        </li>
      `;
    }
  }

  // ==========================================
  // UPDATE RECOMMENDATIONS
  // ==========================================

  function updateRecommendations(data) {
    if (!elements.recommendationsSection || !elements.recommendations) return;

    const recommendations = [];

    // Check HTTPS
    if (!data.security?.https) {
      recommendations.push({
        severity: 'critical',
        icon: '🔓',
        title: 'Insecure Connection',
        description: 'This site does not use HTTPS. Your data may be intercepted.'
      });
    }

    // Check trackers
    if (data.trackers?.length > 5) {
      recommendations.push({
        severity: 'high',
        icon: '👁️',
        title: 'Heavy Tracking',
        description: `${data.trackers.length} trackers found. Consider using a content blocker.`
      });
    } else if (data.trackers?.length > 0) {
      recommendations.push({
        severity: 'medium',
        icon: '👁️',
        title: 'Trackers Present',
        description: `${data.trackers.length} tracker${data.trackers.length > 1 ? 's' : ''} detected on this page.`
      });
    }

    // Check fingerprinting
    if (data.fingerprinting?.length > 0) {
      recommendations.push({
        severity: 'high',
        icon: '🔍',
        title: 'Browser Fingerprinting',
        description: 'This site attempts to uniquely identify your browser.'
      });
    }

    // Check mixed content
    if (data.security?.mixedContent) {
      recommendations.push({
        severity: 'medium',
        icon: '⚠️',
        title: 'Mixed Content',
        description: 'Some resources are loaded over insecure HTTP.'
      });
    }

    // Check third-party domains
    if (data.thirdParty?.count > 20) {
      recommendations.push({
        severity: 'low',
        icon: '🌐',
        title: 'Many External Resources',
        description: `${data.thirdParty.count} third-party domains loaded.`
      });
    }

    // Check cookies
    if (data.cookies?.thirdParty > 10) {
      recommendations.push({
        severity: 'low',
        icon: '🍪',
        title: 'Third-Party Cookies',
        description: `${data.cookies.thirdParty} third-party cookies detected.`
      });
    }

    if (recommendations.length === 0) {
      elements.recommendationsSection.style.display = 'none';
      return;
    }

    elements.recommendationsSection.style.display = 'block';
    elements.recommendations.innerHTML = recommendations.map(rec => `
      <div class="recommendation-item ${rec.severity}">
        <span class="recommendation-icon">${rec.icon}</span>
        <div class="recommendation-content">
          <div class="recommendation-title">${escapeHtml(rec.title)}</div>
          <div class="recommendation-description">${escapeHtml(rec.description)}</div>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // BADGE HELPER
  // ==========================================

  function updateBadge(element, count, thresholds) {
    if (!element) return;
    
    element.textContent = count;
    element.className = 'accordion-badge';
    
    if (count === 0) {
      element.classList.add('success');
      return;
    }
    
    for (const t of thresholds) {
      if (count >= t.threshold && t.status) {
        element.classList.add(t.status);
        return;
      }
    }
  }

  function getCategoryClass(category) {
    const dangerCategories = ['advertising', 'analytics', 'social'];
    const warningCategories = ['essential', 'functional'];
    
    if (dangerCategories.includes(category?.toLowerCase())) return 'danger';
    if (warningCategories.includes(category?.toLowerCase())) return 'warning';
    return '';
  }

  // ==========================================
  // RESCAN
  // ==========================================

  function handleRescan() {
    if (!elements.rescanBtn) return;

    elements.rescanBtn.disabled = true;
    elements.rescanBtn.innerHTML = `
      <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23 4 23 10 17 10"></polyline>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
      </svg>
      <span>Scanning...</span>
    `;
    
    retryCount = 0;
    chrome.runtime.sendMessage({ type: 'REQUEST_SCAN' });
    
    setTimeout(() => {
      loadScanResults();
      elements.rescanBtn.disabled = false;
      elements.rescanBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span>Rescan</span>
      `;
    }, 1500);
  }

  // ==========================================
  // COPY REPORT
  // ==========================================

  async function copyReport() {
    if (!currentScanData) {
      showToast('⚠️', 'No data available', 'error');
      return;
    }

    const grade = getGrade(currentScanData.score);
    const report = generateReport(currentScanData, grade);

    try {
      await navigator.clipboard.writeText(report);
      showToast('✓', 'Report copied to clipboard!', 'success');
    } catch (e) {
      showToast('✕', 'Failed to copy report', 'error');
    }
  }

  function generateReport(data, grade) {
    return `
╔══════════════════════════════════════════════════════╗
║           PRIVACY SHIELD SCANNER REPORT              ║
╚══════════════════════════════════════════════════════╝

🌐 Domain: ${data.domain}
📊 Privacy Score: ${data.score}/100 (${grade.letter} - ${grade.label})
📅 Scan Date: ${new Date().toLocaleString()}

┌─────────────────────────────────────────────────────┐
│ SUMMARY                                             │
├─────────────────────────────────────────────────────┤
│ 👁️  Trackers:        ${String(data.trackers?.length || 0).padEnd(30)}│
│ 🔍 Fingerprinting:  ${String(data.fingerprinting?.length || 0).padEnd(30)}│
│ 🌐 Third-Party:     ${String(data.thirdParty?.count || 0).padEnd(30)}│
│ 🍪 Cookies:         ${String(data.cookies?.total || 0).padEnd(30)}│
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SECURITY STATUS                                     │
├─────────────────────────────────────────────────────┤
│ 🔒 HTTPS:           ${(data.security?.https ? 'Yes ✓' : 'No ✕').padEnd(30)}│
│ ⚠️  Mixed Content:   ${(data.security?.mixedContent ? 'Yes ✕' : 'No ✓').padEnd(30)}│
└─────────────────────────────────────────────────────┘

${data.trackers?.length > 0 ? `
┌─────────────────────────────────────────────────────┐
│ TRACKERS FOUND                                      │
├─────────────────────────────────────────────────────┤
${data.trackers.map(t => `│ • ${t.pattern || t.name} (${t.category})`).join('\n')}
└─────────────────────────────────────────────────────┘
` : ''}
══════════════════════════════════════════════════════
Generated by Privacy Shield Scanner
https://github.com/Raouf-Braham/Privacy-Shield-Scanner
══════════════════════════════════════════════════════
    `.trim();
  }

  // ==========================================
  // SHARE
  // ==========================================

  async function shareResults() {
    if (!currentScanData) {
      showToast('⚠️', 'No data available', 'error');
      return;
    }

    const grade = getGrade(currentScanData.score);
    const shareText = `🛡️ Privacy Shield Scanner\n\n` +
      `Website: ${currentScanData.domain}\n` +
      `Privacy Score: ${currentScanData.score}/100 (${grade.letter})\n` +
      `Trackers: ${currentScanData.trackers?.length || 0}\n\n` +
      `Scan your websites: https://github.com/Raouf-Braham/Privacy-Shield-Scanner`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Privacy Shield Scanner Report',
          text: shareText
        });
      } catch (e) {
        if (e.name !== 'AbortError') {
          await copyToClipboard(shareText);
        }
      }
    } else {
      await copyToClipboard(shareText);
    }
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('✓', 'Share text copied!', 'success');
    } catch (e) {
      showToast('✕', 'Failed to copy', 'error');
    }
  }

  // ==========================================
  // UI HELPERS
  // ==========================================

  function showLoading() {
    if (elements.loading) elements.loading.style.display = 'flex';
    if (elements.mainContent) elements.mainContent.style.display = 'none';
    if (elements.errorState) elements.errorState.style.display = 'none';
  }

  function hideLoading() {
    if (elements.loading) elements.loading.style.display = 'none';
  }

  function showMainContent() {
    if (elements.mainContent) elements.mainContent.style.display = 'flex';
    if (elements.errorState) elements.errorState.style.display = 'none';
  }

  function showError(message) {
    stopScanAnimation();
    if (elements.loading) elements.loading.style.display = 'none';
    if (elements.mainContent) elements.mainContent.style.display = 'none';
    if (elements.errorState) elements.errorState.style.display = 'flex';
    if (elements.errorMessage) elements.errorMessage.textContent = message;
  }

  function showToast(icon, message, type = 'info') {
    if (!elements.toastContainer) return;
    
    // Remove existing toasts
    const existingToasts = elements.toastContainer.querySelectorAll('.toast');
    existingToasts.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
      <div class="toast-progress"></div>
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
    }, 2500);
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ==========================================
  // CSS ANIMATION FOR SPINNER
  // ==========================================

  const style = document.createElement('style');
  style.textContent = `
    .spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // ==========================================
  // INITIALIZE
  // ==========================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();