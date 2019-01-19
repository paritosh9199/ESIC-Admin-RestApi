function setNotif(notifs) {
    changeUi();
    document.getElementById('table-body-tb').innerHTML = '';
    document.getElementById('modal-container').innerHTML = '';
    document.querySelector('.table100-head').innerHTML ='';
    if (notifs == '' || notifs == null) {
        document.getElementById('table-body-tb').innerHTML = `
    <div class='info w-100'><center>Create few notifications to view them here!</center></div>
    `;
    } else {
        document.querySelector('.table100-head').innerHTML = `
        <table>
            <thead>
             <tr class="row100 head">
              <th class="cell100 column1"></th>
              <th class="cell100 column2">Content of Notification</th>
              <th class="cell100 column3">Created On</th>
              <th class="cell100 column4">Expiry On</th>
              <th class="cell100 column5">Action</th>
             </tr>
            </thead>
        </table>`;

        for (var i = 0; i < notifs.length; i++) {
            notif = notifs[i];
            document.getElementById('table-body-tb').innerHTML += `
                     <tr class="row100 body">
                      <td class="cell100 column1 p-l-10">
                      ${i + 1}.
                      </td>
                      <td class="cell100 column2">${(notif.content)}</td>
                      <td class="cell100 column3">${timeConverter(notif.createdOn)}</td>
                      <td class="cell100 column4">${timeConverter(notif.expireOn)}</td>
                      <td class="cell100 column5 p-r-10 center-align">
                       <div class="btn-group btn-group-sm d-flex  " role="group" aria-label="Table row actions">
                        
                        <!--<button type="button" class="btn btn-white active-light">
                         <i class="material-icons"></i>
                        </button>
                        <button  id="btn-${i + 1}"  type="button" class="btn btn-white active-light ">
                        <i class="fas fa-external-link-square-alt"></i>
                        </button>-->
                        <a href="${notif.link}" type="button" class="btn btn-white active-light">
    
                        <i class="fas fa-external-link-alt "></i>
    
                        </a>
                        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modal-del-${i + 1}">
                        <span id="notif-id-${i + 1}" class="hidden notif-id">${notif._id}</span>
                         <i class="material-icons"></i>
                        </button>
                        
                       </div>
                      </td>
                     </tr>
    
        `;

            document.getElementById('modal-container').innerHTML += `
    <div class="modal fade" id="modal-del-${i + 1}" tabindex="-1" role="dialog" aria-labelledby="delModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modal-head-${i + 1}">Confirmation</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this Notification.
           
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button id="del-btn-${i + 1}" type="button" class="btn btn-danger delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
        `;

            // onclick="hey(${i+1})"
            var n = i + 1;
            // var btn = 'del-btn-' + n;
            // var btn = 'btn-' + n;
            // var id = 'del-id-' + n;
            // document.getElementById(btn).addEventListener('click', function () {
            // var id = document.getElementById(id).innerHTML;
            // var id='hey';
            // alert('this is going to delete id:' + id);

            // })
        };
        enableClick();
    }


}
    
function changeUi(i=1){
    if(i==0){
        document.getElementById('table-notif-display-setter').style.display = "none";
        document.getElementById('spinner').style.display = "block";
    }else{
        document.getElementById('table-notif-display-setter').style.display = "block";
        document.getElementById('spinner').style.display = "none";
    }
}

function deleteNotif(id, n) {
    var data = {
        id
    }
    $.ajax({
        type: 'POST',
        url: '/deleteNotif',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (request, status, headers) {
            // alert(JSON.stringify({ request, status, headers }));
            // setData(request);
            // console.log(headers.getResponseHeader('x-auth'));
            // console.log(request);
            // window.location.href = "/me";
            var modal = '#modal-del-' + n;
            $(modal).modal('hide');
            initNotif();
        },
        error: function (request, textStatus, errorThrown) {
            alert(JSON.stringify(request));
        }

    });
}
function enableClick() {
    // var deleteClasses = document.querySelectorAll(".delete-btn");

    // var idClasses = document.querySelectorAll(".notif-id");

    // for (var i = 0, len = checklist.length; i < len; i += 1) {
    //     (function () {
    //         console.log('enabled click id for:' + i);
    //         deleteClasses[i].addEventListener('click', function (event) {
    //             var id = idClasses[i].innerHTML;
    //             // var id='hey'
    //             // console.log('this is going to delete id:' + id);
    //             console.log('hey');
    //         });
    //     }());
    // }

    var deleteBtn = document.querySelectorAll('button.delete-btn');
    var notifId = document.querySelectorAll('span.notif-id');

    for (let i = 0; i < deleteBtn.length; i++) {
        let button = deleteBtn[i];
        let id = notifId[i].innerHTML;
        button.addEventListener('click', function () {
            deleteNotif(id, i + 1);
        });
    }
    search();
}


function initNotif() {
    $.get("/readNotif", function (data) {
        // alert(data);
        setNotif(data);
    });
}


function search() {
    var $rows = $('table tbody tr');
    $('#search-btn-al').keyup(function () {

        var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
            reg = RegExp(val, 'i'),
            text;

        $rows.show().filter(function () {
            text = $(this).text().replace(/\s+/g, ' ');
            return !reg.test(text);
        }).hide();
    });
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear() % 2000;
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    var smallTime = month + ' ' + date + ' \'' + year
    return smallTime;
}

initNotif();
//   console.log(timeConverter(0));

