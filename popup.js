// Send Bulk Message
document.getElementById('send-bulk').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: function (msg) {
          chrome.runtime.sendMessage({ action: "sendBulkMessage", message: msg });
        },
        args: [message]
      });
    });
  });
  
  // Extract Contacts
  document.getElementById('extract-contacts').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: function () {
          chrome.runtime.sendMessage({ action: "extractContacts" });
        }
      });
    });
  });
  
  // Import Contacts
  document.getElementById('import-contacts').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  
  document.getElementById('importFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contacts = JSON.parse(e.target.result);
      chrome.storage.local.set({ contacts });
    };
    reader.readAsText(file);
  });
  
  // Export Contacts
  document.getElementById('export-contacts').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: function () {
          chrome.runtime.sendMessage({ action: "exportContacts" });
        }
      });
    });
  });
  