/*
 |--------------------------------------------------------------------------
 | Shards Dashboards: Blog Add New Post Template
 |--------------------------------------------------------------------------
 */

'use strict';
var quill;
(function ($) {
  $(document).ready(function () {

    var toolbarOptions = [
      [{ 'header': [1, 2, 3, 4, 5, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent                                       // remove formatting button

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
      ['clean'],
    ];

    // Init the Quill RTE
    quill = new Quill('#editor-container', {
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Start writing your Notification here...',
      theme: 'snow'
    });

  });
})(jQuery);

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


function submitVal() {
  // var link = document.getElementById('notif-title').value;
  var link = document.getElementById('link-inp-notif').value;
  var content = quill.root.innerHTML;
  var expireOn = document.getElementById('exp-date').value;

  var errmsg = document.getElementById('err-msg');

  expireOn = expireOn.split("-");
  expireOn = Date.parse(expireOn);

  if (quill.getText().trim() != null && quill.getText().trim() != "") {
    if (link != null && link != "" && ValidURL(link)) {
      if (!isNaN(expireOn) && expireOn > Date.now()) {
        document.getElementById("pub-btn").disabled = true;
        // errmsg.innerHTML = "";
        // errmsg.classList.remove('m-b-3');

        var data = {
          content,
          link,
          expireOn
        }

        saveNotif(data);
        clear();
      } else {
        displayAlert('Please select the expiry date of notification alert! ( Note: The notification will expire after the selected date and will not be visible on the website)', 4);
        // errmsg.innerHTML = "** Invalid Expiry Date";
        // errmsg.classList.add('m-b-3');
      }
    } else {
      displayAlert('Please enter a valid link', 4);
      // errmsg.innerHTML = "** Invalid Link";
      // errmsg.classList.add('m-b-3');
    }
  } else {
    displayAlert('Please write some valid content', 4)
    // errmsg.innerHTML = "** Invalid Content";
    // errmsg.classList.add('m-b-3');
  }


}


function saveNotif(data) {
  var dt = {
    "content": data.content,
    "link": data.link,
    "expireOn": data.expireOn
  }
  console.log(dt);
  $.ajax({
    type: 'POST',
    url: '/createNotif',
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (request, status, headers) {
      // alert('Successfully created notification!');
      document.getElementById("pub-btn").disabled = false;

      displayAlert('Successfully created notification!', 2);
    },
    error: function (request, textStatus, errorThrown) {
      // alert(JSON.stringify(request));
      displayAlert('Error encountered while creating notification! Please try again.', 3)
    }

  });
}

function ValidURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}

function clear() {
  quill.setContents([{ insert: '\n' }]);
  document.getElementById('link-inp-notif').value = "";
  document.getElementById('exp-date').value = "mm/dd/yyyy";
}

document.getElementById('pub-btn').addEventListener('click', function () {
  submitVal();
});
document.getElementById('clr-btn').addEventListener('click', function () {
  document.getElementById("pub-btn").disabled = false;
  clear();
})