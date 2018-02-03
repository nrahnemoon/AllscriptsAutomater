/* Usage
 * cscript getPatients.js {csvPath}
 */
var csvPath = WScript.arguments(0);

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
	WScript.Echo(csvPath);
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
	data += "\"Token\":\"" + "E62D99C7-014C-4E97-AD8C-AF3C5141598C" + "\",";
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
	WScript.Echo("Writing = " + lastPatientID + " " + patientInfo.Firstname + " " + patientInfo.LastName + " " + day + " " + month + " " + year + " " + patientInfo.dateofbirth);

	fh.WriteLine(lastPatientID + "," + patientInfo.Firstname + "," + patientInfo.LastName + "," + day + "," + month + "," + year);
	numBadInRow = 0;
	lastPatientID++;
}
fh.close();
