/* Usage
 * cscript uploadPdf.js {filePath} {patientID} {subject} {docType}
 */
var filename = WScript.arguments(0);
var patientID = WScript.arguments(1);
var subject = WScript.arguments(2);
var docType = WScript.arguments(3);

function getBase64(filename) {
	var inputStream = WScript.CreateObject("ADODB.Stream");
	inputStream.Type = 1;
	inputStream.Open();
	inputStream.LoadFromFile(filename);
	WScript.Echo("\n\n\nFileName = " + inputStream.FileName + "\n\n\n");

	var xml = WScript.CreateObject("MSXml2.DOMDocument");
	var element = xml.createElement("Base64Data");
	element.dataType = "bin.base64";

	element.nodeTypedValue = inputStream.Read();

	var ret = {};
	ret.text = element.text;
	ret.size = inputStream.Size;

	inputStream.Close();

	return ret;
}

var base64Ret = getBase64(filename);

var url = "https://prowand.allscriptscloud.com:5006/UnityService.svc/json/MagicJson";
var data = "{\"Action\":\"SaveDocumentImage\",";
data += "\"AppUserID\":\"jeff.paarsa\",";
data += "\"Appname\":\"RemotePlusPro\",";
data += "\"PatientID\":" + "8116";
data += ",\"Token\":\"" + "E62D99C7-014C-4E97-AD8C-AF3C5141598C";
data += "\",\"Parameter1\":\"<doc>\\n  ";
data += "<item name=\\\"documentCommand\\\" value=\\\"i\\\"/>\\n  ";
data += "<item name=\\\"documentType\\\" value=\\\"" + "1" + "\\\"/>\\n  ";
data += "<item name=\\\"offset\\\" value=\\\"0\\\"/>\\n  ";
data += "<item name=\\\"bytesRead\\\" value=\\\"" + base64Ret.size + "\\\"/>\\n  ";
data += "<item name=\\\"bDoneUpload\\\" value=\\\"false\\\"/>\\n  ";
data += "<item name=\\\"documentVar\\\" value=\\\"\\\"/>\\n  ";
data += "<item name=\\\"vendorFileName\\\" value=\\\"" + "test.pdf" + "\\\"/>\\n  ";
data += "<item name=\\\"ahsEncounterID\\\" value=\\\"0\\\"/>\\n  ";
data += "<item name=\\\"ownerCode\\\" value=\\\"10040\\\"/>\\n  ";
data += "<item name=\\\"organizationName\\\" value=\\\"Professional\\\"/>\\n  ";
data += "<item name=\\\"attachsubject\\\" value=\\\"" + subject + "\\\"/>\\n   ";
data += "<item name=\\\"patientFirstName\\\" value=\\\"\\\"/>\\n  ";
data += "<item name=\\\"patientLastName\\\" value=\\\"\\\"/>\\n</doc>\\n\",";
data += "\"Parameter2\":\"\",\"Parameter3\":\"\",\"Parameter4\":\"\",\"Parameter5\":\"\",";
data += "\"Parameter6\":\"" + base64Ret.text + "\",\"Data\":\"\"}";

var shouldBeAsync = false;

var request = new ActiveXObject("MSXML2.ServerXMLHTTP");  

request.open(method, url, shouldBeAsync);

request.setRequestHeader("Host", "prowand.allscriptscloud.com:5006");
request.setRequestHeader("Content-Type", "application/json");
request.setRequestHeader("Accept", "application/json");
request.setRequestHeader("Accept-Language", "en-us");

request.send(postData);

if (request.status != 200) {
	WScript.Echo(request.responseText + "\n\n\n");
	WScript.Echo("There was an error when uploading the document.  See the above message for some information on the problem at hand.");
	throw '';
}

eval('jsonResponse = ' + request.responseText);
var docID = jsonResponse[0].savedocumentimageinfo[0].documentVar;

postData = "{\"Action\":\"SaveDocumentImage\",";
postData += "\"AppUserID\":\"jeff.paarsa\",";
postData += "\"Appname\":\"RemotePlusPro\",";
postData += "\"PatientID\":" + "8116";
postData += ",\"Token\":\"" + "E62D99C7-014C-4E97-AD8C-AF3C5141598C";
postData += "\",\"Parameter1\":\"<doc>\\n  ";
postData += "<item name=\\\"documentCommand\\\" value=\\\"i\\\"/>\\n  ";
postData += "<item name=\\\"documentType\\\" value=\\\"" + "1" + "\\\"/>\\n  ";
postData += "<item name=\\\"offset\\\" value=\\\"0\\\"/>\\n  ";
postData += "<item name=\\\"bytesRead\\\" value=\\\"" + "14970" + "\\\"/>\\n  ";
postData += "<item name=\\\"bDoneUpload\\\" value=\\\"true\\\"/>\\n  ";
postData += "<item name=\\\"documentVar\\\" value=\\\"" + docID + "\\\"/>\\n  ";
postData += "<item name=\\\"vendorFileName\\\" value=\\\"" + "test.pdf" + "\\\"/>\\n  ";
postData += "<item name=\\\"ahsEncounterID\\\" value=\\\"0\\\"/>\\n  ";
postData += "<item name=\\\"ownerCode\\\" value=\\\"10040\\\"/>\\n  ";
postData += "<item name=\\\"organizationName\\\" value=\\\"Professional\\\"/>\\n  ";
postData += "<item name=\\\"attachsubject\\\" value=\\\"" + "This is my subject." + "\\\"/>\\n   ";
postData += "<item name=\\\"patientFirstName\\\" value=\\\"\\\"/>\\n  ";
postData += "<item name=\\\"patientLastName\\\" value=\\\"\\\"/>\\n</doc>\\n\",";
postData += "\"Parameter2\":\"\",\"Parameter3\":\"\",\"Parameter4\":\"\",\"Parameter5\":\"\",";
postData += "\"Parameter6\":\"\",\"Data\":\"\"}";

request = new ActiveXObject("MSXML2.ServerXMLHTTP");  

request.open(method, url, shouldBeAsync);

request.setRequestHeader("Host", "prowand.allscriptscloud.com:5006");
request.setRequestHeader("Content-Type", "application/json");
request.setRequestHeader("Accept", "application/json");
request.setRequestHeader("Accept-Language", "en-us");

request.send(postData);

if (request.status != 200) {
	WScript.Echo(request.responseText + "\n\n\n");
	WScript.Echo("There was an error when uploading the document.  See the above message for some information on the problem at hand.");
	throw '';
} else {
	WScript.Echo("Succesfully uploaded the document.");
}*/
