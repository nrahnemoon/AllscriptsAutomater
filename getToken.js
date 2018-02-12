/* Usage
 * cscript getToken.js {username} {password}
 */

function getToken(username, password) {

	postDataJs = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
	eval(postDataJs);

	var url = "https://prowand.allscriptscloud.com:5006/UnityService.svc/json/GetToken";
	var data = "{\"Password\":\"3E434127-A1F8-4F45-9A1C-9ACF3B16399A\",";
	data += "\"Username\":\"72088:emrRemote\"}";

	request = postData(url, data, "getting the token");

	if (request.status != 200)
		throw "";

	var token = request.responseText;

	// ---- Authenticate the receied token ----
	var url = "https://prowand.allscriptscloud.com:5006/UnityService.svc/json/MagicJson";
	var data = "{\"Appname\":\"RemotePlusPro\",";
	data += "\"Parameter1\":\"" + password + "\",";
	data += "\"PatientID\":\"\",\"Parameter4\":\"\",";
	data += "\"Parameter6\":\"\",\"Data\":\"\",";
	data += "\"Parameter3\":\"16.1.1\",";
	data += "\"AppUserID\":\"" + username + "\",";
	data += "\"Parameter2\":\"\",";
	data += "\"Token\":\"" + token + "\",";
	data += "\"Parameter5\":\"\",";
	data += "\"Action\":\"GetUserAuthentication\"}";
	request = postData(url, data, "authenticating the token");

	eval('jsonResponse = ' + request.responseText);
	if (jsonResponse[0].getuserauthenticationinfo[0].ValidUser != "YES")
		WScript.Echo("Username/password is invalid.")
	else
		return token;
}

/*
var username = WScript.arguments(0);
var password = WScript.arguments(1);

WScript.echo(getToken(username, password));
*/
