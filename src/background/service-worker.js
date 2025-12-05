/**
 * Privacy Shield Scanner - Background Service Worker
 * With programmatic script injection fallback
 */

const scanResults = new Map();

function getBadgeColor(score) {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#84cc16';
  if (score >= 40) return '#eab308';
  if (score >= 20) return '#f97316';
  return '#ef4444';
}

function updateBadge(tabId, score) {
  try {
    chrome.action.setBadgeText({ tabId, text: score.toString() });
    chrome.action. setBadgeBackgroundColor({ tabId, color: getBadgeColor(score) });
  } catch (error) {
    console.log('[SW] Badge update error:', error);
  }
}

// Inject content script programmatically
async function injectContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['src/content/content-script.js']
    });
    console.log('[SW] Content script injected into tab:', tabId);
    return true;
  } catch (error) {
    console.log('[SW] Could not inject script:', error. message);
    return false;
  }
}

// Send message to tab with retry and injection fallback
async function sendMessageToTab(tabId, message, retryCount = 0) {
  return new Promise(async (resolve) => {
    try {
      chrome.tabs.sendMessage(tabId, message, async (response) => {
        if (chrome.runtime.lastError) {
          console.log('[SW] Tab not ready:', chrome.runtime.lastError.message);
          
          // Try to inject content script if first attempt fails
          if (retryCount === 0) {
            console.log('[SW] Attempting to inject content script...');
            const injected = await injectContentScript(tabId);
            
            if (injected) {
              // Wait a bit for script to initialize, then retry
              setTimeout(async () => {
                const result = await sendMessageToTab(tabId, message, retryCount + 1);
                resolve(result);
              }, 500);
              return;
            }
          }
          resolve(null);
        } else {
          resolve(response);
        }
      });
    } catch (error) {
      console.log('[SW] Send message error:', error);
      resolve(null);
    }
  });
}

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  if (message.type === 'SCAN_COMPLETE') {
    const tabId = sender.tab?. id;
    if (tabId) {
      console.log('[SW] Scan complete for tab:', tabId, 'Score:', message.data.score);
      scanResults.set(tabId, message.data);
      updateBadge(tabId, message.data.score);
    }
    sendResponse({ success: true });
    return true;
  }
  
  if (message.type === 'GET_SCAN_RESULTS') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      console.log('[SW] Getting results for tab:', tabId);
      
      if (tabId && scanResults.has(tabId)) {
        console.log('[SW] Found cached results');
        sendResponse({ data: scanResults.get(tabId) });
      } else {
        console.log('[SW] No cached results');
        sendResponse({ data: null });
      }
    });
    return true;
  }
  
  if (message.type === 'REQUEST_SCAN') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        console.log('[SW] Requesting scan for tab:', tabs[0].id);
        await sendMessageToTab(tabs[0].id, { type: 'RUN_SCAN' });
      }
      sendResponse({ success: true });
    });
    return true;
  }
  
  return true;
});

// Tab update listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    scanResults.delete(tabId);
  }
  
  if (changeInfo.status === 'complete' && tab. url) {
    if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
      try {
        chrome.action.setBadgeText({ tabId, text: '.. .' });
        chrome.action. setBadgeBackgroundColor({ tabId, color: '#6b7280' });
      } catch (error) {
        // Ignore
      }
    }
  }
});

// Cleanup when tab closes
chrome.tabs.onRemoved.addListener((tabId) => {
  scanResults.delete(tabId);
});

console.log('[SW] Privacy Shield Scanner - Service Worker initialized');