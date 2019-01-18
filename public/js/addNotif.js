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


function clickable(){
    alert(quill.root.innerHTML);
}

document.getElementById('pub-btn').addEventListener('click',function(){
    clickable();
})