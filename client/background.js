console.log("background.js loaded");

const getArxivId = (url) => {
    const regex = /\d{4}\.\d{5}/;
    const match = url.match(regex);

    if (match) {
        console.log("Match found:", match[0]);
        return match[0];
    } else {
        console.log("No match found.");
        return "No match found.";
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "sampleContextMenu", // An identifier for this item
        title: "Sample Context Menu", // The text to display in the menu
        contexts: ["all"] // Show this menu item when text is selected
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("info: ", info);
    console.log("tab: ", tab);

    const url = info.frameUrl;
    const id = tab.id > -1 ? tab.id : 0;
    console.log("url: ", url);
    console.log("id: ", id);

    if (info.menuItemId === "sampleContextMenu") {
        arxiv_id = getArxivId(url);
        console.log("arxiv_id: ", arxiv_id);

        fetch(`https://arxiv.org/bibtex/${arxiv_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // or another content type that the server expects
            },
        }).then(response => {
            const reader = response.body.getReader();
            let charactersReceived = 0;
            let chunks = [];

            // read() returns a promise that resolves
            // when a value has been received
            reader.read().then(function processText({ done, value }) {
                // Done is true when the stream is finished
                if (done) {
                    console.log('Stream finished.');
                    console.log("charactersReceived: ", charactersReceived);
                    console.log("chunks: ", chunks);

                    const decoder = new TextDecoder('utf-8');
                    let text = '';

                    // Simulating processing chunks in a loop
                    for (const chunk of chunks) {
                        text += decoder.decode(chunk, { stream: true });
                    }
                    // After the last chunk
                    text += decoder.decode(); // Flush the decoder; very important!
                    console.log("text: ", text);

                    chrome.tabs.sendMessage(id, { action: "copy", text: text }, function (response) {
                        console.log("response: ", response);
                    });
                    return;
                }

                // value is a Uint8Array of the chunk of data
                charactersReceived += value.length;
                chunks.push(value);
                console.log(`Received ${charactersReceived} characters so far`);

                // Recursive call to read the next chunk of data
                return reader.read().then(processText);
            }).catch(error => console.error('Error:', error));
        }).catch(error => console.error('Error:', error));
        return true;
    }
});