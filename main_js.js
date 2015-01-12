/**
 * @author Cami Williams
 */

var myDataRef;
var path = "https://prior.firebaseio.com/";
var currUser;
var today;
var lastYear;
var lastMonth;
var lastWeek;
var tempToday;
var tempLastWeek;
var tempLastMonth;
var tempLastYear;

var uploadImageCode = "<div id = 'upload_file'><input id='file-upload' type='file' accept='image/*'>"
+ "<button class='btn btn-default btn-lg' type='button' onclick='sendImage()'>Submit</button>"
+ "<button class='btn btn-default btn-lg' type='button' onclick='cancel()'>Cancel</button></div>";
var uploadTextCode = "<div id = 'upload_file'> <textarea id='input-text' type='text' maxlength='250' placeholder='What is on your mind?' rows='8' cols='50'></textarea>"
+ "<button class='btn btn-default btn-lg' type='button' onclick='sendText()'>Submit</button>"
+ "<button class='btn btn-default btn-lg' type='button' onclick='cancel()'>Cancel</button></div>";
var choicesCode = "<button class='btn btn-lg btn-primary btn-block' type='submit'"
+ " onclick='getText()''>Write Post</button><button class='btn btn-lg btn-primary btn-block'"
+ " type='submit' onclick='loadImage()''>Upload Image</button>";

var fileSelected = false;
var firstAdded = false;
var lastAdded = false;

var uploadFileNameDisplay = document.getElementById("filename");
var uploadFilePath = "";

function logout() {
	document.getElementById("statements").style.visibility = "visible";
	document.getElementById("statistics").style.visibility = "hidden";
	document.getElementById("account_info").style.visibility = "hidden";

	currUser = null;
	window.location.href = "index.html";
}

function getAccount() {
	document.getElementById("statements").style.visibility = "hidden";
	document.getElementById("statistics").style.visibility = "hidden";
	document.getElementById("account_info").style.visibility = "visible";
}

function getStats() {
	document.getElementById("statements").style.visibility = "hidden";
	document.getElementById("statistics").style.visibility = "visible";
	document.getElementById("account_info").style.visibility = "hidden";

	myDataRef = new Firebase(path + currUser.uid + "/");
  var total_count = 0;
	var year_count = 0;
	var month_count = 0;
	var week_count = 0;
	var streak = 0;

	var temp = new Date();
//lw_total
	myDataRef.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			total_count++;
			if(childSnapshot.name().indexOf(tempLastYear.getFullYear()) > -1) {
				year_count++;
			}
			if(childSnapshot.name().indexOf(tempLastMonth.getMonth()) > -1) {
				month_count++;
			}
			if(childSnapshot.name() === (temp.getMonth() + " " + temp.getDate() + " " + temp.getFullYear())) {
				streak++;
				temp.setDate(temp.getDate() - 1);
			}
		});
		document.getElementById("total_statements").innerHTML = total_count;
		document.getElementById("ly_total").innerHTML = year_count;
		document.getElementById("lm_total").innerHTML = month_count;
		document.getElementById("longest_streak").innerHTML = streak;

	});
}

function getStatements() {
	document.getElementById("statements").style.visibility = "visible";
	document.getElementById("statistics").style.visibility = "hidden";
	document.getElementById("account_info").style.visibility = "hidden";

	getLast(lastYear);

	myDataRef = new Firebase(path + currUser.uid + "/" + today);
	myDataRef.once('value', function(snapshot) {
		if(snapshot.hasChildren()) {
			var toFill = document.getElementById("choices");
			toFill.innerHTML = "<p><h2>You have already submitted a statement today!</h2></p><p><h4>Come back tomorrow for some more Prior fun!</h4></p>";
		}
	});
}

function loadContent() {
	currUser = localStorage.getItem('_userData');
	//parse to Object Literal the JSON object
	if(currUser) currUser = JSON.parse(currUser);

	var toFill = document.getElementById("past-text");
	toFill.innerHTML = " ";

	getToday();
	var date = document.getElementById("date");
	date.innerHTML = "<h2> Today's Date: " + (tempToday.getMonth() + 1) + "/" + tempToday.getDate() + "/" + tempToday.getFullYear() + "</h2>";

	getStatements();
}

function getToday() {
	tempToday = new Date();
	today = tempToday.getMonth() + " " + tempToday.getDate() + " " + tempToday.getFullYear();

	tempLastYear = new Date();
	tempLastYear.setFullYear(tempLastYear.getFullYear()-1);
	lastYear = tempLastYear.getMonth() + " " + tempLastYear.getDate() + " " + tempLastYear.getFullYear();

	tempLastMonth = new Date();
	tempLastMonth.setMonth(tempLastMonth.getMonth()-1);
	lastMonth = tempLastMonth.getMonth() + " " + tempLastMonth.getDate() + " " + tempLastMonth.getFullYear();

	tempLastWeek = new Date(tempToday.getTime()-1000*60*60*24*7);
	lastWeek = tempLastWeek.getMonth() + " " + tempLastWeek.getDate() + " " + tempLastWeek.getFullYear();
}

function getLast(priorTime) {
	var toFill = document.getElementById("past-text");

	myDataRef = new Firebase(path + currUser.uid + "/" + priorTime);
	myDataRef.once('value', function(snapshot) {
		toFill.innerHTML = "<h4>You did not submit anything to Prior on this day!</h4>";

		snapshot.forEach(function(childSnapshot) {
			if(childSnapshot.val() != null && childSnapshot.name() == "img") {
				toFill.innerHTML = " ";
				toFill.innerHTML = "<img src='" + childSnapshot.val() + "' width='75%'>";
			} else if(childSnapshot.val() != null && childSnapshot.name() == "text") {
				toFill.innerHTML = " ";
				toFill.innerHTML = "<h4>" + childSnapshot.val() + "</h4>";
			}
		});
	});
}

function getText() {
	var toFill = document.getElementById("choices");
	toFill.innerHTML = uploadTextCode;
}

function loadImage() {
	var toFill = document.getElementById("choices");
	toFill.innerHTML = uploadImageCode;
}

function cancel() {
	var toFill = document.getElementById("choices");
	toFill.innerHTML = choicesCode;
}

function sendImage() {
	var filePath = document.getElementById("file-upload");

	handleFileSelect(filePath);

	var toFill = document.getElementById("choices");
	toFill.innerHTML = "<h2>Thanks for submitting a statement today! Come back tomorrow to submit another one!</h2>";
}

function handleFileSelect(evt) {
	var f = evt.files[0];
	var reader = new FileReader();

	reader.onload = (function(theFile) {
		return function(e) {
			var filePayload = e.target.result;
	    var encrypt = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload)); //Encrypt file

			myDataRef = new Firebase(path + currUser.uid + "/" + today);
			myDataRef.child('img').set(e.target.result);
		};
	})(f);
	reader.readAsDataURL(f);
}


function sendText() {
	myDataRef = new Firebase(path + currUser.uid + "/" + today);
	myDataRef.child('text').set(document.getElementById("input-text").value);

	var toFill = document.getElementById("choices");
	toFill.innerHTML = "<h2>Thanks for submitting a statement today! Come back tomorrow to submit another one!</h2>";
}
