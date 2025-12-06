/**
 * Privacy Shield Scanner - Content Script
 * Enhanced scanner for trackers, fingerprinting, and security issues
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

  // ==========================================
  // COMPREHENSIVE TRACKER DATABASE
  // ==========================================

  const TRACKER_DATABASE = {
    // Analytics & Tracking
    analytics: [
      // Google
      'google-analytics.com', 'googletagmanager.com', 'gtag/js', 'analytics.js', 'ga.js',
      'googletagservices.com', 'googlesyndication.com/tag', 'google.com/pagead',
      // Facebook/Meta
      'facebook.net', 'fbevents.js', 'facebook.com/tr', 'fbcdn.net', 'fb.com',
      'connect.facebook.net', 'facebook.com/plugins', 'pixel.facebook.com',
      // Twitter/X
      'twitter.com/i/', 'ads-twitter.com', 'platform.twitter.com', 't.co/i',
      'analytics.twitter.com', 'static.ads-twitter.com',
      // LinkedIn
      'linkedin.com/px', 'snap.licdn.com', 'licdn.com', 'platform.linkedin.com',
      'linkedin.com/insight', 'linkedin.com/analytics',
      // TikTok
      'tiktok.com', 'analytics.tiktok.com', 'tiktok.com/i18n',
      // Microsoft
      'clarity.ms', 'c.clarity.ms', 'bat.bing.com', 'bing.com/bat',
      // Session Recording & Heatmaps
      'hotjar.com', 'static.hotjar.com', 'vars.hotjar.com',
      'fullstory.com', 'rs.fullstory.com', 'edge.fullstory.com',
      'logrocket.com', 'cdn.logrocket.io', 'r.logrocket.io',
      'smartlook.com', 'rec.smartlook.com', 'web-sdk.smartlook.com',
      'inspectlet.com', 'cdn.inspectlet.com',
      'mouseflow.com', 'o2.mouseflow.com', 'cdn.mouseflow.com',
      'crazyegg.com', 'script.crazyegg.com', 'dnn506yrbagrg.cloudfront.net',
      'luckyorange.com', 'luckyorange.net', 'cdn.luckyorange.com',
      'sessioncam.com', 'd2oh4tlt9mrke9.cloudfront.net',
      'clicktale.com', 'clicktale.net',
      'contentsquare.com', 'contentsquare.net', 'c.contentsquare.net',
      // Product Analytics
      'mixpanel.com', 'cdn.mxpnl.com', 'api.mixpanel.com',
      'amplitude.com', 'cdn.amplitude.com', 'api.amplitude.com', 'api2.amplitude.com',
      'segment.com', 'segment.io', 'cdn.segment.com', 'api.segment.io',
      'heap.io', 'heapanalytics.com', 'cdn.heapanalytics.com',
      'pendo.io', 'cdn.pendo.io', 'app.pendo.io',
      'userpilot.com', 'js.userpilot.com',
      'appcues.com', 'fast.appcues.com',
      // Other Analytics
      'mc.yandex.ru', 'yandex.ru/metrika', 'metrika.yandex.ru',
      'hm.baidu.com', 'tongji.baidu.com',
      'statcounter.com', 'c.statcounter.com',
      'clicky.com', 'static.getclicky.com', 'in.getclicky.com',
      'chartbeat.com', 'static.chartbeat.com', 'pinger.chartbeat.net',
      'parsely.com', 'cdn.parsely.com', 'srv.pixel.parsely.com',
      'scorecardresearch.com', 'sb.scorecardresearch.com',
      'comscore.com', 'b.scorecardresearch.com',
      'newrelic.com', 'nr-data.net', 'js-agent.newrelic.com', 'bam.nr-data.net',
      'nr-ext.newrelic.com',
      // A/B Testing
      'optimizely.com', 'cdn.optimizely.com', 'logx.optimizely.com',
      'cdn-pci.optimizely.com',
      'vwo.com', 'dev.visualwebsiteoptimizer.com', 'd5phz18u4wuww.cloudfront.net',
      'abtasty.com', 'try.abtasty.com',
      'omniconvert.com',
      // Tag Managers
      'tealium.com', 'tealiumiq.com', 'tags.tiqcdn.com', 'collect.tealiumiq.com',
      'ensighten.com', 'nexus.ensighten.com',
      'commanders-act.com', 'tagcommander.com',
      // Customer Support/Chat
      'intercom.io', 'widget.intercom.io', 'api.intercom.io',
      'drift.com', 'js.driftt.com', 'api.drift.com',
      'zendesk.com', 'static.zdassets.com', 'ekr.zdassets.com',
      'crisp.chat', 'client.crisp.chat',
      'livechat.com', 'cdn.livechatinc.com',
      'olark.com', 'static.olark.com',
      'tawk.to', 'embed.tawk.to',
      'freshdesk.com', 'freshchat.com',
      // Marketing Automation
      'hubspot.com', 'hs-scripts.com', 'hs-analytics.net', 'hs-banner.com',
      'hsforms.com', 'hsforms.net', 'hubapi.com',
      'marketo.com', 'munchkin.marketo.net', 'mktoforms.com',
      'pardot.com', 'pi.pardot.com', 'go.pardot.com',
      'mailchimp.com', 'chimpstatic.com', 'list-manage.com',
      'klaviyo.com', 'a.klaviyo.com', 'static.klaviyo.com',
      'sailthru.com', 'ak.sail-horizon.com',
      'braze.com', 'sdk.iad-01.braze.com', 'sdk.iad-03.braze.com',
      'iterable.com', 'js.iterable.com',
      'customer.io', 'track.customer.io',
      'drip.com', 'd1ra2869e0d77a.cloudfront.net',
      'activecampaign.com', 'trackcmp.net',
      'sendinblue.com', 'sibautomation.com',
      // Push Notifications
      'onesignal.com', 'cdn.onesignal.com',
      'pushwoosh.com', 'pushwoosh.com/webpush',
      'pushcrew.com', 'pushcrew.net',
      // User Feedback
      'usabilla.com', 'w.usabilla.com',
      'qualtrics.com', 'siteintercept.qualtrics.com',
      'surveymonkey.com', 'widget.surveymonkey.com',
      'typeform.com', 'embed.typeform.com'
    ],

    // Advertising Networks
    advertising: [
      // Google Ads
      'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
      'pagead2.googlesyndication.com', 'adservice.google.com', 'www.googleadservices.com',
      'tpc.googlesyndication.com', 'securepubads.g.doubleclick.net',
      // Amazon
      'amazon-adsystem.com', 'assoc-amazon.com', 'aax.amazon-adsystem.com',
      'z-na.amazon-adsystem.com', 'fls-na.amazon-adsystem.com',
      // Ad Networks
      'criteo.com', 'criteo.net', 'static.criteo.net', 'dis.criteo.com',
      'taboola.com', 'trc.taboola.com', 'cdn.taboola.com', 'nr.taboola.com',
      'outbrain.com', 'widgets.outbrain.com', 'log.outbrainimg.com',
      'adroll.com', 'd.adroll.com', 's.adroll.com',
      'quantserve.com', 'quantcast.com', 'pixel.quantserve.com',
      'pubmatic.com', 'ads.pubmatic.com', 'image8.pubmatic.com',
      'rubiconproject.com', 'fastlane.rubiconproject.com', 'pixel.rubiconproject.com',
      'openx.net', 'openx.com', 'u.openx.net',
      'indexexchange.com', 'casalemedia.com', 'htl.casalemedia.com',
      'appnexus.com', 'adnxs.com', 'ib.adnxs.com', 'secure.adnxs.com',
      'thetradedesk.com', 'adsrvr.org', 'insight.adsrvr.org',
      'mediamath.com', 'mathtag.com', 'pixel.mathtag.com',
      'bidswitch.net', 'bidswitch.com', 'x.bidswitch.net',
      'sharethrough.com', 'native.sharethrough.com',
      'triplelift.com', '3lift.com', 'eb2.3lift.com',
      'smartadserver.com', 'www8.smartadserver.com',
      'advertising.com', 'pixel.advertising.com',
      'contextweb.com', 'pulsepoint.com',
      'spotxchange.com', 'search.spotxchange.com',
      'lijit.com', 'ml314.com',
      'revcontent.com', 'cdn.revcontent.com',
      'mgid.com', 'servicer.mgid.com',
      'propellerads.com', 'propellerads.net',
      'adsterra.com', 'adskeeper.com',
      'zedo.com', 'saxp.zedo.com',
      'adform.net', 'track.adform.net',
      'adcolony.com', 'ads.adcolony.com',
      'inmobi.com', 'ads.inmobi.com',
      'smaato.net', 'ad.smaato.net',
      'unity3d.com', 'unityads.unity3d.com'
    ],

    // Social Media Trackers
    social: [
      'connect.facebook.net', 'facebook.com/plugins', 'staticxx.facebook.com',
      'platform.twitter.com', 'syndication.twitter.com', 'cdn.syndication.twimg.com',
      'platform.linkedin.com', 'static.licdn.com',
      'assets.pinterest.com', 'widgets.pinterest.com', 'ct.pinterest.com',
      'instagram.com/embed', 'platform.instagram.com',
      'youtube.com/embed', 'youtube-nocookie.com', 'ytimg.com',
      'player.vimeo.com', 'f.vimeocdn.com',
      'reddit.com/embed', 'embed.reddit.com', 'redditstatic.com',
      'embed.tumblr.com', 'assets.tumblr.com',
      'disqus.com', 'disquscdn.com', 'c.disquscdn.com',
      'addthis.com', 'addthisedge.com', 's7.addthis.com',
      'sharethis.com', 'w.sharethis.com', 'buttons-config.sharethis.com',
      'gravatar.com', 'secure.gravatar.com',
      'widgets.wp.com', 'stats.wp.com'
    ],

    // Data Management Platforms (DMPs)
    dmp: [
      'bluekai.com', 'tags.bluekai.com',
      'krxd.net', 'beacon.krxd.net', 'cdn.krxd.net',
      'rlcdn.com', 'rp.liadm.com', 'idsync.rlcdn.com',
      'demdex.net', 'dpm.demdex.net',
      'omtrdc.net', '2o7.net',
      'everesttech.net', 'pixel.everesttech.net',
      'crwdcntrl.net', 'tags.crwdcntrl.net',
      'exelator.com', 'loadm.exelator.com',
      'eyeota.net', 'ps.eyeota.net',
      'intentiq.com', 'b.intentiq.com',
      'aidata.co', 'sync.aidata.co'
    ],

    // Consent Management
    consent: [
      'cookiebot.com', 'consent.cookiebot.com',
      'onetrust.com', 'cdn.cookielaw.org', 'optanon.blob.core.windows.net',
      'trustarc.com', 'consent.trustarc.com', 'choices.trustarc.com',
      'cookiepro.com', 'cdn.cookiepro.com',
      'quantcast.mgr.consensu.org', 'cmp.quantcast.com',
      'didomi.io', 'sdk.privacy-center.org',
      'sourcepoint.com', 'cdn.privacy-mgmt.com',
      'usercentrics.eu', 'app.usercentrics.eu',
      'osano.com', 'cmp.osano.com',
      'evidon.com', 'l.betrad.com'
    ]
  };

  // ==========================================
  // FINGERPRINTING DETECTION
  // ==========================================

  const FINGERPRINT_TECHNIQUES = {
    canvas: {
      patterns: ['toDataURL', 'getImageData', 'toBlob', 'canvas2d', 'isPointInPath'],
      description: 'Canvas Fingerprinting',
      severity: 'high'
    },
    webgl: {
      patterns: ['WEBGL_debug_renderer_info', 'getExtension', 'getParameter', 
                 'getSupportedExtensions', 'UNMASKED_VENDOR_WEBGL', 'UNMASKED_RENDERER_WEBGL'],
      description: 'WebGL Fingerprinting',
      severity: 'high'
    },
    audio: {
      patterns: ['AudioContext', 'OfflineAudioContext', 'createOscillator', 
                 'createAnalyser', 'createBiquadFilter', 'createDynamicsCompressor',
                 'destination.channelCount'],
      description: 'AudioContext Fingerprinting',
      severity: 'high'
    },
    fonts: {
      patterns: ['fonts.check', 'measureText', 'FontFace', 'document.fonts', 
                 'fontFamily', 'offsetWidth', 'offsetHeight', 'getBoundingClientRect'],
      description: 'Font Enumeration',
      severity: 'medium'
    },
    webrtc: {
      patterns: ['RTCPeerConnection', 'createDataChannel', 'createOffer', 
                 'setLocalDescription', 'mozRTCPeerConnection', 'webkitRTCPeerConnection',
                 'RTCIceCandidate'],
      description: 'WebRTC IP Leak',
      severity: 'high'
    },
    battery: {
      patterns: ['getBattery', 'BatteryManager', 'navigator.battery', 'charging', 'chargingTime'],
      description: 'Battery Status API',
      severity: 'medium'
    },
    hardware: {
      patterns: ['hardwareConcurrency', 'deviceMemory', 'maxTouchPoints', 
                 'cpuClass', 'oscpu', 'platform'],
      description: 'Hardware Info',
      severity: 'medium'
    },
    screen: {
      patterns: ['screen.width', 'screen.height', 'screen.colorDepth', 
                 'screen.pixelDepth', 'devicePixelRatio', 'availWidth', 'availHeight',
                 'innerWidth', 'innerHeight', 'outerWidth', 'outerHeight'],
      description: 'Screen Properties',
      severity: 'low'
    },
    plugins: {
      patterns: ['navigator.plugins', 'navigator.mimeTypes', 'ActiveXObject',
                 'plugin.name', 'plugin.filename'],
      description: 'Plugin Detection',
      severity: 'medium'
    },
    timezone: {
      patterns: ['getTimezoneOffset', 'Intl.DateTimeFormat', 'resolvedOptions',
                 'DateTimeFormat', 'timeZone'],
      description: 'Timezone Detection',
      severity: 'low'
    },
    speech: {
      patterns: ['speechSynthesis', 'getVoices', 'SpeechSynthesisVoice'],
      description: 'Speech Synthesis',
      severity: 'medium'
    },
    mediaDevices: {
      patterns: ['enumerateDevices', 'MediaDeviceInfo', 'deviceId', 'groupId'],
      description: 'Media Device Enumeration',
      severity: 'high'
    },
    clientRects: {
      patterns: ['getClientRects', 'getBoundingClientRect', 'elementFromPoint'],
      description: 'Client Rects',
      severity: 'low'
    },
    storage: {
      patterns: ['localStorage', 'sessionStorage', 'indexedDB', 'openDatabase',
                 'webkitStorageInfo', 'storageQuota'],
      description: 'Storage Fingerprinting',
      severity: 'low'
    },
    performance: {
      patterns: ['performance.now', 'performance.timing', 'performance.memory',
                 'performance.getEntries', 'navigationStart'],
      description: 'Performance API',
      severity: 'low'
    },
    webdriver: {
      patterns: ['webdriver', 'domAutomation', 'callPhantom', '__phantomas',
                 '_phantom', '__selenium_unwrapped', '__webdriver_script_fn',
                 '__driver_evaluate', '__webdriver_evaluate', '__fxdriver_evaluate',
                 'phantom', 'callSelenium'],
      description: 'Bot Detection',
      severity: 'low'
    }
  };

  // Known fingerprinting libraries
  const FINGERPRINT_LIBRARIES = [
    'fingerprintjs', 'fingerprint2', 'fp2', 'FingerprintJS',
    'clientjs', 'evercookie', 'panopticlick',
    'iovation', 'deviceatlas', 'wurfl',
    'bluecava', 'maxmind', 'threatmetrix',
    'distil', 'datadome', 'kasada', 'perimeterx',
    'akamai bot manager', 'cloudflare turnstile',
    'recaptcha', 'hcaptcha', 'funcaptcha'
  ];

  // ==========================================
  // PRIVACY ANALYZER CLASS
  // ==========================================

  class EnhancedPrivacyAnalyzer {
    constructor() {
      this.results = {
        url: window.location.href,
        domain: window.location.hostname,
        timestamp: Date.now(),
        trackers: [],
        fingerprinting: [],
        security: {},
        thirdParty: { count: 0, domains: [], categories: {} },
        cookies: { total: 0, firstParty: 0, thirdParty: 0, session: 0, persistent: 0, list: [] },
        requests: { total: 0, blocked: 0 },
        score: 100,
        issues: []
      };
      
      this.currentDomain = this.extractRootDomain(window.location.hostname);
    }

    // Extract root domain (e.g., "subdomain.example.com" -> "example.com")
    extractRootDomain(hostname) {
      const parts = hostname.replace(/^www\./, '').split('.');
      if (parts.length <= 2) return hostname.replace(/^www\./, '');
      // Handle co.uk, com.au, etc.
      const tlds = ['co.uk', 'com.au', 'co.nz', 'co.za', 'com.br', 'co.jp', 'co.kr', 'co.in'];
      const lastTwo = parts.slice(-2).join('.');
      if (tlds.includes(lastTwo)) {
        return parts.slice(-3).join('.');
      }
      return parts.slice(-2).join('.');
    }

    // Main analysis method
    async analyze() {
      console.log('[Privacy Shield] Starting enhanced analysis...');
      
      try {
        // Parallel analysis for performance
        await Promise.all([
          this.detectTrackers(),
          this.detectFingerprinting(),
          this.analyzeThirdParty(),
          this.analyzeCookies()
        ]);
        
        this.checkSecurity();
        this.checkPrivacyHeaders();
        this.detectInlineTrackers();
        this.calculateScore();
        
        console.log('[Privacy Shield] Analysis complete. Score:', this.results.score);
        console.log('[Privacy Shield] Trackers:', this.results.trackers.length);
        console.log('[Privacy Shield] Fingerprinting:', this.results.fingerprinting.length);
        console.log('[Privacy Shield] Third-party:', this.results.thirdParty.count);
        
        return this.results;
      } catch (error) {
        console.error('[Privacy Shield] Analysis error:', error);
        return this.results;
      }
    }

    // ==========================================
    // TRACKER DETECTION
    // ==========================================

    async detectTrackers() {
      const foundTrackers = new Map();
      
      // Collect all resource URLs
      const resources = this.collectPageResources();
      
      // Check each resource against tracker database
      for (const [category, patterns] of Object.entries(TRACKER_DATABASE)) {
        for (const pattern of patterns) {
          const patternLower = pattern.toLowerCase();
          
          for (const resource of resources) {
            if (resource.toLowerCase().includes(patternLower)) {
              const key = pattern;
              if (!foundTrackers.has(key)) {
                foundTrackers.set(key, {
                  pattern: pattern,
                  category: category,
                  name: this.getTrackerName(pattern),
                  sources: []
                });
              }
              const tracker = foundTrackers.get(key);
              if (!tracker.sources.includes(resource) && tracker.sources.length < 3) {
                tracker.sources.push(resource);
              }
            }
          }
        }
      }
      
      // Check page HTML for inline tracker code
      this.detectInlineTrackerCode(foundTrackers);
      
      this.results.trackers = Array.from(foundTrackers.values());
      console.log('[Privacy Shield] Trackers detected:', this.results.trackers.length);
    }

    collectPageResources() {
      const resources = new Set();
      
      // Scripts
      document.querySelectorAll('script[src]').forEach(el => {
        resources.add(el.src);
      });
      
      // Images (tracking pixels)
      document.querySelectorAll('img[src]').forEach(el => {
        resources.add(el.src);
      });
      
      // Iframes
      document.querySelectorAll('iframe[src]').forEach(el => {
        resources.add(el.src);
      });
      
      // Links (preconnect, preload, etc.)
      document.querySelectorAll('link[href]').forEach(el => {
        resources.add(el.href);
      });
      
      // Noscript content (often contains tracking pixels)
      document.querySelectorAll('noscript').forEach(el => {
        const html = el.innerHTML;
        const imgMatches = html.match(/src=["']([^"']+)["']/gi);
        if (imgMatches) {
          imgMatches.forEach(match => {
            const url = match.replace(/src=["']|["']/gi, '');
            if (url.startsWith('http')) resources.add(url);
          });
        }
      });

      return Array.from(resources);
    }

    detectInlineTrackerCode(foundTrackers) {
      const inlineScripts = Array.from(document.querySelectorAll('script:not([src])'))
        .map(s => s.textContent || '')
        .join(' ')
        .toLowerCase();
      
      // Common inline tracker patterns
      const inlinePatterns = [
        { pattern: 'gtag(', name: 'Google Analytics (gtag)', category: 'analytics' },
        { pattern: 'ga(\'create\'', name: 'Google Analytics (ga.js)', category: 'analytics' },
        { pattern: 'ga(\'send\'', name: 'Google Analytics (ga.js)', category: 'analytics' },
        { pattern: '_gaq.push', name: 'Google Analytics (legacy)', category: 'analytics' },
        { pattern: 'fbq(', name: 'Facebook Pixel', category: 'analytics' },
        { pattern: 'fbevents.js', name: 'Facebook Events', category: 'analytics' },
        { pattern: 'twq(', name: 'Twitter Pixel', category: 'analytics' },
        { pattern: 'lintrk', name: 'LinkedIn Insight', category: 'analytics' },
        { pattern: 'pintrk', name: 'Pinterest Tag', category: 'analytics' },
        { pattern: 'snaptr', name: 'Snapchat Pixel', category: 'analytics' },
        { pattern: 'ttq.', name: 'TikTok Pixel', category: 'analytics' },
        { pattern: 'hj(\'', name: 'Hotjar', category: 'analytics' },
        { pattern: 'hotjar', name: 'Hotjar', category: 'analytics' },
        { pattern: 'clarity(', name: 'Microsoft Clarity', category: 'analytics' },
        { pattern: 'mixpanel', name: 'Mixpanel', category: 'analytics' },
        { pattern: 'amplitude', name: 'Amplitude', category: 'analytics' },
        { pattern: 'analytics.track', name: 'Segment', category: 'analytics' },
        { pattern: 'intercom', name: 'Intercom', category: 'analytics' },
        { pattern: 'drift', name: 'Drift', category: 'analytics' },
        { pattern: 'hubspot', name: 'HubSpot', category: 'analytics' },
        { pattern: 'marketo', name: 'Marketo', category: 'analytics' },
        { pattern: 'pardot', name: 'Pardot', category: 'analytics' },
        { pattern: 'optimizely', name: 'Optimizely', category: 'analytics' },
        { pattern: 'google_ad', name: 'Google Ads', category: 'advertising' },
        { pattern: 'googletag', name: 'Google Publisher Tag', category: 'advertising' },
        { pattern: 'adsbygoogle', name: 'Google AdSense', category: 'advertising' },
        { pattern: 'criteo', name: 'Criteo', category: 'advertising' },
        { pattern: 'taboola', name: 'Taboola', category: 'advertising' },
        { pattern: 'outbrain', name: 'Outbrain', category: 'advertising' }
      ];
      
      for (const { pattern, name, category } of inlinePatterns) {
        if (inlineScripts.includes(pattern.toLowerCase())) {
          if (!foundTrackers.has(pattern)) {
            foundTrackers.set(pattern, {
              pattern: pattern,
              category: category,
              name: name,
              sources: ['inline script']
            });
          }
        }
      }
    }

    getTrackerName(pattern) {
      const nameMap = {
        'google-analytics': 'Google Analytics',
        'googletagmanager': 'Google Tag Manager',
        'gtag': 'Google Analytics',
        'facebook': 'Meta (Facebook)',
        'fbevents': 'Facebook Pixel',
        'twitter': 'Twitter/X',
        'linkedin': 'LinkedIn',
        'tiktok': 'TikTok',
        'hotjar': 'Hotjar',
        'clarity': 'Microsoft Clarity',
        'fullstory': 'FullStory',
        'mixpanel': 'Mixpanel',
        'amplitude': 'Amplitude',
        'segment': 'Segment',
        'heap': 'Heap Analytics',
        'intercom': 'Intercom',
        'drift': 'Drift',
        'hubspot': 'HubSpot',
        'doubleclick': 'Google Ads',
        'googlesyndication': 'Google AdSense',
        'criteo': 'Criteo',
        'taboola': 'Taboola',
        'outbrain': 'Outbrain',
        'disqus': 'Disqus',
        'addthis': 'AddThis',
        'sharethis': 'ShareThis'
      };
      
      for (const [key, name] of Object.entries(nameMap)) {
        if (pattern.toLowerCase().includes(key)) {
          return name;
        }
      }
      
      return pattern.split('.')[0].replace(/[-_]/g, ' ');
    }

    // ==========================================
    // FINGERPRINTING DETECTION
    // ==========================================

    async detectFingerprinting() {
      const detectedTechniques = new Map();
      
      // Get all script content
      const scriptContent = this.getScriptContent();
      
      // Check for fingerprinting techniques
      for (const [technique, config] of Object.entries(FINGERPRINT_TECHNIQUES)) {
        const matches = [];
        
        for (const pattern of config.patterns) {
          if (scriptContent.includes(pattern)) {
            matches.push(pattern);
          }
        }
        
        // Only flag if multiple patterns from the same technique are found
        // This reduces false positives
        const threshold = technique === 'canvas' || technique === 'webgl' || technique === 'audio' ? 2 : 1;
        
        if (matches.length >= threshold) {
          detectedTechniques.set(technique, {
            technique: config.description,
            severity: config.severity,
            patterns: matches.slice(0, 3),
            detected: true
          });
        }
      }
      
      // Check for known fingerprinting libraries
      for (const library of FINGERPRINT_LIBRARIES) {
        if (scriptContent.toLowerCase().includes(library.toLowerCase())) {
          detectedTechniques.set('library_' + library, {
            technique: `Fingerprinting Library: ${library}`,
            severity: 'high',
            patterns: [library],
            detected: true
          });
        }
      }
      
      this.results.fingerprinting = Array.from(detectedTechniques.values());
      console.log('[Privacy Shield] Fingerprinting techniques:', this.results.fingerprinting.length);
    }

    getScriptContent() {
      let content = '';
      
      // Inline scripts
      document.querySelectorAll('script:not([src])').forEach(script => {
        content += ' ' + (script.textContent || '');
      });
      
      // Event handlers
      document.querySelectorAll('[onclick], [onload], [onerror], [onmouseover]').forEach(el => {
        content += ' ' + (el.getAttribute('onclick') || '');
        content += ' ' + (el.getAttribute('onload') || '');
        content += ' ' + (el.getAttribute('onerror') || '');
      });
      
      return content;
    }

    detectInlineTrackers() {
      // This is called after main detection for additional inline analysis
      const scripts = document.querySelectorAll('script:not([src])');
      
      scripts.forEach(script => {
        const text = script.textContent || '';
        
        // Detect base64 encoded tracking
        if (text.includes('atob(') || text.includes('btoa(')) {
          const base64Matches = text.match(/atob\(['"]([\w+/=]+)['"]\)/g);
          if (base64Matches) {
            try {
              base64Matches.forEach(match => {
                const encoded = match.match(/['"]([\w+/=]+)['"]/);
                if (encoded) {
                  const decoded = atob(encoded[1]).toLowerCase();
                  // Check if decoded content contains tracking URLs
                  if (decoded.includes('analytics') || decoded.includes('track') || 
                      decoded.includes('pixel') || decoded.includes('beacon')) {
                    this.results.issues.push({
                      type: 'hidden_tracking',
                      description: 'Base64 encoded tracking code detected',
                      severity: 'high'
                    });
                  }
                }
              });
            } catch (e) {
              // Invalid base64, ignore
            }
          }
        }
      });
    }

    // ==========================================
    // SECURITY CHECKS
    // ==========================================

    checkSecurity() {
      this.results.security = {
        https: location.protocol === 'https:',
        mixedContent: this.detectMixedContent(),
        csp: this.hasCSP(),
        hsts: false, // Can't reliably detect from content script
        xFrameOptions: false,
        xContentTypeOptions: false
      };
    }

    detectMixedContent() {
      if (location.protocol !== 'https:') return false;
      
      const insecureSelectors = [
        'img[src^="http:"]',
        'script[src^="http:"]',
        'link[href^="http:"]',
        'iframe[src^="http:"]',
        'video[src^="http:"]',
        'audio[src^="http:"]',
        'source[src^="http:"]',
        'object[data^="http:"]',
        'embed[src^="http:"]'
      ];
      
      for (const selector of insecureSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          const url = el.src || el.href || el.data;
          // Exclude localhost and local network
          if (url && !url.includes('localhost') && !url.includes('127.0.0.1') && 
              !url.includes('192.168.') && !url.includes('10.0.')) {
            return true;
          }
        }
      }
      
      return false;
    }

    hasCSP() {
      // Check for CSP meta tag
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      return !!cspMeta;
    }

    checkPrivacyHeaders() {
      // Check for privacy-related meta tags
      const dntMeta = document.querySelector('meta[name="referrer"]');
      const privacyMeta = document.querySelector('meta[name="privacy"]');
      
      if (dntMeta) {
        this.results.security.referrerPolicy = dntMeta.content;
      }
    }

    // ==========================================
    // THIRD-PARTY ANALYSIS
    // ==========================================

    async analyzeThirdParty() {
      const thirdPartyDomains = new Map();
      const categories = {
        cdn: 0,
        analytics: 0,
        advertising: 0,
        social: 0,
        media: 0,
        fonts: 0,
        other: 0
      };
      
      const resources = this.collectPageResources();
      
      for (const resource of resources) {
        try {
          const url = new URL(resource);
          const domain = this.extractRootDomain(url.hostname);
          
          if (domain !== this.currentDomain && !domain.endsWith('.' + this.currentDomain)) {
            if (!thirdPartyDomains.has(domain)) {
              const category = this.categorizeThirdPartyDomain(domain);
              thirdPartyDomains.set(domain, {
                domain: domain,
                category: category,
                count: 0
              });
              categories[category]++;
            }
            thirdPartyDomains.get(domain).count++;
          }
        } catch (e) {
          // Invalid URL
        }
      }
      
      this.results.thirdParty = {
        count: thirdPartyDomains.size,
        domains: Array.from(thirdPartyDomains.keys()).slice(0, 50),
        details: Array.from(thirdPartyDomains.values()).slice(0, 50),
        categories: categories
      };
    }

    categorizeThirdPartyDomain(domain) {
      const cdnDomains = ['cloudflare', 'cloudfront', 'akamai', 'fastly', 'jsdelivr', 
                         'unpkg', 'cdnjs', 'bootstrapcdn', 'googleapis', 'gstatic'];
      const fontDomains = ['fonts.googleapis', 'fonts.gstatic', 'typekit', 'fontawesome', 
                          'use.fontawesome'];
      const mediaDomains = ['youtube', 'vimeo', 'twimg', 'imgur', 'giphy', 'flickr'];
      
      const domainLower = domain.toLowerCase();
      
      // Check if it's a known tracker
      for (const patterns of Object.values(TRACKER_DATABASE)) {
        for (const pattern of patterns) {
          if (domainLower.includes(pattern.split('.')[0].toLowerCase())) {
            if (TRACKER_DATABASE.advertising.some(p => pattern.includes(p.split('.')[0]))) {
              return 'advertising';
            }
            if (TRACKER_DATABASE.social.some(p => pattern.includes(p.split('.')[0]))) {
              return 'social';
            }
            return 'analytics';
          }
        }
      }
      
      if (cdnDomains.some(cdn => domainLower.includes(cdn))) return 'cdn';
      if (fontDomains.some(font => domainLower.includes(font))) return 'fonts';
      if (mediaDomains.some(media => domainLower.includes(media))) return 'media';
      
      return 'other';
    }

    // ==========================================
    // COOKIE ANALYSIS
    // ==========================================

    async analyzeCookies() {
      const cookies = document.cookie.split(';').filter(c => c.trim().length > 0);
      
      const cookieDetails = {
        total: cookies.length,
        firstParty: 0,
        thirdParty: 0,
        session: 0,
        persistent: 0,
        list: []
      };
      
      // Analyze each cookie
      cookies.forEach(cookie => {
        const [name] = cookie.trim().split('=');
        const isThirdParty = this.isLikelyThirdPartyCookie(name);
        
        if (isThirdParty) {
          cookieDetails.thirdParty++;
        } else {
          cookieDetails.firstParty++;
        }
        
        if (cookieDetails.list.length < 20) {
          cookieDetails.list.push({
            name: name.trim().substring(0, 50),
            isThirdParty: isThirdParty
          });
        }
      });
      
      // Estimate third-party cookies based on trackers
      const estimatedThirdParty = Math.max(
        cookieDetails.thirdParty,
        Math.min(this.results.trackers.length * 2, cookies.length)
      );
      cookieDetails.thirdParty = estimatedThirdParty;
      cookieDetails.firstParty = cookies.length - estimatedThirdParty;
      
      this.results.cookies = cookieDetails;
    }

    isLikelyThirdPartyCookie(name) {
      const thirdPartyPatterns = [
        '_ga', '_gid', '_gat', '__utm', '_gcl', // Google
        '_fb', '_fbc', '_fbp', // Facebook
        'IDE', 'DSID', '__gads', 'test_cookie', // DoubleClick
        '_pin_unauth', // Pinterest
        'li_', 'bcookie', 'bscookie', // LinkedIn
        '_tt_', // TikTok
        'optimizely', '_vis_opt', // A/B testing
        'mp_', // Mixpanel
        'ajs_', // Segment
        '_hp2', // Heap
        '_hj', // Hotjar
        '_clck', '_clsk', // Clarity
        'intercom', // Intercom
        '__stripe', // Stripe
        'hubspot', '__hs', // HubSpot
        '_mkto', // Marketo
        '__cf', 'cf_', // Cloudflare
        '__cfduid', // Cloudflare
        'AMCV_', 's_', // Adobe
        '_pk_', // Matomo
        'kwai', 'snapchat', 'twitter'
      ];
      
      const nameLower = name.toLowerCase();
      return thirdPartyPatterns.some(pattern => nameLower.startsWith(pattern.toLowerCase()));
    }

    // ==========================================
    // SCORE CALCULATION
    // ==========================================

    calculateScore() {
      let score = 100;
      const deductions = [];
      
      // === TRACKERS (max -30 points) ===
      const trackerCount = this.results.trackers.length;
      if (trackerCount > 0) {
        // More aggressive deduction for trackers
        // 0 trackers = 0, 1-3 = -5 each, 4-10 = -3 each, 10+ = -2 each
        let trackerPenalty = 0;
        if (trackerCount <= 3) {
          trackerPenalty = trackerCount * 5;
        } else if (trackerCount <= 10) {
          trackerPenalty = 15 + (trackerCount - 3) * 3;
        } else {
          trackerPenalty = 36 + (trackerCount - 10) * 2;
        }
        trackerPenalty = Math.min(trackerPenalty, 30);
        score -= trackerPenalty;
        deductions.push({ reason: 'trackers', points: trackerPenalty, count: trackerCount });
      }
      
      // === FINGERPRINTING (max -25 points) ===
      const fpCount = this.results.fingerprinting.length;
      if (fpCount > 0) {
        // Check severity levels
        const highSeverity = this.results.fingerprinting.filter(f => f.severity === 'high').length;
        const medSeverity = this.results.fingerprinting.filter(f => f.severity === 'medium').length;
        
        let fpPenalty = highSeverity * 8 + medSeverity * 4 + (fpCount - highSeverity - medSeverity) * 2;
        fpPenalty = Math.min(fpPenalty, 25);
        score -= fpPenalty;
        deductions.push({ reason: 'fingerprinting', points: fpPenalty, count: fpCount });
      }
      
      // === SECURITY (max -20 points) ===
      let securityPenalty = 0;
      
      if (! this.results.security.https) {
        securityPenalty += 15;
        deductions.push({ reason: 'no_https', points: 15 });
      }
      
      if (this.results.security.mixedContent) {
        securityPenalty += 5;
        deductions.push({ reason: 'mixed_content', points: 5 });
      }
      
      score -= Math.min(securityPenalty, 20);
      
      // === THIRD-PARTY DOMAINS (max -15 points) ===
      const tpCount = this.results.thirdParty.count;
      if (tpCount > 0) {
        // Categorized penalty
        const categories = this.results.thirdParty.categories;
        let tpPenalty = 0;
        
        // Advertising and analytics third parties are worse
        tpPenalty += (categories.advertising || 0) * 2;
        tpPenalty += (categories.analytics || 0) * 1.5;
        tpPenalty += (categories.social || 0) * 1;
        tpPenalty += (categories.other || 0) * 0.5;
        // CDN, fonts, media are less concerning
        tpPenalty += (categories.cdn || 0) * 0.1;
        tpPenalty += (categories.fonts || 0) * 0.1;
        tpPenalty += (categories.media || 0) * 0.2;
        
        tpPenalty = Math.min(Math.round(tpPenalty), 15);
        score -= tpPenalty;
        deductions.push({ reason: 'third_party', points: tpPenalty, count: tpCount });
      }
      
      // === COOKIES (max -10 points) ===
      const tpCookies = this.results.cookies.thirdParty;
      if (tpCookies > 0) {
        // 1 point per 2 third-party cookies
        const cookiePenalty = Math.min(Math.ceil(tpCookies / 2), 10);
        score -= cookiePenalty;
        deductions.push({ reason: 'third_party_cookies', points: cookiePenalty, count: tpCookies });
      }
      
      // Store deductions for debugging
      this.results.scoreBreakdown = deductions;
      this.results.score = Math.max(0, Math.round(score));
      
      console.log('[Privacy Shield] Score breakdown:', deductions);
    }
  }

  // ==========================================
  // SCAN EXECUTION
  // ==========================================

  function runScan() {
    console.log('[Privacy Shield] Running enhanced scan...');
    
    try {
      const analyzer = new EnhancedPrivacyAnalyzer();
      
      analyzer.analyze().then(results => {
        // Send results to service worker
        chrome.runtime.sendMessage({
          type: 'SCAN_COMPLETE',
          data: results
        }, response => {
          if (chrome.runtime.lastError) {
            console.log('[Privacy Shield] Error sending results:', chrome.runtime.lastError.message);
          } else {
            console.log('[Privacy Shield] Results sent successfully');
          }
        });
      });
      
    } catch (error) {
      console.error('[Privacy Shield] Scan error:', error);
    }
  }

  // Listen for scan requests
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Privacy Shield] Received message:', message.type);
    
    if (message.type === 'RUN_SCAN') {
      runScan();
      sendResponse({ success: true });
    }
    return true;
  });

  // Auto-scan when page is ready
  function initScan() {
    // Wait for page to fully load dynamic content
    setTimeout(runScan, 1000);
  }

  if (document.readyState === 'complete') {
    initScan();
  } else {
    window.addEventListener('load', initScan);
  }

})();