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
];
var tagValues = [];
var videoDisplayDataStatus = false;

changeUi();
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

vidInfoUIchange(2);
function vidInfoUIchange(type = 0) {
    if (type == 0) {
        document.getElementById('file-info').style.display = "block";
        document.getElementById('spinner-vid-info').style.display = "none";
        document.getElementById('vid-info-text').style.display = "none";

    } else if (type == 1) {
        document.getElementById('file-info').style.display = "none";
        document.getElementById('spinner-vid-info').style.display = "block";
        document.getElementById('vid-info-text').style.display = "none";
    } else {
        //all hidden;
        document.getElementById('file-info').style.display = "none";
        document.getElementById('vid-info-text').style.display = "block";
        document.getElementById('spinner-vid-info').style.display = "none";

    }
}

function convertSeconds(sec) {
    let totalSeconds = sec;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    return ((hours > 0) ? (hours + "h:") : '') + ((minutes > 0) ? (minutes + "m:") : '') + ((seconds > 0) ? (seconds + "s") : '');
}

document.getElementById('get-yt-link').addEventListener('change', function () {
    vidInfoUIchange(1);
    var link = document.getElementById('get-yt-link').value;
    var data = {
        videoLink: link
    }
    $.ajax({
        type: 'POST',
        url: '/api/getYtData',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (request, status, headers) {

            videoDisplayDataStatus = true;
            var title = request.name.split("+");
            var videoTitle = "";
            for (var i = 0; i < title.length; i++) {
                videoTitle += title[i] + " ";
            }
            document.getElementById('yt-api-info').innerHTML = `
            <div class="row">
            <div class="col-sm-2">

              <img class="youtube-thumbnail" src="${request.thumbnail}"
                alt=""> </div>

            <div class="col-sm-10">
              <div class="m-l-40 vid-information">
                <h5>${videoTitle}</h5>
                <p>${convertSeconds(request.duration)}</p>
              </div>
            </div>
          </div>
            `;
            vidInfoUIchange(0);
            // alert(JSON.stringify(request));
        },
        error: function (request, textStatus, errorThrown) {
            vidInfoUIchange(2)
            // alert(JSON.stringify(errorThrown));
        }
    });

})




$("#inputGroupFileAddon03").on("click", function () {
    
    clearVals();
    
});



function clearVals() {

    vidInfoUIchange(2);
    document.getElementById('get-yt-link').innerHTML = "";
    document.getElementById('fl-tg').innerHTML = "No tag selected!";
    getCheckedCheckboxesFor('tags', 1);
    tagValues = [];
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

$("#upload-form").submit(function (e) {
    e.preventDefault();
    var inputLink = document.getElementById('get-yt-link').value;
    tagValues = getCheckedCheckboxesFor('tags');
    if (inputLink != "" & inputLink != null && ValidURL(inputLink)) {
        if (typeof tagValues !== 'undefined' && tagValues.length > 0) {
            if (videoDisplayDataStatus) {

                changeUi(1);
                displayAlert('Please wait while we are Uploading video! Do not refresh this page until the upload has been comleted', 1);
                videoDisplayDataStatus = false;

                var vidData = {
                    videoLink: inputLink
                }

                $.ajax({
                    type: 'POST',
                    url: '/fileUpload/vid',
                    data: JSON.stringify(vidData),
                    contentType: "application/json",
                    success: function (request, status, headers) {

                        var dataTags = {
                            id: request.vid._id,
                            tags: tagValues
                        }
                        // alert(dataTags);
                        $.ajax({
                            type: 'POST',
                            url: '/addTagFile/vid',
                            data: JSON.stringify(dataTags),
                            contentType: "application/json",
                            success: function (request, status, headers) {

                                clearVals();
                                document.getElementById('get-yt-link').innerHTML = "";
                                displayAlert('Successfully Uploded video!', 2);
                                videoDisplayDataStatus = true;
                                changeUi();
                            },
                            error: function (request, textStatus, errorThrown) {
                                displayAlert('An Error occured during video upload! Please try again', 3)

                                // alert(JSON.stringify(request));
                                changeUi();
                            }
                        });
                    },
                    error: function (request, textStatus, errorThrown) {
                        displayAlert('An Error occured during video upload! Please try again', 3)

                        // alert(JSON.stringify(request));

                        changeUi();
                    }
                });

            } else {
                displayAlert('Please wait the link is being processed!', 4)
            }
        } else {
            displayAlert('Please select a tag for this Video!', 4)
        }
    } else {
        displayAlert('Please enter a valid Youtube Video link!', 4)
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
