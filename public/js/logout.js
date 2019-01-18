function _(id){
    return document.getElementById(id);
}

document.getElementById("hidden").style.display = "none";

document.getElementById('logout-btn').addEventListener('click',function(){
    $.ajax({
        type: 'POST',
        url: '/logout',
        // data: JSON.stringify(data),
        // contentType: "application/json",
        success: function (request, status, headers) {
            // alert(JSON.stringify({request,status,headers}));
            // console.log(headers.getResponseHeader('x-auth'));
            // console.log(request);
            window.location.href = "/login";
        },
        error: function (request, textStatus, errorThrown) {
            alert(JSON.stringify(request));
        }
    
    });
});