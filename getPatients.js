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

	if (fileExists(csvPath)) {

		fh = fso.GetFile(csvPath);
		is = fh.OpenAsTextStream(1, 0);

		var line;
		while(!is.AtEndOfStream) {
		   line = is.ReadLine();
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
		var patientInfo = jsonResponse[0].getpatientinfo[0];
		
		if (jsonResponse[0].getpatientinfo.length == 0) {
			numBadInRow++;
			lastPatientID++;
			continue;
		}

		dateArr = patientInfo.dateofbirth.split("-");
		date = new Date(dateArr[1] + " " + dateArr[0] + ", " + dateArr[2]);
		day = parseInt(dateArr[0], 10);
		month = date.getMonth() + 1;
		year = date.getFullYear();
		WScript.Echo("Writing = " + lastPatientID + " " + formatName(patientInfo.Firstname) + " " + formatName(patientInfo.LastName) + " " + day + " " + month + " " + year + " " + patientInfo.dateofbirth);

		fh.WriteLine(lastPatientID + "," + formatName(patientInfo.Firstname) + "," + formatName(patientInfo.LastName) + "," + day + "," + month + "," + year + "," + patientInfo.PhoneNumber + "," + patientInfo.Email);
		numBadInRow = 0;
		lastPatientID++;
	}
	fh.close();
}
