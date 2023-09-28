// This content script searches for iframes with PDF src
const iframes = document.querySelectorAll('iframe[src*=".pdf"]')
const pdfs = Array.from(iframes).map(iframe => iframe.src)
console.log(pdfs)

// Store the PDFs in local storage
browser.storage.local.set({ pdfs })

// Listen for messages from the background script
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.updatePDFs) {
    // Update the list of PDFs
    const iframes = document.querySelectorAll('iframe[src*=".pdf"]')
    const pdfs = Array.from(iframes).map(iframe => iframe.src)

    // Store the updated PDFs in local storage
    browser.storage.local.set({ pdfs })
  } else if (request.downloadPDF) {
    // Use the browser API to download the PDF directly from the content script
    browser.downloads.download({ url: request.downloadPDF })
  }
})
