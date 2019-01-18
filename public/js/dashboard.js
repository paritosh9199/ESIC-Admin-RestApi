function getCount() {
    $.ajax({
        type: 'POST',
        url: '/getCount',
        // data: JSON.stringify(data),
        // contentType: "application/json",
        success: function (request, status, headers) {
            // alert(JSON.stringify({ request, status, headers }));
            setData(request);
            // console.log(headers.getResponseHeader('x-auth'));
            // console.log(request);
            // window.location.href = "/me";
        },
        error: function (request, textStatus, errorThrown) {
            alert(JSON.stringify(request));
        }

    });
}
function setData(req){
    if(req.notifCount){
        document.getElementById('notif-ct').innerText = req.notifCount;
    }
    if(req.docCount){
        document.getElementById('doc-ct').innerText = req.docCount;
    }
    if(req.vidCount){
        document.getElementById('vid-ct').innerText = req.vidCount;
    }
    if(req.imgCount){
        document.getElementById('img-ct').innerText = req.imgCount;
    }
    if(req.eventCount){
        document.getElementById('event-ct').innerText = req.eventCount;
    }
}

getCount();