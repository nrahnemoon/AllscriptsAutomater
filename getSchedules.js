if (WScript.arguments.length > 0 && WScript.arguments(0) == "getSchedules") {

	var username = WScript.arguments(1);
	var password = WScript.arguments(2);
	var patientCsv = WScript.arguments(3);
	var appointmentCsv = WScript.arguments(4);
	var daysInFuture = WScript.arguments(5);
	var emailUsername = WScript.arguments(6);
	var emailPassword = WScript.arguments(7);

	js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("getToken.js", 1).ReadAll();
	eval(js);

	var token = getToken(username, password);

	js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("getPatients.js", 1).ReadAll();
	eval(js);

	patients = getPatients(token, patientCsv);

	getSchedules(token, patients, appointmentCsv, daysInFuture, emailUsername, emailPassword);
}

function getSchedules(token, patients, appointmentCsv, daysInFuture, emailUsername, emailPassword) {

	js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
	eval(js);

	appointments = [];
	var fso  = new ActiveXObject("Scripting.FileSystemObject"); 

	if (fileExists(appointmentCsv)) {

		fh = fso.GetFile(appointmentCsv);
		is = fh.OpenAsTextStream(1, 0);

		var line;
		while(!is.AtEndOfStream) {
			line = is.ReadLine();
			lineArr = line.split(',');
			appt = {};
			appt.id = parseInt(lineArr[0]);
			appt.patientID = parseInt(lineArr[1]);
			appt.firstName = lineArr[2];
			appt.lastName = lineArr[3];
			appt.email = lineArr[4];
			appt.phoneNumber = lineArr[5];
			appointments[appt.id] = appt;
		}
		is.Close();
		fh = fso.OpenTextFile(appointmentCsv, 8);
	}
	else {
		var fh = fso.CreateTextFile(appointmentCsv, true);
	}

	for (var i = 0; i <= daysInFuture; i++) {

		var today = new Date();
		var dateOfInterest = new Date();
		dateOfInterest.setDate(today.getDate() + i);

		WScript.echo("Getting appointments for " + getFormattedDate(dateOfInterest));
		var url = "https://prowand.allscriptscloud.com:5006/UnityService.svc/json/MagicJson";
		var data = "{\"Action\":\"GetSchedule\",";
		data += "\"AppUserID\":\"jeff.paarsa\",";
		data += "\"Appname\":\"RemotePlusPro\",";
		data += "\"PatientID\":\"\",";
		data += "\"Token\":\"" + token + "\",";
		data += "\"Parameter1\":\"" + apiFormattedDate(dateOfInterest) + "\",\"Parameter2\":\"\",";
		data += "\"Parameter3\":\"Y\",\"Parameter4\":\"\",";
		data += "\"Parameter5\":\"\",\"Parameter6\":\"\",";
		data += "\"Data\":\"\"}";

		var request = postData(url, data, "getting the schedule");

		if (request.status != 200)
			throw "";

		eval('jsonResponse = ' + request.responseText);
		var newAppointments = jsonResponse[0].getscheduleinfo;
		for (var j = 0; j < newAppointments.length; j++) {
			var appt = newAppointments[j];
			patient = patients[parseInt(appt.patientID)];
			date = new Date(appt.ApptTime2);
			if (appointments[appt.ScheduleId] == undefined) {
				if (patient.email != "") {
					WScript.echo("Sending email reminder to " + patient.firstName + " " + patient.lastName + " for appt on " + getFormattedDate(date));
					dateStr = getFormattedDate(date);
					sendEmail(
						emailUsername,
						"nrahnemoon@gmail.com", // patient.email
						"Don't Forget!  You've got an appointment at Dr. Rahnemun's on " + dateStr,
						"Hello " + patient.firstName + ",\n\nYou've got an appointment at our Irvine office on " + 
						dateStr + ".  If that doesn't work well for you, please give us a call to reschedule at " +
						"(949)603-4938.  Otherwise, we'll see you soon!\n\nBest,\n\nDr. Rahnemun");
					fh.WriteLine(appt.ScheduleId + "," + patient.id + "," + patient.firstName + "," + patient.lastName + "," + patient.email + "," + patient.phoneNumber + "," + dateStr);
				} else {
					WScript.echo("Not sending! Don't have email for " + patient.firstName + " " + patient.lastName);
				}
			} else {
				WScript.echo("Not resending! Already sent email reminder to " + patient.firstName + " " + patient.lastName + " for appt on " + getFormattedDate(date));
			}
		}
	}
	fh.close();
}

function getFormattedDate(date) {
	var weekday = [
	"Sunday", "Monday", "Tuesday", "Wednesday",
	"Thursday","Friday","Saturday"
	];

	var monthNames = [
		"January", "February", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December"
	];

	return weekday[date.getDay()] + ", " + monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " at " + formatAMPM(date);
}

function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

function apiFormattedDate(date) {
	js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
	eval(js);

	return pad(date.getMonth() + 1, 2) + "\\/" + pad(date.getDate() + 1, 2) + "\\/" + date.getFullYear();
}

function sendEmail(from, to, subject, body, username, password) {
	// See documentation here:
	// https://support.smartbear.com/testcomplete/docs/scripting/sending-email-from-scripts.html#CDO

	try {
		var schema = "http://schemas.microsoft.com/cdo/configuration/";
		var cdoConfig = new ActiveXObject("CDO.Configuration");
		cdoConfig.Fields.Item(schema + "sendusing") = 2; // cdoSendUsingPort
		cdoConfig.Fields.Item(schema + "smtpserver") = "smtp.gmail.com";
		// cdoConfig.Fields.Item(schema + "smtpserver") = "smtp-mail.outlook.com";
	    cdoConfig.Fields.Item(schema + "smtpserverport") = 465; // Port number
		cdoConfig.Fields.Item(schema + "smtpusessl") = 1;

	    cdoConfig.Fields.Item(schema + "smtpauthenticate") = 1;
	    cdoConfig.Fields.Item(schema + "sendusername") = username;
	    cdoConfig.Fields.Item(schema + "sendpassword") = password;
	    cdoConfig.Fields.Item(schema + "smtpconnectiontimeout") = 10;
	    cdoConfig.Fields.Update();

		var msg = new ActiveXObject("CDO.Message");
		msg.Configuration = cdoConfig;
		msg.From     = from;
		msg.To       = to;
		msg.Subject  = subject;
		msg.TextBody = body;
		msg.Send();
	}
	catch(e) {
		WScript.Echo("Error: " + e.description);
	}
}