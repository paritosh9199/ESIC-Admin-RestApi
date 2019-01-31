var yt = require('youtube.get-video-info');

function getVidData(id, callback) {
    yt.retrieve(id, function (err, res) {
        if (err) {
            throw err;
        }
        // console.log(res);
        var data = {
            name: res.title,
            duration: res.length_seconds,
            video_id: res.video_id,
            thumbnail: res.thumbnail_url,
            success:true
        }
        if (data.name == undefined) {
            callback({ invalid: true,success:false })
        } else {
            callback(data);
        }
    });
}


function getVidId(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}


module.exports = { getVidData, getVidId };
// usage:
// getVidData('I-46P6hZnuk', function (data) {
//     console.log(data);
// })

// console.log(getVidId('https://www.youtube.com/watch?v=I-46P6hZnuk'));
