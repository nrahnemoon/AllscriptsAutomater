/* Usage
 * cscript getPatients.js "getPatients" {csvPath} {username} {password}
 */

if (WScript.arguments.length > 0 && WScript.arguments(0) == "getOrders") {

	var username = WScript.arguments(1);
	var password = WScript.arguments(2);

	js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("getToken.js", 1).ReadAll();
	eval(js);

	var token = getToken(username, password);

	getOrders(token);
}

function getOrders(token) {

	js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
	eval(js);

	//
	var url = "https://prowand.allscriptscloud.com:5006/UnityService.svc/json/MagicJson";
	var data = "{\"Action\":\"GetOrders\",";
	data += "\"AppUserID\":\"jeff.paarsa\",";
	data += "\"Appname\":\"RemotePlusPro\",";
	data += "\"PatientID\":\"\",";
	data += "\"Token\":\"" + token + "\",";
	data += "\"Parameter1\":\"\",\"Parameter2\":\"\",";
	data += "\"Parameter3\":\"Pending\",\"Parameter4\":\"\",";
	data += "\"Parameter5\":\"\",\"Parameter6\":\"\",";
	data += "\"Data\":\"\"}";

	var request = postData(url, data, "getting the lab orders");

	if (request.status != 200)
		throw "";

	WScript.Echo(request.responseText);
	eval('jsonResponse = ' + request.responseText);
}
