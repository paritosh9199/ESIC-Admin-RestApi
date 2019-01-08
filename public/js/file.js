function upload(file) {

    var data = {
        file,
        fileData : file.fileData,
        fileName : file.fileName,
        createdOn : Date.now(),
        extension : file.extension,
        type : `image/${file.extension}`,
        useTag : 'image'
    }
    $.ajax({
        type: 'POST',
        url: '/fileUpload/img',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (request, status, headers) {
            alert(JSON.stringify({ request, status, headers }));
            // console.log(headers.getResponseHeader('x-auth'));
            // console.log(request);
            // window.location.href = "/me";
        },
        error: function (request, textStatus, errorThrown) {
            alert(JSON.stringify(request));
        }

    });
}

var ip = document.getElementById('file-db');

ip.onchange = function (event) {
    var fileList = ip.files;
    alert(JSON.stringify(fileList[0].name));
    var file = fileList[0];
    upload(file);
    //TODO do something with fileList.  
}