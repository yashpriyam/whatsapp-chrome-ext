chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendBulkMessage") {
    sendBulkMessage(request.message);
  } else if (request.action === "extractContacts") {
    extractContacts();
  } else if (request.action === "exportContacts") {
    exportContacts();
  }
});

// Send Bulk Message Function
function sendBulkMessage(message) {
  const contacts = getStoredContacts(); // Fetch contacts from local storage or input
  contacts.forEach((contact) => {
    sendMessageToContact(contact, message);
  });
}

function sendMessageToContact(contact, message) {
  const chat = document.querySelector(`span[title="${contact}"]`);
  if (chat) {
    chat.click();
    setTimeout(() => {
      const messageBox = document.querySelector("div[contenteditable='true']");
      if (messageBox) {
        messageBox.textContent = message;
        messageBox.dispatchEvent(new InputEvent("input", { bubbles: true }));
        const sendButton = document.querySelector('span[data-icon="send"]');
        if (sendButton) {
          sendButton.click();
        }
      }
    }, 1000); // Adjust the timeout as per your needs
  }
}

// Extract Group Contacts Function
function extractContacts() {
  const groupHeader = document.querySelector('div._amie[role="button"]');
  if (groupHeader) groupHeader.click();
  setTimeout(() => {
    const contacts = [];

    // Query all list items inside the members list
    const contactElements = document.querySelectorAll(
      'div[aria-label^="Members list"] div[role="listitem"]'
    );
    console.log({ contactElements });

    if (contactElements.length > 0) {
      contactElements.forEach((contactElement) => {
        // Extract the contact name and phone number
        const contactName =
          contactElement.querySelector('span[dir="auto"]')?.textContent ||
          "Unknown";
        console.log({ contactName });
        const contactPhone =
          contactElement.querySelector('span[class="_ao3e"]')?.textContent ||
          "Unknown";
        console.log({ contactPhone });

        // Store the contact info as an object
        contacts.push({
          name: contactName,
          phone: contactPhone,
        });
      });
      console.log({ contacts });

      // Save the contacts to local storage
      chrome.storage.local.set({ contacts }, () => {
        alert(`Successfully extracted ${contacts.length} contacts.`);
      });
    } else {
      alert("No contacts found in the group info.");
    }
  }, 3000);
}

// Export Contacts Function
function exportContacts() {
  chrome.storage.local.get("contacts", (data) => {
    const contacts = data.contacts || [];
    const blob = new Blob([JSON.stringify(contacts)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.json";
    a.click();
  });
}

// Fetch stored contacts
function getStoredContacts() {
  return new Promise((resolve) => {
    chrome.storage.local.get("contacts", (data) => {
      resolve(data.contacts || []);
    });
  });
}
