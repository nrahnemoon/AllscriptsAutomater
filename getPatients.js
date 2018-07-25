/* Usage
 * cscript getPatients.js "getPatients" {csvPath} {username} {password}
 */

if (WScript.arguments.length > 0 && WScript.arguments(0) == "getPatients") {

	var csvPath = WScript.arguments(1);
	var username = WScript.arguments(2);
	var password = WScript.arguments(3);

	js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("getToken.js", 1).ReadAll();
	eval(js);

	var token = getToken(username, password);

	getPatients(token, csvPath);
}

function getPatients(token, csvPath) {

	postDataJs = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
	eval(postDataJs);

	var fh;
	var lastPatientId;
	var fso  = new ActiveXObject("Scripting.FileSystemObject"); 

	patients = [];
	if (fileExists(csvPath)) {

		fh = fso.GetFile(csvPath);
		is = fh.OpenAsTextStream(1, 0);

		var line;
		while(!is.AtEndOfStream) {
			line = is.ReadLine();
			lineArr = line.split(',');
			patient = {};
			patient.id = parseInt(lineArr[0]);
			patient.firstName = lineArr[1];
			patient.lastName = lineArr[2];
			patient.birthDay = lineArr[3];
			patient.birthMonth = lineArr[4];
			patient.birthYear = lineArr[5];
			patient.phoneNumber = lineArr[6];
			patient.email = lineArr[7];
			patients[patient.id] = patient;
		}

		lastPatientID = parseInt(line.split(',')[0]) + 1;
		is.Close();
		fh = fso.OpenTextFile(csvPath, 8);
	}
	else {
		var fh = fso.CreateTextFile(csvPath, true);
		lastPatientID = 1;
	}

	numBadInRow = 0;
	while (numBadInRow < 20) {

		var url = "https://prowand.allscriptscloud.com:5006/UnityService.svc/json/MagicJson";
		var data = "{\"Action\":\"GetPatient\",";
		data += "\"AppUserID\":\"jeff.paarsa\",";
		data += "\"Appname\":\"RemotePlusPro\",";
		data += "\"PatientID\":\"" + lastPatientID + "\",";
		data += "\"Token\":\"" + token + "\",";
		data += "\"Parameter1\":\"N\",\"Parameter2\":\"\",";
		data += "\"Parameter3\":\"\",\"Parameter4\":\"\",";
		data += "\"Parameter5\":\"\",\"Parameter6\":\"\",";
		data += "\"Data\":\"\"}";

		var request = postData(url, data, "getting the patient info for id " + lastPatientID);

		if (request.status != 200)
			throw "";

		eval('jsonResponse = ' + request.responseText);
		
		if (jsonResponse[0].hasOwnProperty("Error") || jsonResponse[0].getpatientinfo.length == 0) {
			numBadInRow++;
			lastPatientID++;
			continue;
		}
		var patientInfo = jsonResponse[0].getpatientinfo[0];

		patient = {};
		patient.id = lastPatientID;
		dateArr = patientInfo.dateofbirth.split("-");
		date = new Date(dateArr[1] + " " + dateArr[0] + ", " + dateArr[2]);
		patient.birthDay = parseInt(dateArr[0], 10);
		patient.birthMonth = date.getMonth() + 1;
		patient.birthYear = date.getFullYear();
		patient.firstName = formatName(patientInfo.Firstname);
		patient.lastName = formatName(patientInfo.LastName);
		patient.phoneNumber = patientInfo.PhoneNumber;
		patient.email = patientInfo.Email;
		patients[patient.id] = patient;

		WScript.Echo("Writing = " + patient.id + " " + patient.firstName + " " + patient.lastName + " " + patient.birthDay + " " + patient.birthMonth + " " + patient.birthYear + " " + patientInfo.dateofbirth);

		fh.WriteLine(patient.id + "," + patient.firstName + "," + patient.lastName + "," + patient.birthDay + "," + patient.birthMonth + "," + patient.birthYear + "," + patient.phoneNumber + "," + patient.email);
		numBadInRow = 0;
		lastPatientID++;
	}
	fh.close();
	return patients;
}
