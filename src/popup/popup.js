/**
 * Privacy Shield Scanner - Popup JavaScript
 * Fixed version with working accordion lists
 */

(function() {
  'use strict';

  const elements = {
    // Main containers
    loading: document.getElementById('loading'),
    mainContent: document.getElementById('mainContent'),
    errorState: document.getElementById('errorState'),
    errorMessage: document.getElementById('errorMessage'),
    
    // Score
    scoreValue: document.getElementById('scoreValue'),
    scoreLabel: document.getElementById('scoreLabel'),
    scoreRingProgress: document.getElementById('scoreRingProgress'),
    domainName: document.getElementById('domainName'),
    gradeText: document.getElementById('gradeText'),
    
    // Stats
    trackerCount: document. getElementById('trackerCount'),
    fingerprintCount: document.getElementById('fingerprintCount'),
    thirdPartyCount: document. getElementById('thirdPartyCount'),
    cookieCount: document. getElementById('cookieCount'),
    
    // Security
    securityItems: document.getElementById('securityItems'),
    
    // Accordion badges
    trackerBadge: document.getElementById('trackerBadge'),
    fingerprintBadge: document.getElementById('fingerprintBadge'),
    thirdPartyBadge: document.getElementById('thirdPartyBadge'),
    
    // Accordion lists
    trackerList: document.getElementById('trackerList'),
    fingerprintList: document.getElementById('fingerprintList'),
    thirdPartyList: document.getElementById('thirdPartyList'),
    
    // Recommendations
    recommendationsSection: document.getElementById('recommendationsSection'),
    recommendations: document.getElementById('recommendations'),
    
    // Buttons
    rescanBtn: document.getElementById('rescanBtn'),
    reportBtn: document.getElementById('reportBtn'),
    retryBtn: document.getElementById('retryBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    helpLink: document.getElementById('helpLink')
  };

  let currentScanData = null;
  let retryCount = 0;
  const MAX_RETRIES = 8;

  // ==========================================
  // INITIALIZATION
  // ==========================================

  async function init() {
    console. log('[Popup] Initializing...');
    setupEventListeners();
    setupAccordions();
    await loadScanResults();
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================

  function setupEventListeners() {
    // Settings button
    if (elements.settingsBtn) {
      elements.settingsBtn. addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
      });
    }

    // Rescan button
    if (elements.rescanBtn) {
      elements.rescanBtn.addEventListener('click', handleRescan);
    }

    // Copy report button
    if (elements. reportBtn) {
      elements. reportBtn.addEventListener('click', copyReport);
    }
    
    // Retry button
    if (elements.retryBtn) {
      elements.retryBtn.addEventListener('click', () => {
        showLoading();
        retryCount = 0;
        chrome.runtime.sendMessage({ type: 'REQUEST_SCAN' });
        setTimeout(loadScanResults, 1000);
      });
    }

    // Help link
    if (elements.helpLink) {
      elements.helpLink.addEventListener('click', (e) => {
        e. preventDefault();
        chrome.tabs.create({ url: 'https://github.com/Raouf-Braham/Privacy-Shield-Scanner#readme' });
      });
    }

    // Stat card clicks - open corresponding accordion
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('click', () => {
        const category = card.dataset.category;
        openAccordionByCategory(category);
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
        
        // Close all accordions
        document.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('open');
        });
        
        // Open clicked one if it wasn't already open
        if (!isCurrentlyOpen) {
          accordionItem.classList.add('open');
        }
      });
    });
  }

  function openAccordionByCategory(category) {
    const map = {
      'trackers': 'trackersAccordion',
      'fingerprinting': 'fingerprintAccordion',
      'thirdparty': 'thirdPartyAccordion',
      'cookies': 'trackersAccordion'
    };

    const accordionId = map[category];
    if (! accordionId) return;

    // Close all
    document.querySelectorAll('. accordion-item').forEach(item => {
      item.classList.remove('open');
    });

    // Open target
    const accordion = document.getElementById(accordionId);
    if (accordion) {
      accordion.classList.add('open');
      accordion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // ==========================================
  // LOAD SCAN RESULTS
  // ==========================================

  async function loadScanResults() {
    console. log('[Popup] Loading scan results...  (attempt', retryCount + 1, ')');
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab. url) {
        showError('No active tab found.');
        return;
      }

      if (! canScanUrl(tab.url)) {
        showError('Cannot scan this page.  Try a regular website like google.com');
        return;
      }

      chrome.runtime.sendMessage({ type: 'GET_SCAN_RESULTS' }, (response) => {
        console.log('[Popup] Got response:', response);
        
        if (response && response.data) {
          currentScanData = response.data;
          displayResults(response.data);
        } else if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log('[Popup] No results yet, retrying in 500ms...');
          chrome.runtime.sendMessage({ type: 'REQUEST_SCAN' });
          setTimeout(loadScanResults, 500);
        } else {
          showError('Scan timeout. Please reload the page and try again.');
        }
      });

    } catch (error) {
      console.error('[Popup] Error:', error);
      showError('Failed to load scan results.');
    }
  }

  function canScanUrl(url) {
    const blocked = ['chrome://', 'chrome-extension://', 'about:', 'file://', 'edge://', 'moz-extension://'];
    return ! blocked.some(p => url.startsWith(p));
  }

  // ==========================================
  // DISPLAY RESULTS
  // ==========================================

  function displayResults(data) {
    console.log('[Popup] Displaying results:', data);
    
    hideLoading();
    showMainContent();

    // Update score
    updateScore(data. score);
    
    // Update domain
    if (elements.domainName) {
      elements.domainName.textContent = data.domain || 'Unknown';
    }
    
    // Update stats
    if (elements.trackerCount) {
      elements.trackerCount.textContent = data.trackers?.length || 0;
    }
    if (elements.fingerprintCount) {
      elements.fingerprintCount.textContent = data. fingerprinting?.length || 0;
    }
    if (elements.thirdPartyCount) {
      elements.thirdPartyCount. textContent = data.thirdParty?.count || 0;
    }
    if (elements.cookieCount) {
      elements.cookieCount.textContent = data.cookies?.total || 0;
    }

    // Update sections
    updateSecuritySection(data.security);
    updateTrackerList(data.trackers);
    updateFingerprintList(data.fingerprinting);
    updateThirdPartyList(data.thirdParty);
    updateRecommendations(data);
  }

  // ==========================================
  // UPDATE SCORE
  // ==========================================

  function updateScore(score) {
    const grade = getGrade(score);
    
    if (elements.scoreValue) {
      elements.scoreValue.textContent = score;
    }
    
    if (elements.scoreLabel) {
      elements.scoreLabel.textContent = grade. label;
    }
    
    if (elements.gradeText) {
      elements.gradeText.textContent = 'Privacy Grade: ' + grade.letter + ' - ' + grade.label;
    }
    
    if (elements.scoreRingProgress) {
      const circumference = 2 * Math. PI * 45;
      const offset = circumference - (score / 100) * circumference;
      elements. scoreRingProgress.style.strokeDasharray = circumference;
      elements.scoreRingProgress.style.strokeDashoffset = offset;
      elements.scoreRingProgress.style.stroke = grade.color;
    }
  }

  function getGrade(score) {
    if (score >= 90) return { letter: 'A+', label: 'Excellent', color: '#22c55e' };
    if (score >= 80) return { letter: 'A', label: 'Very Good', color: '#22c55e' };
    if (score >= 70) return { letter: 'B', label: 'Good', color: '#84cc16' };
    if (score >= 60) return { letter: 'C', label: 'Moderate', color: '#eab308' };
    if (score >= 50) return { letter: 'D', label: 'Poor', color: '#f97316' };
    if (score >= 30) return { letter: 'E', label: 'Bad', color: '#ef4444' };
    return { letter: 'F', label: 'Critical', color: '#dc2626' };
  }

  // ==========================================
  // UPDATE SECURITY SECTION
  // ==========================================

  function updateSecuritySection(security) {
    if (! security || !elements.securityItems) return;

    elements.securityItems.innerHTML = `
      <div class="security-item">
        <span class="security-item-label">🔒 HTTPS Connection</span>
        <span class="security-item-status ${security.https ? 'secure' : 'insecure'}">
          ${security.https ?  'Secure' : 'Not Secure'}
        </span>
      </div>
      <div class="security-item">
        <span class="security-item-label">⚠️ Mixed Content</span>
        <span class="security-item-status ${! security.mixedContent ? 'secure' : 'insecure'}">
          ${!security.mixedContent ? 'None' : 'Detected'}
        </span>
      </div>
    `;
  }

  // ==========================================
  // UPDATE TRACKER LIST
  // ==========================================

  function updateTrackerList(trackers) {
    const count = trackers?.length || 0;

    // Update badge
    if (elements.trackerBadge) {
      elements.trackerBadge.textContent = count;
      elements.trackerBadge. className = 'accordion-badge';
      if (count > 0) {
        elements.trackerBadge.classList.add('danger');
      } else {
        elements.trackerBadge. classList.add('success');
      }
    }

    // Update list
    if (! elements.trackerList) return;

    if (count === 0) {
      elements.trackerList.innerHTML = '<li class="empty-state">✅ No trackers detected</li>';
      return;
    }

    elements.trackerList.innerHTML = trackers.map(tracker => `
      <li>
        <span class="tracker-name">${escapeHtml(tracker.pattern)}</span>
        <span class="tracker-category">${escapeHtml(tracker.category)}</span>
      </li>
    `).join('');
  }

  // ==========================================
  // UPDATE FINGERPRINT LIST
  // ==========================================

  function updateFingerprintList(fingerprinting) {
    const count = fingerprinting?.length || 0;

    // Update badge
    if (elements.fingerprintBadge) {
      elements.fingerprintBadge.textContent = count;
      elements.fingerprintBadge.className = 'accordion-badge';
      if (count > 0) {
        elements.fingerprintBadge.classList.add('danger');
      } else {
        elements.fingerprintBadge.classList.add('success');
      }
    }

    // Update list
    if (!elements. fingerprintList) return;

    if (count === 0) {
      elements.fingerprintList.innerHTML = '<li class="empty-state">✅ No fingerprinting detected</li>';
      return;
    }

    elements.fingerprintList.innerHTML = fingerprinting.map(fp => `
      <li>
        <span class="tracker-name">${escapeHtml(fp.technique)}</span>
        <span class="tracker-category warning">detected</span>
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
    if (elements.thirdPartyBadge) {
      elements.thirdPartyBadge.textContent = count;
      elements.thirdPartyBadge.className = 'accordion-badge';
      if (count > 15) {
        elements.thirdPartyBadge.classList. add('warning');
      } else if (count > 0) {
        elements.thirdPartyBadge.classList. add('');
      } else {
        elements.thirdPartyBadge.classList.add('success');
      }
    }

    // Update list
    if (!elements.thirdPartyList) return;

    if (count === 0) {
      elements.thirdPartyList. innerHTML = '<li class="empty-state">✅ No third-party domains</li>';
      return;
    }

    let html = domains.slice(0, 20).map(domain => `
      <li>
        <span class="domain-item">${escapeHtml(domain)}</span>
      </li>
    `).join('');

    if (domains. length > 20) {
      html += `<li class="empty-state">...  and ${domains.length - 20} more</li>`;
    }

    elements.thirdPartyList.innerHTML = html;
  }

  // ==========================================
  // UPDATE RECOMMENDATIONS
  // ==========================================

  function updateRecommendations(data) {
    if (!elements.recommendationsSection || !elements.recommendations) return;

    const recommendations = [];

    if (! data.security?. https) {
      recommendations.push({
        severity: 'critical',
        icon: '🔓',
        title: 'Insecure Connection',
        description: 'This site does not use HTTPS encryption.'
      });
    }

    if (data.trackers?.length > 5) {
      recommendations.push({
        severity: 'high',
        icon: '👁️',
        title: 'Heavy Tracking',
        description: `${data.trackers.length} trackers found. Consider using a content blocker.`
      });
    } else if (data.trackers?. length > 0) {
      recommendations.push({
        severity: 'medium',
        icon: '👁️',
        title: 'Trackers Present',
        description: `${data.trackers.length} tracker(s) detected. `
      });
    }

    if (data.fingerprinting?.length > 0) {
      recommendations.push({
        severity: 'high',
        icon: '🔍',
        title: 'Browser Fingerprinting',
        description: 'This site attempts to uniquely identify your browser.'
      });
    }

    if (data.security?.mixedContent) {
      recommendations.push({
        severity: 'medium',
        icon: '⚠️',
        title: 'Mixed Content',
        description: 'Some resources loaded over insecure HTTP.'
      });
    }

    if (data.thirdParty?.count > 20) {
      recommendations.push({
        severity: 'low',
        icon: '🌐',
        title: 'Many External Resources',
        description: `${data.thirdParty.count} third-party domains loaded.`
      });
    }

    if (recommendations.length === 0) {
      elements. recommendationsSection.style.display = 'none';
      return;
    }

    elements. recommendationsSection.style.display = 'block';
    elements. recommendations.innerHTML = recommendations.map(rec => `
      <div class="recommendation-item ${rec.severity}">
        <span class="recommendation-icon">${rec.icon}</span>
        <div class="recommendation-content">
          <div class="recommendation-title">${escapeHtml(rec.title)}</div>
          <div class="recommendation-description">${escapeHtml(rec.description)}</div>
        </div>
      </div>
    `). join('');
  }

  // ==========================================
  // RESCAN
  // ==========================================

  function handleRescan() {
    if (! elements.rescanBtn) return;

    elements.rescanBtn.disabled = true;
    elements.rescanBtn.innerHTML = '<span>⏳</span> Scanning...';
    retryCount = 0;
    
    chrome.runtime.sendMessage({ type: 'REQUEST_SCAN' });
    
    setTimeout(() => {
      loadScanResults();
      elements.rescanBtn.disabled = false;
      elements.rescanBtn.innerHTML = '<span>🔄</span> Rescan Page';
    }, 1500);
  }

  // ==========================================
  // COPY REPORT
  // ==========================================

  async function copyReport() {
    if (!currentScanData) {
      showToast('No data available', 'error');
      return;
    }

    const grade = getGrade(currentScanData.score);
    const report = `
Privacy Shield Scanner Report
=============================
Domain: ${currentScanData. domain}
Score: ${currentScanData.score}/100 (${grade.letter} - ${grade.label})
Date: ${new Date(). toLocaleString()}

Summary:
- Trackers: ${currentScanData.trackers?. length || 0}
- Fingerprinting: ${currentScanData.fingerprinting?.length || 0}
- Third-Party: ${currentScanData.thirdParty?.count || 0}
- Cookies: ${currentScanData.cookies?.total || 0}

Security:
- HTTPS: ${currentScanData.security?.https ?  'Yes' : 'No'}
- Mixed Content: ${currentScanData.security?.mixedContent ? 'Yes' : 'No'}

Trackers Found:
${currentScanData.trackers?.length > 0 
  ? currentScanData.trackers.map(t => `- ${t.pattern} (${t.category})`). join('\n')
  : '- None detected'}

Generated by Privacy Shield Scanner
    `. trim();

    try {
      await navigator.clipboard. writeText(report);
      showToast('Report copied! ', 'success');
    } catch (e) {
      showToast('Failed to copy', 'error');
    }
  }

  // ==========================================
  // UI HELPERS
  // ==========================================

  function showLoading() {
    if (elements.loading) elements.loading.style.display = 'flex';
    if (elements.mainContent) elements.mainContent.style.display = 'none';
    if (elements.errorState) elements.errorState.style. display = 'none';
  }

  function hideLoading() {
    if (elements.loading) elements.loading.style.display = 'none';
  }

  function showMainContent() {
    if (elements.mainContent) elements.mainContent.style.display = 'flex';
    if (elements.errorState) elements.errorState.style.display = 'none';
  }

  function showError(message) {
    if (elements.loading) elements.loading.style.display = 'none';
    if (elements.mainContent) elements.mainContent.style.display = 'none';
    if (elements.errorState) elements.errorState.style.display = 'flex';
    if (elements.errorMessage) elements. errorMessage.textContent = message;
  }

  function showToast(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
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
  // INITIALIZE
  // ==========================================

  if (document.readyState === 'loading') {
    document. addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();