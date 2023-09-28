document.addEventListener('DOMContentLoaded', function () {
  // Function to update the list of PDFs
  function updatePDFList () {
    // Get PDFs from storage
    browser.storage.local.get('pdfs', function (data) {
      // Change from chrome.storage.local.get to browser.storage.local.get
      const pdfList = document.getElementById('pdfList')
      const pdfs = data.pdfs || []

      if (pdfs.length === 0) {
        pdfList.innerHTML = '<p>No PDFs found on this page.</p>'
      } else {
        pdfList.innerHTML = '' // Clear existing list

        pdfs.forEach(function (pdf, index) {
          const fileName = pdf.substring(
            pdf.lastIndexOf('/') + 1,
            pdf.lastIndexOf('.pdf')
          )

          const ol = document.createElement('ol')
          const listItem = document.createElement('li')
          const textNode = document.createTextNode(fileName)
          const button = document.createElement('button')
          let button2 = null
          button.textContent = 'Download'
          button.className = 'btn1'
          button.addEventListener('click', function () {
            // browser.downloads.download({ url: pdf })
            browser.runtime.sendMessage({ downloadPDF: pdf }) // Change from chrome.runtime.sendMessage to browser.runtime.sendMessage
          })

          const secondUrl = pdf.substr(pdf.indexOf('=') + 1)
          const hasSecondUrl = pdf !== secondUrl
          if (hasSecondUrl) {
            button.textContent = 'Download from URL 1'
            button2 = document.createElement('button')

            button2.textContent = 'Download from URL 2'
            button2.addEventListener('click', function () {
              // browser.downloads.download({ url: pdf })
              browser.runtime.sendMessage({ downloadPDF: secondUrl }) // Change from chrome.runtime.sendMessage to browser.runtime.sendMessage
            })
          }

          listItem.appendChild(textNode)
          listItem.appendChild(button)
          if (hasSecondUrl) {
            listItem.appendChild(button2)
          }
          ol.appendChild(listItem)
          pdfList.appendChild(ol)
        })
      }
    })
  }

  // Initial update of the PDF list
  updatePDFList()

  // Add click event listener to refresh button
  document
    .getElementById('refreshButton')
    .addEventListener('click', function () {
      // Send a message to content script to update PDFs
      browser.tabs.query(
        { active: true, currentWindow: true },
        function (tabs) {
          const activeTab = tabs[0]
          browser.tabs.sendMessage(
            activeTab.id,
            { updatePDFs: true },
            function () {
              // After updating, refresh the list in the popup
              updatePDFList()
            }
          )
        }
      )
    })
})
