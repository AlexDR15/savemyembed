// File Executed on Tab

var videoFileTitle = "Video [SaveMyEmbed]";

function consoleMsg(err, tell){
    console.log("[SaveMyEmbed]"+(err ? "[ERROR] " : "[INFO] ")+tell);
};

function find() {
    if (document.getElementsByTagName("script")[11] != null) {
        eval(document.getElementsByTagName("script")[11].innerHTML);
    }
};

function start() {
    consoleMsg(false, "Waiting for OTTData")
    setTimeout(function () {
        find()
        consoleMsg(false, "Scrapped and Parsed OTTData")
        OTTData = window.OTTData;
        if (OTTData && OTTData.video){
            consoleMsg(false, "Getting Title and Config...")
            videoFileTitle = OTTData.video.title;
            get(OTTData.config_url);
        } else {
            consoleMsg(true, "OTTData not found");
        }
    }, 3000);
};

function get(url) {
    consoleMsg(false, "Fetching Config... ("+url+")");
    chrome.runtime.sendMessage({
        id: "setPopupData", 
        data: {
            videoFileTitle: videoFileTitle,
            configAPIUrl: url
        }
    });
};

// Processing
console.log("Loading SaveMyEmbed Extension...");
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "startSME":
                consoleMsg(false, "Executing SaveMyEmbed...")
                start();
            break;
        }
    }
);
