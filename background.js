browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.downloadPDF) {
    // Use the browser API to download the PDF
    browser.downloads.download({
      url: request.downloadPDF
    })
  }
})

browser.tabs.onActivated.addListener(function (activeInfo) {
  // Ensure activeInfo.tabId is available and is a valid tab ID
  if (activeInfo && activeInfo.tabId) {
    // Send a message to the content script to update the list of PDFs
    browser.tabs.sendMessage(activeInfo.tabId, { updatePDFs: true })
  }
})
