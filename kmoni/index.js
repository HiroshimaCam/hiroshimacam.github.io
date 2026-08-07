var timeDelay = 0;
var replayDelay = 0;
var changeReplayTimeInterval;
var hostUrl = ["https://smi.lmoniexp.bosai.go.jp/data/map_img/RealTimeImg/", "http://www.kmoni.bosai.go.jp/data/map_img/RealTimeImg/"];

function getTimeDelay() {
    $.ajax({
        type: 'GET',
        url: 'https://api.wolfx.jp/ntp.json'
    })
        .done(function (json) {
            var resTime = json.timestamp;
            timeDelay = resTime - new Date().getTime();
            console.log(timeDelay)
        });
}

function getTime() {
    var date = new Date(new Date().getTime() + timeDelay + replayDelay - 2000);
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    var day = date.getDate().toString();
    if (day.length == 1) {
        day = "0" + day;
    }
    var hour = date.getHours().toString();
    if (hour.length == 1) {
        hour = "0" + hour;
    }
    var min = date.getMinutes().toString();
    if (min.length == 1) {
        min = "0" + min;
    }
    var sec = date.getSeconds().toString();
    if (sec.length == 1) {
        sec = "0" + sec;
    }
    return year + month + day + hour + min + sec;
}

function getImage() {
    var time = getTime();
    $("#map1_honshu").attr('src', hostUrl[0] + "acmap_s/" + time.substr(0, 8) + "/" + time + ".acmap_s.gif");
    $("#map1_time").attr('src', hostUrl[0] + "acmap_s/" + time.substr(0, 8) + "/" + time + ".acmap_s.gif");
    $("#map2_kita").attr('src', hostUrl[1] + "jma_s/" + time.substr(0, 8) + "/" + time + ".jma_s.gif");
    $("#map2_minami").attr('src', hostUrl[1] + "jma_s/" + time.substr(0, 8) + "/" + time + ".jma_s.gif");
    $("#map2_okinawa").attr('src', hostUrl[1] + "jma_s/" + time.substr(0, 8) + "/" + time + ".jma_s.gif");
    $("#map2_time").attr('src', hostUrl[1] + "jma_s/" + time.substr(0, 8) + "/" + time + ".jma_s.gif");
}

function updateReplayTime() {
    var delay = Math.abs(replayDelay);
    var delay_sec = Math.round(delay / 1000) % 60;
    var delay_min = Math.trunc(Math.round((delay / 1000)) / 60) % 60;
    var delay_hour = Math.trunc(Math.round((delay / 1000)) / 3600);
    if (delay == 0) {
        $("#replayTime").text("最新");
    } else {
        $("#replayTime").text(delay_hour + "時間" + delay_min + "分" + delay_sec + "秒前");
    }
}

function changeReplayTime(inc) {
    replayDelay = replayDelay + inc;
    if (replayDelay < -1000 * 60 * 60 * 3) {
        replayDelay = -1000 * 60 * 60 * 3;
    }
    if (replayDelay > 0) {
        replayDelay = 0;
    }
    updateReplayTime();
    getImage();
}

$(function () {
    $("#shihyo").click(function () {
        $("#shihyo").slideUp(200);
    });

    $("#replayTime").click(function () {
        replayDelay = 0;
        updateReplayTime();
        getImage();
    });

    $("#d1min").mousedown(function () {
        changeReplayTimeInterval = setInterval(function () {
            changeReplayTime(-1000 * 60);
        }, 100);
    });

    $("#d1sec").mousedown(function () {
        changeReplayTimeInterval = setInterval(function () {
            changeReplayTime(-1000);
        }, 100);
    });

    $("#i1min").mousedown(function () {
        changeReplayTimeInterval = setInterval(function () {
            changeReplayTime(1000 * 60);
        }, 100);
    });

    $("#i1sec").mousedown(function () {
        changeReplayTimeInterval = setInterval(function () {
            changeReplayTime(1000);
        }, 100);
    });

    $("#d1min, #d1sec, #i1min, #i1sec").on("mouseup mouseleave", function () {
        clearInterval(changeReplayTimeInterval);
    });
});

getTimeDelay();
setInterval(getImage, 1000);