/* Usage
 * cscript getPatientsForWellness.js {csvPath} {csvOutputPath} {username} {password}
 */

if (WScript.arguments.length > 0) {

	var csvPath = WScript.arguments(0);
	var csvOutputPath = WScript.arguments(1);
	var username = WScript.arguments(2);
	var password = WScript.arguments(3);

	js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("getToken.js", 1).ReadAll();
	eval(js);

	var token = getToken(username, password);

	js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("getPatients.js", 1).ReadAll();
	eval(js);

	getPatients(token, csvPath);

	getPatientsForWellness(token, csvPath, csvOutputPath);
}

function getPatientsForWellness(token, csvPath, csvOutputPath) {

	postDataJs = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
	eval(postDataJs);

	var fso = new ActiveXObject("Scripting.FileSystemObject");

	var fhOutput;
	if (fileExists(csvOutputPath)) {
		fhOutput = fso.OpenTextFile(csvOutputPath, 8);
	} else {
		fhOutput = fso.CreateTextFile(csvOutputPath, true);
	}

	var fh = fso.GetFile(csvPath);
	is = fh.OpenAsTextStream(1, 0);

	postDataJs = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
	eval(postDataJs);

	while(!is.AtEndOfStream) {
		lineText = is.ReadLine();
		line = lineText.split(",");

		WScript.Echo(line[1] + " " + line[2]);
		var dob = new Date(parseInt(line[5]), parseInt(line[4]) - 1, parseInt(line[3]));
		var today = new Date();
		var timeDiff = Math.abs(today.getTime() - dob.getTime());
		var age = Math.ceil(timeDiff / (1000 * 3600 * 24 * 365)); 
		if(age >= 65) {
			WScript.Echo(line[1] + " " + line[2] + " is above 65!");
			//fhOutput.WriteLine(lineText);
			var url = "https://prowand.allscriptscloud.com:5006/UnityService.svc/json/MagicJson"
			var data = "{\"Action\":\"GetPatientSections\",";
			data += "\"AppUserID\":\"jeff.paarsa\",";
			data += "\"Appname\":\"RemotePlusPro\",";
			data += "\"PatientID\":" + line[0];  // + 9276;  for testing
			data += ",\"Token\":\"" + token;
			data += "\",\"Parameter1\":\"48\","; // Records for past 4 years
			data += "\"Parameter2\":\"\",\"Parameter3\":\"\",\"Parameter4\":\"\",\"Parameter5\":\"\",";
			data += "\"Parameter6\":\"\",\"Data\":\"\"}";

			var requestCompleted = false;
			while (!requestCompleted) {
				try {
					var request = postData(url, data, "getting patient sections");
					requestCompleted = true;
				} catch (exception) {
					WScript.echo("Error getting patient file for " + line[1] + " " + line[2] + ".  Trying again.");
				}
			}

			WScript.echo(request.responseText);
			if (request.status != 200)
				throw "";

			eval('jsonResponse = ' + request.responseText);
			var encounters = jsonResponse[0].getpatientsectionsinfo
			var latestEncounter = 0;
			for (var i = 0; i < encounters.length; i++) {
				// WScript.echo("[" + encounters[i].Section + "] " + encounters[i].Description);
				if (encounters[i].Section.indexOf("Other Past History") != -1 && encounters[i].Description.toLowerCase().indexOf("well") != -1 && encounters[i].Description.toLowerCase().indexOf("exam") != -1) {
					dateArr = encounters[i].Date.split("-");
					date = new Date(dateArr[1] + " " + dateArr[0] + ", " + dateArr[2]);
					WScript.Echo("[" + line[1] + " " + line[2] + " " + encounters[i].Date + "] " + encounters[i].Description);
					WScript.Echo("encounters[" + i + "].Date = " + date);
					WScript.Echo("latestEncounter = " + latestEncounter);
					if (date > latestEncounter) {
						WScript.Echo("latestEncounter = " + latestEncounter);
						latestEncounter = date;
					}
				}
			}
			if (latestEncounter != 0) {
				fhOutput.WriteLine(lineText + "," + formatDate(latestEncounter));
			}
		}
	}
	fhOutput.close();
	is.Close();
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}