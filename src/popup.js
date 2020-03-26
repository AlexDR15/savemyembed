// File Executed on Popup

var videoFileTitle = "Video [SaveMyEmbed]";
var videoFileName = "Loading FileName";
var videoFileQuality = "no";
var videoFileUrl = "no";
var configAPIUrl = "no";

function consoleMsg(err, tell){
    console.log("[SaveMyEmbed-POPUP]"+(err ? "[ERROR] " : "[INFO] ")+tell);
};

function loadPopup() {
    document.getElementById("videoFileName").innerHTML = videoFileName;
    document.getElementById("downButtonText").innerHTML = "DOWNLOAD ME!";
    document.getElementById("downButtonText").style = "font: bold; color: #FFFFFF;";
    document.getElementById("downVidButton").style = "background-color: #4CAF50;";
    document.getElementById("downVidButton").disabled = false;
    document.getElementById("videoInfoDiv").style = "display: block;";
    consoleMsg(false, "PopUp Ready For Download! Cheers!")
};

function downloadMe() {
    if (videoFileUrl != "no"){
        consoleMsg(false, "Downloading... Cheers!!")
        document.getElementById("downButtonText").innerHTML = "Downloading... Cheers!";
        
        chrome.downloads.download({
            url: videoFileUrl,
            filename: videoFileName
        });

    } else {        
        document.getElementById("downVidButton").disabled = true;
        document.getElementById("downButtonText").innerHTML = "Loading...";
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type:"startSME"});
        });
    }
};

function fetchAPI() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', configAPIUrl, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            console.log(xhr.response);
            var videos = xhr.response.request.files.progressive;
            var bestQualityPosition = 0;
            var bestQualityHeight = videos[0].height;
            // Choose the best quality
            for (var p = 1; p < videos.length; p++) {
                if (videos[p].height > bestQualityHeight) { 
                    bestQualityHeight = videos[p].height;
                    bestQualityPosition = p;
                }
            }
            consoleMsg(true, "Better Quality Found for this content: "+videos[bestQualityPosition].quality);
            videoFileQuality = videos[bestQualityPosition].quality;
            videoFileUrl = videos[bestQualityPosition].url;
            videoFileName = videoFileTitle+" - "+videoFileQuality+".mp4";
            // Sanetize video name:
            // videoFileName.replace(/[^a-z0-9\-\s\_]/gi, '_') quita casi todo (ademas de los caracteres prohibidos en nombres)
            videoFileName = videoFileName.replace(/[\\/:*\?\"<>\|]/gi, '_');
        } else {
            consoleMsg(true, status+" -> "+xhr.response);
        }
    };
    xhr.send();

    setTimeout(function () {
        loadPopup();
    }, 3000);    
}

// LISTENER
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        // Set Data Required for Popup and Init It
        if (request.id === "setPopupData") {
            videoFileTitle = request.data.videoFileTitle;
            configAPIUrl = request.data.configAPIUrl;
            document.getElementById("downButtonText").innerHTML = "Processing...";
            consoleMsg(false, "PopUp Preparing... "+configAPIUrl)
            fetchAPI()
        }
    }
);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("downVidButton").addEventListener('click', function() {
        downloadMe();
    });
});

