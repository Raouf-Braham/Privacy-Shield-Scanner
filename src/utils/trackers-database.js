/**
 * Privacy Shield Scanner - Trackers Database
 * Comprehensive list of known trackers, fingerprinting scripts, and analytics
 */

const TrackersDatabase = {
  // Analytics & Tracking
  analytics: [
    { name: 'Google Analytics', patterns: ['google-analytics. com', 'googletagmanager.com', 'gtag/js', 'analytics.js', 'ga.js'] },
    { name: 'Google Tag Manager', patterns: ['googletagmanager.com', 'gtm.js'] },
    { name: 'Facebook Pixel', patterns: ['connect.facebook.net', 'fbevents.js', 'facebook. com/tr'] },
    { name: 'Twitter Analytics', patterns: ['static.ads-twitter.com', 'analytics.twitter.com', 't.co/i/adsct'] },
    { name: 'LinkedIn Insight', patterns: ['snap.licdn.com', 'linkedin.com/px'] },
    { name: 'TikTok Pixel', patterns: ['analytics.tiktok.com', 'tiktok.com/i18n'] },
    { name: 'Pinterest Tag', patterns: ['pintrk', 's.pinimg.com', 'ct.pinterest.com'] },
    { name: 'Snapchat Pixel', patterns: ['tr.snapchat.com', 'sc-static.net'] },
    { name: 'Adobe Analytics', patterns: ['omtrdc.net', 'demdex.net', '2o7.net'] },
    { name: 'Mixpanel', patterns: ['mixpanel.com', 'mxpnl.com'] },
    { name: 'Amplitude', patterns: ['amplitude.com', 'cdn.amplitude.com'] },
    { name: 'Segment', patterns: ['segment.com', 'segment.io', 'cdn.segment.com'] },
    { name: 'Heap Analytics', patterns: ['heap.io', 'heapanalytics.com'] },
    { name: 'Hotjar', patterns: ['hotjar.com', 'static.hotjar.com'] },
    { name: 'FullStory', patterns: ['fullstory.com', 'rs.fullstory.com'] },
    { name: 'Crazy Egg', patterns: ['crazyegg.com', 'script.crazyegg.com'] },
    { name: 'Lucky Orange', patterns: ['luckyorange.com', 'luckyorange.net'] },
    { name: 'MouseFlow', patterns: ['mouseflow. com', 'o2.mouseflow.com'] },
    { name: 'Pendo', patterns: ['pendo. io', 'cdn.pendo.io'] },
    { name: 'Intercom', patterns: ['intercom. io', 'widget.intercom.io'] },
    { name: 'Drift', patterns: ['drift.com', 'js. driftt.com'] },
    { name: 'HubSpot', patterns: ['hubspot.com', 'hs-scripts.com', 'hs-analytics.net'] },
    { name: 'Marketo', patterns: ['marketo. com', 'munchkin. marketo.net'] },
    { name: 'Pardot', patterns: ['pardot. com', 'pi.pardot.com'] },
    { name: 'Matomo', patterns: ['matomo. js', 'piwik.js', 'matomo.cloud'] },
    { name: 'Plausible', patterns: ['plausible.io'] },
    { name: 'Fathom', patterns: ['usefathom.com', 'cdn.usefathom.com'] },
    { name: 'Simple Analytics', patterns: ['simpleanalytics.com', 'simpleanalyticscdn.com'] },
    { name: 'Clicky', patterns: ['clicky. com', 'static.getclicky.com'] },
    { name: 'Yandex Metrica', patterns: ['mc.yandex.ru', 'metrika.yandex. ru'] },
    { name: 'Baidu Analytics', patterns: ['hm.baidu.com', 'tongji.baidu.com'] }
  ],
  
  // Advertising Networks
  advertising: [
    { name: 'Google Ads', patterns: ['googlesyndication.com', 'doubleclick.net', 'googleadservices.com'] },
    { name: 'Google AdSense', patterns: ['pagead2. googlesyndication.com', 'adservice.google.com'] },
    { name: 'Facebook Ads', patterns: ['facebook.com/tr', 'fbcdn.net'] },
    { name: 'Amazon Ads', patterns: ['amazon-adsystem.com', 'assoc-amazon.com'] },
    { name: 'Microsoft Ads', patterns: ['bing.com/bat', 'bat.bing.com', 'clarity.ms'] },
    { name: 'Criteo', patterns: ['criteo.com', 'criteo.net'] },
    { name: 'Taboola', patterns: ['taboola.com', 'trc.taboola.com'] },
    { name: 'Outbrain', patterns: ['outbrain.com', 'widgets.outbrain.com'] },
    { name: 'AppNexus', patterns: ['appnexus.com', 'adnxs.com'] },
    { name: 'MediaMath', patterns: ['mediamath.com', 'mathtag.com'] },
    { name: 'The Trade Desk', patterns: ['thetradedesk.com', 'adsrvr.org'] },
    { name: 'AdRoll', patterns: ['adroll.com', 'd.adroll.com'] },
    { name: 'Yahoo Ads', patterns: ['ads.yahoo.com', 'gemini.yahoo.com'] },
    { name: 'Quantcast', patterns: ['quantcast. com', 'quantserve. com'] },
    { name: 'Sharethrough', patterns: ['sharethrough. com'] },
    { name: 'OpenX', patterns: ['openx. net', 'openx.com'] },
    { name: 'PubMatic', patterns: ['pubmatic.com'] },
    { name: 'Rubicon', patterns: ['rubiconproject.com'] },
    { name: 'Index Exchange', patterns: ['indexexchange.com', 'casalemedia.com'] },
    { name: 'Verizon Media', patterns: ['oath.com', 'advertising.com'] }
  ],
  
  // Fingerprinting Techniques
  fingerprinting: [
    { name: 'Canvas Fingerprinting', patterns: ['toDataURL', 'getImageData', 'canvas fingerprint'] },
    { name: 'WebGL Fingerprinting', patterns: ['getExtension', 'WEBGL_debug_renderer_info', 'getParameter'] },
    { name: 'AudioContext Fingerprinting', patterns: ['AudioContext', 'OfflineAudioContext', 'createOscillator'] },
    { name: 'Font Fingerprinting', patterns: ['fonts.check', 'measureText', 'font detection'] },
    { name: 'Screen Fingerprinting', patterns: ['screen.width', 'screen.height', 'screen.colorDepth', 'devicePixelRatio'] },
    { name: 'Battery API', patterns: ['navigator.getBattery', 'BatteryManager'] },
    { name: 'Hardware Concurrency', patterns: ['navigator.hardwareConcurrency'] },
    { name: 'Device Memory', patterns: ['navigator.deviceMemory'] },
    { name: 'Plugin Detection', patterns: ['navigator.plugins', 'navigator.mimeTypes'] },
    { name: 'Timezone Detection', patterns: ['getTimezoneOffset', 'Intl.DateTimeFormat'] },
    { name: 'WebRTC Leak', patterns: ['RTCPeerConnection', 'createDataChannel', 'createOffer'] },
    { name: 'Speech Synthesis', patterns: ['speechSynthesis. getVoices'] },
    { name: 'Keyboard Layout', patterns: ['KeyboardLayoutMap', 'keyboard.getLayoutMap'] }
  ],
  
  // Social Media Widgets & Embeds
  social: [
    { name: 'Facebook SDK', patterns: ['connect.facebook.net', 'facebook.com/plugins'] },
    { name: 'Twitter Widgets', patterns: ['platform.twitter.com', 'twitter.com/widgets'] },
    { name: 'LinkedIn Plugins', patterns: ['platform.linkedin. com'] },
    { name: 'Pinterest Widgets', patterns: ['assets.pinterest.com', 'widgets.pinterest.com'] },
    { name: 'Instagram Embed', patterns: ['instagram.com/embed'] },
    { name: 'YouTube Embed', patterns: ['youtube.com/embed', 'youtube-nocookie.com'] },
    { name: 'Vimeo Embed', patterns: ['player.vimeo.com'] },
    { name: 'Reddit Embed', patterns: ['embed.reddit.com', 'redditstatic.com'] },
    { name: 'Disqus', patterns: ['disqus.com', 'disquscdn.com'] },
    { name: 'AddThis', patterns: ['addthis.com', 'addthisedge.com'] },
    { name: 'ShareThis', patterns: ['sharethis.com'] },
    { name: 'Gravatar', patterns: ['gravatar. com', 'secure.gravatar.com'] }
  ],
  
  // Customer Data Platforms & Tag Managers
  cdp: [
    { name: 'Tealium', patterns: ['tealium.com', 'tealiumiq.com', 'tags.tiqcdn.com'] },
    { name: 'Ensighten', patterns: ['ensighten.com', 'nexus.ensighten.com'] },
    { name: 'Signal', patterns: ['thebrighttag.com', 'btstatic.com'] },
    { name: 'Commanders Act', patterns: ['tagcommander.com'] },
    { name: 'Relay42', patterns: ['relay42.com'] },
    { name: 'mParticle', patterns: ['mparticle.com', 'jssdkcdns.mparticle.com'] },
    { name: 'Treasure Data', patterns: ['treasuredata.com', 'in.treasuredata.com'] },
    { name: 'Rudderstack', patterns: ['rudderstack.com', 'rudderlabs.com'] }
  ],
  
  // Session Recording & Heatmaps
  sessionRecording: [
    { name: 'LogRocket', patterns: ['logrocket.com', 'cdn.logrocket.io'] },
    { name: 'Smartlook', patterns: ['smartlook.com', 'rec.smartlook.com'] },
    { name: 'Inspectlet', patterns: ['inspectlet.com', 'cdn.inspectlet.com'] },
    { name: 'SessionCam', patterns: ['sessioncam.com', 'd2oh4tlt9mrke9.cloudfront.net'] },
    { name: 'Clicktale', patterns: ['clicktale.com', 'clicktale.net'] },
    { name: 'UserTesting', patterns: ['usertesting.com'] },
    { name: 'Contentsquare', patterns: ['contentsquare.com', 'contentsquare.net'] }
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TrackersDatabase;
}