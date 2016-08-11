var NO_PICTURE_URL = "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F",
    API_URL = 'https://api.twitch.tv/kraken/channels/',
    REAL_URL = 'https://www.twitch.tv/';
var box = [];
var onlineBox = [],
    offlineBox = [];
var streamList = [
    'https://api.twitch.tv/kraken/streams/freecodecamp?callback=?',
    'https://api.twitch.tv/kraken/streams/storbeck?callback=?',
    'https://api.twitch.tv/kraken/streams/esl_sc2?callback=?',
    'https://api.twitch.tv/kraken/streams/asiagodtonegg3be0?callback=?',
    'https://api.twitch.tv/kraken/streams/ogamingsc2?callback=?',
    'https://api.twitch.tv/kraken/streams/p4wnyhof?callback=?',
    'https://api.twitch.tv/kraken/streams/uzra?callback=?'
];

function ChannelData(logo, status, url) {
    this.logo = logo || "";
    this.name = url.replace(API_URL, "") || "";
    this.url = url.replace(API_URL, REAL_URL) || "";
    this.status = (!status) ? "offline" : status.length + this.name.length > 60 ? status.substr(0, 50) + "..." : status;
    this.shortStatus = (!status) ? "offline" : status.length + this.name.length > 30 ? status.substr(0, 20) + "..." : status;
}

function arrange(data) {
    var el, ch;
    if (data.hasOwnProperty("stream")) {
        if (data.stream === null) {
            if (data.hasOwnProperty("_links")) {
                if (data._links.hasOwnProperty("channel")) {
                    el = new ChannelData(NO_PICTURE_URL, "offline", data._links.channel);
                    box.push(el);
                    offlineBox.push(el);
                }
            }
        } else {
            ch = data.stream.channel;
            el = new ChannelData(ch.logo, ch.status, data._links.channel);
            box.push(el);
            onlineBox.push(el);
        }
    }
}
function drawBox(arr) {
    arr.forEach(function (element) {
        $("#channel-list").append(getItemString(element));
    });
}
function getItemString(ele) {
    var retStr = "<div class=\"channel-box";
    if (ele.status!=="offline") {
        retStr += " online\">";
    } else retStr += " offline\">";
    retStr += "<img src=\"" + ele.logo + "\" alt=\"\" class=\"logo channel-box-item\">";
    retStr += "<div class=\"channel-box-item\"><a target=\"_blank\" href=\"" + ele.url + "\" class=\"title\">";
    retStr += ele.name + "</a></div>"
    retStr += "<div class=\"channel-box-item desc-long\"><p>" + ele.status + "</p></div>";
    retStr += "<div class=\"channel-box-item desc-short\"><p>" + ele.shortStatus + "</p></div>";
    return retStr;
}

function clean() {
    $("#channel-list").html("");
}
function getData(url) {
    return $.getJSON(url);
}

function makeList() {
    var AJAX = [];
    for (var i = 0; i < streamList.length; i++) {
        AJAX.push(getData(streamList[i]));
    }
    $.when.apply($, AJAX).done(function () {
        for (var j = 0; j < arguments.length; j++) {
            if (arguments[j][1] !== "success") {
                console.log('connect error');
            } else {
                arrange(arguments[j][0]);
            }
        }
        drawBox(onlineBox);
        drawBox(offlineBox);
    });
}
$(document).ready(makeList);
$("#all").click(function(){
    clean();
    drawBox(onlineBox);
    drawBox(offlineBox);
});
$("#on").click(function(){
    clean();
    drawBox(onlineBox);
});
$("#off").click(function(){
    clean();
    drawBox(offlineBox);
});