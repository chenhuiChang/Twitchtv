var NO_PICTURE_URL = "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F",
    API_URL = 'https://api.twitch.tv/kraken/channels/',
    REAL_URL = 'https://www.twitch.tv/';
var box = [{title:"Sprot1", content:"test" }];
var onlineBox =[],
    offlineBox = [];
var streamList = [
    'https://api.twitch.tv/kraken/streams/freecodecamp?callback=?',
    'https://api.twitch.tv/kraken/streams/storbeck?callback=?',
    'https://api.twitch.tv/kraken/streams/esl_sc2?callback=?',
    'https://api.twitch.tv/kraken/streams/asiagodtonegg3be0?callback=?',
    'https://api.twitch.tv/kraken/streams/ogamingsc2?callback=?',
    'https://api.twitch.tv/kraken/streams/p4wnyhof?callback=?',
    'https://api.twitch.tv/kraken/streams/uzra?callback=?',
    // 'https://api.twitch.tv/kraken/streams/?callback=?',
];
var jsonReady = {};

function ChannelData(logo, status, url) {
    this.logo = logo || "";

    this.name = url.replace(API_URL,"") || "";
    this.url = url.replace(API_URL, REAL_URL) || "";
    this.status = status || "offline";
}
function getAllStream(url, callback) {
    $.getJSON(url, function (data) {
        console.log(data);
        callback && callback(data);
    });
}

function temp(data) {
    var el,ch;
    if (data.hasOwnProperty("stream")) {
        if (data.stream === null) {
            if (data.hasOwnProperty("_links")) {
                if (data._links.hasOwnProperty("channel")) {
                    el = new ChannelData(NO_PICTURE_URL, "offline",data._links.channel); 
                    box.push(el);
                    draw(el);
                }
            }
        } else {
            ch = data.stream.channel;
            el = new ChannelData(ch.logo, ch.status, data._links.channel);
            box.push(el);
            draw(el);
        }
    }
}
function drawBox() {
    box.forEach(function (element) {
        $("#channel-list").append(getItemString(element));
    });
}
function draw(element) {
    // console.log(getItemString(element));
    $("#channel-list").append(getItemString(element));
}
function getItemString(ele){
    var urlStr = "onclick=\"window.open(\'" + ele.url + "\', \'_blank\');\"";
    return "<div "+ urlStr +"class=\"channel-box\" id=\"\"><h4>" + ele.name + "</h4><p>" + ele.status + "</p></div>";
}

function makeList(){
    box.length = 0;
    for(var i=0;i<streamList.length;i++){
        getAllStream(streamList[i],temp);
    }
}
