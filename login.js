/**
* @author Cami Williams
*/

var path = "https://prior.firebaseio.com/";

function login() {
  var myDataRef = new Firebase(path);

  var email = document.getElementById("inputEmail").value;
  var password = document.getElementById("inputPassword").value;

  myDataRef.authWithPassword({
    email    : email,
    password : password
  }, function(error, authData) {
    if (error) {
      alert("Login Failed!");
    } else {
      console.log("Authenticated successfully with payload:", authData);
      var userData = authData;
        //converts to JSON string the Object Literal
        userData = JSON.stringify(userData);
        localStorage.setItem('_userData', userData);
      window.location.href = "homepage.html";

    }
  });
}

function reloadLogin() {
  var toFill = document.getElementById("login");
  toFill.innerHTML = " ";
  toFill.innerHTML = "<img src='resources/img/priorlogo_black.png' style='PADDING-BOTTOM: 5px'>"
                   + "<br><br><div id='login_inputs'>"
                   + "<input type='email' id='inputEmail' class='form-control' placeholder='Email address' required='' autofocus=''>"
                   + "<input type='password' id='inputPassword' class='form-control' placeholder='Password' required=''>"
                   + "</div> <br> <div id='login_buttons'>"
                   + "<span><button class='btn btn-lg btn-primary btn-block' type='submit' onclick='login()'>Sign in</button>"
                   + "<button class='btn btn-lg btn-primary btn-block' type='submit' onclick='signUp()'>Sign Up</button></span></div>";
}

function signUp() {
  var toFill = document.getElementById("login");
  toFill.innerHTML = " ";
  toFill.innerHTML = "<img src='resources/img/priorlogo_black.png' style='PADDING-BOTTOM: 5px' width='25%'>"
                   + "<br><br><div id='login_input'>"
                   + "<input type='email' id='inputEmail' class='form-control' placeholder='Email address' required='' autofocus=''>"
                   + "<input type='password' id='inputPassword' class='form-control' placeholder='Password' required=''>"
                   + "<input type='password' id='confirmPassword' class='form-control' placeholder='Confirm Password' required=''>"
                   + "</div><br><div id='login_buttons'><span>"
                   + "<button class='btn btn-lg btn-primary btn-block' type='submit' onclick='createLogin()'>Create Account</button>"
                   + "<button class='btn btn-lg btn-primary btn-block' type='submit' onclick='reloadLogin()'>Cancel</button></span></div>";
}

function createLogin() {

  var email = document.getElementById("inputEmail").value;
  var password = document.getElementById("inputPassword").value;
  var confirm = document.getElementById("confirmPassword").value;

  if(password != confirm) {
    alert("Passwords do not match!");
    return;
  }

  var myDataRef = new Firebase(path);
  myDataRef.createUser({
    email    : email,
    password : password
  }, function(error) {
    if (error === null) {
      console.log("User created successfully");
      window.location.href = "homepage.html";
    } else {
      console.log("Error creating user:", error);
    }
  });
}
