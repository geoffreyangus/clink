console.log("popup.js loaded");

// NOTE(geoffrey): this is for keyboard shortcut
// chrome.commands.onCommand.addListener((command) => {
//     if (command == "activate_command") {
//         // Execute the action for the command
//         console.log("Command activated!");
//         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//             console.log("tabs: ", tabs);
//             let activeTab = tabs[0];
//             console.log("activeTab: ", activeTab);

//             message = { action: "copy_bibtex", activeTab: activeTab };
//             chrome.runtime.sendMessage(message, function (response) {
//                 console.log("response: ", response);
//             });
//         });
//     }
// });