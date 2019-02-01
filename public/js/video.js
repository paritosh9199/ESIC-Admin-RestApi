function displayAlert(msg, type = 1) {

    var showType;
    var icon;
    if (type == 1) {
        showType = 'bg-primary';
        icon = '<i class="fa fa-info mx-2"></i>';
    } else if (type == 2) {
        showType = 'bg-success';
        icon = '<i class="fas fa-check"></i>';
    } else if (type == 3) {
        showType = 'bg-danger';
        icon = '<i class="fas fa-times"></i>';
    } else if (type == 4) {
        showType = 'bg-warning';
        icon = '<i class="fas fa-exclamation-triangle"></i>';
    }
    document.getElementById('top-alert').innerHTML = `
    <div class="alert alert-accent ${showType} alert-dismissible fade show mb-0" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          ${icon}
          ${msg}
        
    </div>
    
    `
}


function convertSeconds(sec) {
    let totalSeconds = sec;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    return ((hours > 0) ? (hours + "h:") : '') + ((minutes > 0) ? (minutes + "m:") : '') + ((seconds > 0) ? (seconds + "s") : '');
}


function setVids(vids) {
    changeUi();
    document.getElementById('table-body-tb').innerHTML = '';
    document.getElementById('modal-container').innerHTML = '';
    document.querySelector('.table100-head').innerHTML = '';
    if (vids == '' || vids == null) {
        document.getElementById('table-body-tb').innerHTML = `
    <div class='info w-100'><center>Add few Videos to view them here!</center></div>
    `;
    } else {
        document.querySelector('.table100-head').innerHTML = `
        <table>
            <thead>
             <tr class="row100 head">
              <th class="cell100 column1"></th>
              <th class="cell100 column2">Videos</th>
              <th class="cell100 column3">Duration</th>
              <th class="cell100 column4">Uploaded On</th>
              <th class="cell100 column5">Actions</th>
             </tr>
            </thead>
        </table>`;

        for (var i = 0; i < vids.length; i++) {
            vid = vids[i];
            document.getElementById('table-body-tb').innerHTML += `
                     <tr class="row100 body">
                      <td class="cell100 column1 p-l-10">
                      ${i + 1}.
                      </td>
                      <td class="cell100 column2">
                      <img src="${vid.thumbnail}" class="yt-thumbnail" alt="Video Thumbnail">
                      <h6 style="display:inline-block" class="m-l-10">${(vid.name)}</h6>
                      </td>
                      <td class="cell100 column3">${convertSeconds(vid.duration)}</td>
                      <td class="cell100 column4">${timeConverter(vid.createdOn)}</td>
                      <td class="cell100 column5 p-r-10 center-align">
                      <div class="center-action w-100">
                       <div class="btn-group btn-group-sm d-flex" role="group" aria-label="Table row actions">
                        
                        <!--<button type="button" class="btn btn-white active-light">
                         <i class="material-icons"></i>
                        </button>
                        <button  id="btn-${i + 1}"  type="button" class="btn btn-white active-light ">
                        <i class="fas fa-external-link-square-alt"></i>
                        </button>-->

                        <a href="${vid.videoLink}" target="_blank" type="button" class="btn btn-white active-light">
    
                        <i class="fas fa-external-link-alt "></i><span class="hidden">i</span>
    
                        </a>
                        <button type="button" class="btn btn-white active-light" data-toggle="modal" data-target="#modal-tag-${i + 1}">
                        <span id="vid-tag-${i + 1}" class="hidden vid-tag">${setTags(vid.tags)}</span>
                        <i class="fas fa-tags"></i><span class="hidden">i</span>
                        </button>
                        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modal-del-${i + 1}">
                        <span id="vid-id-${i + 1}" class="hidden vid-id">${vid._id}</span>
                         <i class="material-icons"></i><span class="hidden">i</span>
                        </button>
                        
                       </div>
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
            Are you sure you want to delete ${vid.name}.
           
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button id="del-btn-${i + 1}" type="button" class="btn btn-danger delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
        `;

            document.getElementById('modal-container').innerHTML += `
    <div class="modal fade" id="modal-tag-${i + 1}" tabindex="-1" role="dialog" aria-labelledby="tagModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modal-tag-head-${i + 1}">Category/Tags</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p><em><strong>Note:</strong> Tags define where the Videos will be visible in the website. You can also search for a video based on tags.</em><br><br></p>
            Tags for ${vid.name}:<br> ${setTags(vid.tags)}.
           
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <!--<button id="del-btn-${i + 1}" type="button" class="btn btn-danger delete-btn">Delete</button>-->
          </div>
        </div>
      </div>
    </div>
        `;

            // onclick="hey(${i+1})"
            var n = i + 1;
            
        };
        enableClick();
    }


}

function setTags(tags){
    var tagString = "";
    for(var i=0;i<tags.length;i++){
        tagString += tags[i].tag;
        if(tags.length-i > 1){
            tagString += ", "
        }
    }

    return tagString;
}

function formatBytes(bytes, decimals) {
    if (bytes == 0) return '0 Bytes';
    var k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function changeUi(i = 1) {
    if (i == 0) {
        document.getElementById('table-notif-display-setter').style.display = "none";
        document.getElementById('spinner').style.display = "block";
    } else {
        document.getElementById('table-notif-display-setter').style.display = "block";
        document.getElementById('spinner').style.display = "none";
    }
}

function deleteVid(id, n) {
    var data = {
        id
    }
    $.ajax({
        type: 'POST',
        url: '/fileDelete/vid',
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
            displayAlert('Successfully deleted video!',2);
            initVid();
        },
        error: function (request, textStatus, errorThrown) {
            alert(JSON.stringify(request));
        }

    });
}
function enableClick() {
    var deleteBtn = document.querySelectorAll('button.delete-btn');
    var vidId = document.querySelectorAll('span.vid-id');

    for (let i = 0; i < deleteBtn.length; i++) {
        let button = deleteBtn[i];
        let id = vidId[i].innerHTML;
        button.addEventListener('click', function () {
            deleteVid(id, i + 1);
        });
    }
    search();
}


function initVid() {
    $.get("/fileRead/vid", function (data) {
        // alert(data);
        setVids(data);
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

initVid();
//   console.log(timeConverter(0));

