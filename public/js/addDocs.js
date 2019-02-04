//============================================================================================
//============================================================================================



var setTags = [
    "StudentResults",
    "StudentSchedules",
    "OrganisedResearchProgram",
    "StudentZone_Y1",
    "StudentZone_Y2",
    "StudentZone_Y3",
    "StudentZone_Y4",
    "StudentZone_Y5",
    "AdvertisingRecruitment",
    "PressMedia",
    "AnnualReport",
    "University",
    "Administration",
    "Courses",
    "StudentZone",
    "Conference-CME",
    "Training",
    "JournalESI",
    "Research",
    "CitizenCharter",
    "BodyDonation",
    "RulesRegulation",
    "BioWasteManagement",
    "RTI",
    "Admission",
    "Awards",
    "Infrastrutcure",
    "Events",
    "Publication",
    "GeneralSurgery",
    "GeneralMedicine",
    "ObstetricsandGynecology",
    "Pulmonology",
    "Dermatology",
    "Paediatrics",
    "Psychiatry",
    "Orthopedics",
    "Opthalmology",
    "ENT",
    "Anesthesiology",
    "Radiodiagnosis",
    "Hematology",
    "Dentistry",
    "Physiotherapy",
    "ClinicalBiochemistry",
    "ClinicalPathology",
    "ClinicalMicrobiology",
    "Neurology",
    "Neurosurgery",
    "PediatricSurgery",
    "Urology",
    "Nephrology",
    "Cardiology",
    "PlasticSurgery",
    "GaestroEnterology",
    "CardioTheraicVascular",
    "MedicalOncology",
    "SurgicalOncology",
    "Endocrinology"
]

changeUi();
var inputElement = document.getElementById("inputGroupFile03");
inputElement.onchange = function (event) {
    var file = inputElement.files[0];
    console.log(file);
    document.getElementById('label-input').innerHTML = file.name;
    document.getElementById('fl-nm').innerHTML = file.name;
    document.getElementById('fl-sz').innerHTML = formatBytes(file.size);
    //TODO do something with fileList.
};
addTags(setTags.sort());

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
function addTags(tags) {
    var tagsUi = document.getElementById('tags-collection');
    for (var i = 0; i < tags.length; i++) {

        tagsUi.innerHTML += `
        <div class="custom-control custom-checkbox mb-1">
            <input type="checkbox" name="tags" class="custom-control-input" value="${tags[i]}" id="category${i + 1}" />
            <label class="custom-control-label" for="category${i + 1}">${tags[i]}</label>
        </div>
        `
    }
}
//   $("#inputGroupFile03").on("change", function() {
//     //get the file name
//     var fileName = $(this).val();
//     console.log(fileName);
//     //replace the "Choose a file" label
//     $(this)
//       .next(".custom-file-label")
//       .html(fileName);
//   });

var tagValues = [];
$("#inputGroupFileAddon03").on("click", function () {
    //get the file name
    var fileName = "Choose a file";
    clearVals();
    //replace the "Choose a file" label
    $("#inputGroupFile03")
        .next(".custom-file-label")
        .html(fileName);
});

function clearVals() {

    document.getElementById('fl-nm').innerHTML = "Image File not selected";
    document.getElementById('fl-sz').innerHTML = "-";
    document.getElementById('fl-tg').innerHTML = "-";
    getCheckedCheckboxesFor('tags', 1);
    tagValues = [];
}


$("#upload-form").submit(function (e) {
    e.preventDefault();
    var inputElement = document.getElementById("inputGroupFile03");
    var file = inputElement.files[0];
    tagValues = getCheckedCheckboxesFor('tags');
    if (file != null && file != "") {
        if (file.size < 6291457) {
            if (typeof tagValues !== 'undefined' && tagValues.length > 0) {
                changeUi(1);

                displayAlert('Please wait while we are Uploading document! Do not refresh this page until the upload has been comleted', 1);


                var formData = new FormData(this);
                console.log(formData);
                $.ajax({
                    type: "POST",
                    url: "/fileUpload/doc",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (request, status, headers) {
                        // alert(JSON.stringify({ request, status, headers }));
                        // alert(JSON.stringify({ request }));
                        console.log(JSON.stringify({ request }));

                        var dataTags = {
                            id: request.id,
                            tags: tagValues
                        }
                        $.ajax({
                            type: 'POST',
                            url: '/addTagFile/doc',
                            data: JSON.stringify(dataTags),
                            contentType: "application/json",
                            success: function (request, status, headers) {

                                displayAlert('Successfully Uploded file!', 2);
                                clearVals();
                                changeUi();
                            },
                            error: function (request, textStatus, errorThrown) {
                                displayAlert('An Error occured during file upload! Please try uploading file again', 3)

                                // alert(JSON.stringify(request));
                                changeUi();
                            }
                        });

                    },
                    error: function (request, textStatus, errorThrown) {
                        // alert(JSON.stringify(errorThrown));
                        console.log(JSON.stringify(errorThrown));
                        displayAlert('An Error occured during file upload! Please try uploading file again', 3)
                        changeUi();
                    }
                });

            } else {
                // alert('select tag')
                displayAlert('Select a tag for the file', 4);
            }
        } else {
            alert('File too large')
            displayAlert('File size is too large! Please select a smaller file', 4)
        }
    } else {
        displayAlert('Please select a valid file', 4)
    }




});

function changeUi(v = 0) {
    if (v == 1) {
        document.getElementById("upload-form").style.display = "none";
        document.getElementById("spinner").style.display = "block";
        document.getElementById("tags-card").style.display = "none";
        // document.getElementById("spinner").innerHTML =
        //     "<br><br><br>uploading please wait<br><br><br>";
    } else {
        document.getElementById("upload-form").style.display = "block";
        document.getElementById("tags-card").style.display = "block";
        document.getElementById("spinner").style.display = "none";
    }
}

function formatBytes(bytes, decimals) {
    if (bytes == 0) return '0 Bytes';
    var k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function enableClick() {

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

function getCheckedCheckboxesFor(checkboxName, uncheckMode = 0) {
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
    if (uncheckMode == 1) {
        for (let i = 0; i < checkboxes.length; i++) {
            let cb = checkboxes[i];
            if (cb.checked) {
                cb.checked = false;
            }
        }
    }
    Array.prototype.forEach.call(checkboxes, function (el) {
        values.push(el.value);
    });

    tagValues = values;
    // console.log(values);
    return values;
}

function setEventListener(checkboxName) {
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]');
    for (let i = 0; i < checkboxes.length; i++) {
        let checkbox = checkboxes[i];
        checkbox.addEventListener('change', (event) => {
            /* if (event.target.checked) {
              console.log('checked')
            } else {
              console.log('not checked')
            } */

            document.getElementById('fl-tg').innerHTML = getCheckedCheckboxesFor(checkboxName);
        })
    }
}

setEventListener('tags');
