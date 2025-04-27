// background.js  (MV-3 service-worker)
chrome.action.onClicked.addListener(openSearchTab);
chrome.commands.onCommand.addListener(cmd => {
  if (cmd === "_execute_action") openSearchTab();
});

function openSearchTab() {
  chrome.tabs.create({ url: chrome.runtime.getURL("search.html") });
}
