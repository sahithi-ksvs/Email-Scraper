document.addEventListener('DOMContentLoaded', function() {
    let scrapeEmails = document.getElementById('scrapeEmails'); 
    let list = document.getElementById('emailList');

    // Handler to receive emails from content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // Get emails
        let emails = request.emails;

        // Clear the list before adding new items
        list.innerHTML = '';

        // Display emails on popup
        if (!emails || emails.length === 0) {
            let li = document.createElement('li');
            li.innerText = "No emails found";
            li.classList.add('no-emails');
            list.appendChild(li);
        } else {
            // Display emails
            emails.forEach((email) => {
                let li = document.createElement('li');
                li.innerText = email;
                li.classList.add('email-item');
                list.appendChild(li);
            });
        }
    });

    // Button's click event listener
    scrapeEmails.addEventListener("click", async () => {
        // Get current active tab
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

        // Execute script to parse emails on page
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: scrapeEmailsFromPage,
        });
    });
});

// Function to scrape emails
function scrapeEmailsFromPage() {
    // RegEx to parse emails from HTML code
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    // Parse emails from HTML of the page
    let emails = document.body.innerHTML.match(emailRegEx);

    // Send emails to popup
    chrome.runtime.sendMessage({emails});
}
