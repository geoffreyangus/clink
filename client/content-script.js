console.log("content-script.js loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("inside content-script.js")
    if (message.action == "copy") {
        navigator.clipboard.writeText(message.text).then(function () {
            console.log('Copying to clipboard was successful!');
            sendResponse({ result: "Text copied to clipboard" });
        }).catch(function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }
    return true;
});