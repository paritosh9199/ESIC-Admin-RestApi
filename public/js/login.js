function login(email,password){
    var data ={
        email,
        password
    }
    
    $.ajax({
        type: 'POST',
        url: '/login',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (request, status, headers) {
            // alert(JSON.stringify({request,status,headers}));
            // console.log(headers.getResponseHeader('x-auth'));
            // console.log(request);
            window.location.href = "/me";
        },
        error: function (request, textStatus, errorThrown) {
            alert(JSON.stringify(request));
        }
    
    });
}

function _(id){
    return document.getElementById(id);
}

document.getElementById('login-btn').addEventListener('click',function(){
    var email = _('email-usr').value;
    var password = _('passwd-usr').value;
    if(email != null && email !="" && password != null && password !=""){
        login(email,password);
    }
});






//   $.ajax({
//     type: 'POST',
//     url:'url.do',
//     data: formData,
//     success: c
//     error: function (request, textStatus, errorThrown) {
//          alert(request.getResponseHeader('some_header'));
//     },
//     dataType: dataType,
//     async: false
//    });