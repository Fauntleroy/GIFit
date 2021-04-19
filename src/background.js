const browser = global.browser || global.chrome;

browser.contextMenus.create({
  id: 'gifit',
  title: 'Create GIF',
  contexts: ['all']
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'gifit') {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {
        extension: 'gifit',
        action: 'initialize'
      });
    });
  }
});
