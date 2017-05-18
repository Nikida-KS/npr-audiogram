module.exports = function(options, frameNumber) {
    var captionText = "";
    var timedCaptions = options.timedCaptions;

    var currentTime = getTimeFromFrameNumber(frameNumber, options.framesPerSecond);


    for (var i=0;i<timedCaptions.length;i++) {
        var lowerLimit = timedCaptions[i]["time"];
        var upperLimit = typeof timedCaptions[i+1] !== "undefined" ? timedCaptions[i+1]["time"] : currentTime + 1;
        if (lowerLimit <= currentTime && upperLimit > currentTime) {
            // Current time is past the captionTime, and before the next one
            captionText = timedCaptions[i]["text"];
        }
    }
    return captionText;
};

function getTimeFromFrameNumber(frameNumber, frameRate) {
    return frameNumber / frameRate;
}