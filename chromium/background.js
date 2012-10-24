/*chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
  chrome.pageAction.show(sender.tab.id);
  sendResponse({});
});*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  chrome.pageAction.show(tabId);
});
