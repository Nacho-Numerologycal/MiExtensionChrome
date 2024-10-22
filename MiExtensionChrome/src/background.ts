/// <reference types="chrome"/>
chrome.runtime.onMessage.addListener((request: any, _: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (request.action === "openFolderPicker") {
      chrome.windows.create({
        url: 'chrome://downloads',
        type: 'popup',
        width: 800,
        height: 600
      }, (window) => {
        chrome.downloads.onChanged.addListener(function listener(downloadDelta: chrome.downloads.DownloadDelta) {
          if (downloadDelta.state && downloadDelta.state.current === "complete") {
            chrome.downloads.search({id: downloadDelta.id}, (downloads: chrome.downloads.DownloadItem[]) => {
              if (downloads[0]) {
                const folderPath = downloads[0].filename.substring(0, downloads[0].filename.lastIndexOf('\\'));
                sendResponse({folder: folderPath});
                chrome.downloads.onChanged.removeListener(listener);
                if (window && window.id) {
                  chrome.windows.remove(window.id);
                }
              }
            });
          }
        });
      });
      return true; // Indicates that the response will be sent asynchronously
    }
  });
