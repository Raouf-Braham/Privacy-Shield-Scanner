/**
 * Privacy Shield Scanner - Content Script
 * Scans pages for trackers, fingerprinting, and security issues
 */

(function() {
  'use strict';

  // Prevent multiple injections
  if (window.__privacyShieldInjected) {
    console.log('[Privacy Shield] Already injected, skipping...');
    return;
  }
  window.__privacyShieldInjected = true;

  console.log('[Privacy Shield] Content script loaded on:', window.location.hostname);

  // Tracker patterns
  const TRACKER_PATTERNS = [
    'google-analytics.com', 'googletagmanager.com', 'gtag/js', 'analytics.js',
    'facebook.net', 'fbevents.js', 'facebook.com/tr', 'fbcdn.net',
    'twitter.com/i/', 'ads-twitter.com', 'platform.twitter.com',
    'linkedin.com/px', 'snap.licdn.com', 'licdn.com',
    'tiktok.com', 'analytics.tiktok.com',
    'hotjar.com', 'static.hotjar.com',
    'fullstory.com', 'rs.fullstory.com',
    'mixpanel.com', 'cdn.mxpnl.com',
    'amplitude.com', 'cdn.amplitude.com',
    'segment.com', 'segment.io', 'cdn.segment.com',
    'heap.io', 'heapanalytics.com',
    'crazyegg.com', 'script.crazyegg.com',
    'mouseflow.com', 'o2.mouseflow.com',
    'clarity.ms', 'c.clarity.ms',
    'mc.yandex.ru', 'yandex.ru/metrika',
    'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
    'amazon-adsystem.com', 'assoc-amazon.com',
    'criteo.com', 'criteo.net',
    'taboola.com', 'trc.taboola.com',
    'outbrain.com', 'widgets.outbrain.com',
    'adroll.com', 'd.adroll.com',
    'quantserve.com', 'quantcast.com',
    'scorecardresearch.com', 'sb.scorecardresearch.com',
    'newrelic.com', 'nr-data.net',
    'optimizely.com', 'cdn.optimizely.com',
    'disqus.com', 'disquscdn.com',
    'addthis.com', 'addthisedge.com',
    'sharethis.com'
  ];

  // Fingerprinting indicators
  const FINGERPRINT_PATTERNS = [
    'toDataURL',
    'getImageData',
    'WEBGL_debug_renderer_info',
    'getExtension',
    'AudioContext',
    'OfflineAudioContext',
    'createOscillator',
    'navigator.plugins',
    'navigator.mimeTypes',
    'RTCPeerConnection',
    'createDataChannel',
    'getBattery',
    'deviceMemory',
    'hardwareConcurrency',
    'getTimezoneOffset',
    'speechSynthesis'
  ];

  // Analyzer class
  class PrivacyAnalyzer {
    constructor() {
      this.results = {
        url: window.location.href,
        domain: window.location.hostname,
        timestamp: Date.now(),
        trackers: [],
        fingerprinting: [],
        security: {},
        thirdParty: { count: 0, domains: [] },
        cookies: { total: 0, thirdParty: 0 },
        score: 100
      };
    }

    analyze() {
      console.log('[Privacy Shield] Starting analysis...');
      
      this.detectTrackers();
      this.detectFingerprinting();
      this.checkSecurity();
      this.analyzeThirdParty();
      this.analyzeCookies();
      this.calculateScore();
      
      console. log('[Privacy Shield] Analysis complete.  Score:', this.results.score);
      return this.results;
    }

    detectTrackers() {
      // Collect all sources
      const scriptSrcs = Array.from(document.querySelectorAll('script[src]'))
        .map(el => el.src. toLowerCase());
      const iframeSrcs = Array.from(document.querySelectorAll('iframe[src]'))
        .map(el => el.src.toLowerCase());
      const imgSrcs = Array.from(document.querySelectorAll('img[src]'))
        .map(el => el.src.toLowerCase());
      const linkHrefs = Array.from(document.querySelectorAll('link[href]'))
        .map(el => el.href.toLowerCase());
      
      const allSources = [...scriptSrcs, ... iframeSrcs, ...imgSrcs, ...linkHrefs]. join(' ');
      const pageHtml = document.documentElement.innerHTML. toLowerCase();
      const searchContent = allSources + ' ' + pageHtml;

      // Check each tracker pattern
      TRACKER_PATTERNS. forEach(pattern => {
        if (searchContent.includes(pattern. toLowerCase())) {
          if (!this.results.trackers. find(t => t.pattern === pattern)) {
            this.results. trackers.push({
              pattern: pattern,
              category: this.categorizeTracker(pattern)
            });
          }
        }
      });

      console.log('[Privacy Shield] Trackers found:', this.results.trackers. length);
    }

    categorizeTracker(pattern) {
      const categories = {
        analytics: ['analytics', 'gtag', 'segment', 'mixpanel', 'amplitude', 'heap', 'matomo', 'piwik', 'clarity', 'hotjar', 'fullstory'],
        advertising: ['doubleclick', 'googlesyndication', 'googleadservices', 'amazon-adsystem', 'criteo', 'taboola', 'outbrain', 'adroll', 'quantserve'],
        social: ['facebook', 'twitter', 'linkedin', 'tiktok', 'pinterest', 'disqus', 'addthis', 'sharethis']
      };

      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(kw => pattern.toLowerCase().includes(kw))) {
          return category;
        }
      }
      return 'tracking';
    }

    detectFingerprinting() {
      // Check inline scripts
      const inlineScripts = Array.from(document.querySelectorAll('script:not([src])'))
        .map(s => s.textContent || '')
        .join(' ');

      FINGERPRINT_PATTERNS.forEach(pattern => {
        if (inlineScripts.includes(pattern)) {
          this.results.fingerprinting.push({
            technique: pattern,
            detected: true
          });
        }
      });

      console.log('[Privacy Shield] Fingerprinting techniques:', this.results.fingerprinting.length);
    }

    checkSecurity() {
      this.results.security = {
        https: location.protocol === 'https:',
        mixedContent: this.hasMixedContent()
      };
      console.log('[Privacy Shield] HTTPS:', this.results.security. https);
    }

    hasMixedContent() {
      if (location.protocol !== 'https:') return false;
      
      const insecureElements = document.querySelectorAll(
        'img[src^="http:"], script[src^="http:"], link[href^="http:"], iframe[src^="http:"]'
      );
      return insecureElements.length > 0;
    }

    analyzeThirdParty() {
      const currentHost = location.hostname. replace(/^www\./, '');
      const thirdPartyDomains = new Set();

      // Check all external resources
      const selectors = 'script[src], img[src], link[href], iframe[src], video[src], audio[src]';
      document.querySelectorAll(selectors).forEach(el => {
        const url = el.src || el.href;
        if (url && url.startsWith('http')) {
          try {
            const urlHost = new URL(url).hostname. replace(/^www\./, '');
            if (urlHost !== currentHost && !urlHost.endsWith('.' + currentHost)) {
              thirdPartyDomains. add(urlHost);
            }
          } catch (e) {
            // Invalid URL
          }
        }
      });

      this.results.thirdParty = {
        count: thirdPartyDomains.size,
        domains: Array.from(thirdPartyDomains). slice(0, 50)
      };

      console.log('[Privacy Shield] Third-party domains:', this.results.thirdParty.count);
    }

    analyzeCookies() {
      const cookies = document.cookie.split(';'). filter(c => c.trim(). length > 0);
      this.results.cookies = {
        total: cookies.length,
        thirdParty: Math.min(this.results.trackers.length, cookies.length)
      };
    }

    calculateScore() {
      let score = 100;

      // Deduct for trackers (max -25)
      score -= Math.min(this.results.trackers. length * 3, 25);

      // Deduct for fingerprinting (max -25)
      score -= Math.min(this.results.fingerprinting.length * 5, 25);

      // Deduct for no HTTPS (-15)
      if (!this.results.security.https) score -= 15;

      // Deduct for mixed content (-10)
      if (this. results.security.mixedContent) score -= 10;

      // Deduct for third-party domains (max -15)
      score -= Math.min(this.results.thirdParty.count * 0.5, 15);

      // Deduct for cookies (max -10)
      score -= Math.min(this.results.cookies.thirdParty, 10);

      this.results.score = Math.max(0, Math.round(score));
    }
  }

  // Run scan
  function runScan() {
    console.log('[Privacy Shield] Running scan...');
    
    try {
      const analyzer = new PrivacyAnalyzer();
      const results = analyzer.analyze();

      // Send results to service worker
      chrome.runtime.sendMessage({
        type: 'SCAN_COMPLETE',
        data: results
      }, response => {
        if (chrome.runtime.lastError) {
          console.log('[Privacy Shield] Error sending results:', chrome.runtime.lastError. message);
        } else {
          console.log('[Privacy Shield] Results sent successfully');
        }
      });

      return results;
    } catch (error) {
      console.error('[Privacy Shield] Scan error:', error);
      return null;
    }
  }

  // Listen for scan requests
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Privacy Shield] Received message:', message. type);
    
    if (message. type === 'RUN_SCAN') {
      const results = runScan();
      sendResponse({ success: true, data: results });
    }
    return true;
  });

  // Auto-scan when page is ready
  function initScan() {
    // Wait a bit for page to fully load dynamic content
    setTimeout(runScan, 800);
  }

  if (document.readyState === 'complete') {
    initScan();
  } else {
    window.addEventListener('load', initScan);
  }

})();