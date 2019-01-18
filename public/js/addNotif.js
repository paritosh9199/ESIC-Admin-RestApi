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


function submitVal() {
  // var link = document.getElementById('notif-title').value;
  var link = document.getElementById('link-inp-notif').value;
  var content = quill.root.innerHTML;
  var expireOn = document.getElementById('exp-date').value;

  var errmsg = document.getElementById('err-msg')

  expireOn = expireOn.split("-");
  expireOn = Date.parse(expireOn);

  if (quill.getText().trim() != null && quill.getText().trim() != "") {
    if (link != null && link != "" && ValidURL(link)) {
      if (expireOn > Date.now()) {
        document.getElementById("pub-btn").disabled = true; 
        errmsg.innerHTML = "";
        errmsg.classList.remove('m-b-3');

        var data = {
          content,
          link,
          expireOn
        }

        saveNotif(data);
        clear();
      } else {
        errmsg.innerHTML = "** Invalid Expiry Date";
        errmsg.classList.add('m-b-3');
      }
    } else {
      errmsg.innerHTML = "** Invalid Link";
      errmsg.classList.add('m-b-3');
    }
  } else {
    errmsg.innerHTML = "** Invalid Content";
    errmsg.classList.add('m-b-3');
  }
  

}


function saveNotif(data) {
  var dt = {
    "content": data.content,
    "link":data.link,
    "expireOn":data.expireOn
  }
  console.log(dt);
  $.ajax({
    type: 'POST',
    url: '/createNotif',
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (request, status, headers) {
      alert('Successfully created notification!');
    },
    error: function (request, textStatus, errorThrown) {
      alert(JSON.stringify(request));
    }

  });
}

function ValidURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

function clear(){
  quill.setContents([{ insert: '\n' }]);
  document.getElementById('link-inp-notif').value = "";
  $('#exp-date').val("").datepicker("update");
}

document.getElementById('pub-btn').addEventListener('click', function () {
  submitVal();
});
document.getElementById('clr-btn').addEventListener('click', function () {
  document.getElementById("pub-btn").disabled = false; 
  clear();
})