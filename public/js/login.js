(function($) {
  "use strict";

  /*==================================================================
    [ Focus input ]*/
  $(".input100").each(function() {
    $(this).on("blur", function() {
      if (
        $(this)
          .val()
          .trim() != ""
      ) {
        $(this).addClass("has-val");
      } else {
        $(this).removeClass("has-val");
      }
    });
  });

  /*==================================================================
    [ Validate ]*/
  var input = $(".validate-input .input100");

  $(".validate-form").on("submit", function() {
    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    return check;
  });

  $(".validate-form .input100").each(function() {
    $(this).focus(function() {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    } else {
      if (
        $(input)
          .val()
          .trim() == ""
      ) {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass("alert-validate");
  }

  /*==================================================================
    [ Show pass ]*/
  var showPass = 0;
  $(".btn-show-pass").on("click", function() {
    if (showPass == 0) {
      $(this)
        .next("input")
        .attr("type", "text");
      $(this)
        .find("i")
        .removeClass("zmdi-eye");
      $(this)
        .find("i")
        .addClass("zmdi-eye-off");
      showPass = 1;
    } else {
      $(this)
        .next("input")
        .attr("type", "password");
      $(this)
        .find("i")
        .addClass("zmdi-eye");
      $(this)
        .find("i")
        .removeClass("zmdi-eye-off");
      showPass = 0;
    }
  });
})(jQuery);

//==================================================================

var errReg = _("err-msg-reg");
var errLgn = _("err-msg-lgn");

function login(email, password) {
  var data = {
    email,
    password
  };

  $.ajax({
    type: "POST",
    url: "/login",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(request, status, headers) {
      // alert(JSON.stringify({request,status,headers}));
      // console.log(headers.getResponseHeader('x-auth'));
      // console.log(request);
      window.location.href = "/me";
    },
    error: function(request, textStatus, errorThrown) {
    //   console.log({ request, textStatus, errorThrown });
    //   alert(JSON.stringify({ request, textStatus, errorThrown }));
      errLgn.innerHTML = `<span class='err-msg'>**${errValidation(
        request.responseText
      )}</span>`;
    }
  });
}

function register(email, password) {
  var data = {
    email,
    password
  };

  $.ajax({
    type: "POST",
    url: "/register",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(request, status, headers) {
      // alert(JSON.stringify({request,status,headers}));
      // console.log(headers.getResponseHeader('x-auth'));
      // console.log(request);
      window.location.href = "/me";
    },
    error: function(request, textStatus, errorThrown) {
      //   alert(JSON.stringify({ request, textStatus, errorThrown }));
      //   console.log({ request, textStatus, errorThrown });
      errReg.innerHTML = `<span class='err-msg'>**${errValidation(
        request.responseJSON.errmsg
      )}</span>`;
    }
  });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function errValidation(err) {
  var reg1 = /duplicate/;
  var reg2 = /notAllowed/;
  if (reg1.test(String(err))) {
    return "An Account with this email already exists";
  } else {
    return err;
  }
  // return reg.test(String(err).toLowerCase());
}
function _(id) {
  return document.getElementById(id);
}

document.getElementById("login-btn").addEventListener("click", function() {
  var email = _("email-usr").value;
  var password = _("passwd-usr").value;
  if (email != null && email != "" && validateEmail(email)) {
    if (password != null && password != "") {
      login(email, password);
    } else {
      errLgn.innerHTML = `<span class='err-msg'>**Invalid Password</span>`;
    }
  } else {
    errLgn.innerHTML = `<span class='err-msg'>**Invalid Email</span>`;
  }
});

document.getElementById("reg-btn").addEventListener("click", function() {
  var email = _("email-reg").value;
  var password = _("passwd-reg").value;
  var confPass = _("conf-reg").value;
  if (email != null && email != "" && validateEmail(email)) {
    if (password != null && password != "") {
      if (confPass != null && confPass != "") {
        if (confPass == password) {
        //   console.log({ email, password, confPass });
          register(email, password);
        } else {
          errReg.innerHTML = `<span class='err-msg'>**Passwords do not match</span>`;
        }
      } else {
        errReg.innerHTML = `<span class='err-msg'>**Invalid Confirmation Password</span>`;
      }
    } else {
      errReg.innerHTML = `<span class='err-msg'>**Invalid Password</span>`;
    }
  } else {
    errReg.innerHTML = `<span class='err-msg'>**Invalid Email</span>`;
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
