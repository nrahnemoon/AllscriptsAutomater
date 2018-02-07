/* Usage
 * cscript uploadPdf.js {filePath} {patientID} {subject} {docType}
 */
// var filename = WScript.arguments(0);
// var patientID = WScript.arguments(1);
// var subject = WScript.arguments(2);
// var docType = WScript.arguments(3);
// var token = WScript.arguments(4);

function uploadPdf(filename, patientID, subject, docType, token) {

	postDataJs = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
	eval(postDataJs);

	var nameParts = filename.split("\\");
	var pdfFilename = nameParts[nameParts.length - 1];

	var base64Ret = getBase64(filename);
	var base64Text = base64Ret.text.replace(/\n/g, '');
	var base64Text = base64Text.replace(/\r/g, '');

	var url = "https://prowand.allscriptscloud.com:5006/UnityService.svc/json/MagicJson";
	var data = "{\"Action\":\"SaveDocumentImage\",";
	data += "\"AppUserID\":\"jeff.paarsa\",";
	data += "\"Appname\":\"RemotePlusPro\",";
	data += "\"PatientID\":\"" + patientID + "\",";
	data += "\"Token\":\"" + token + "\",";
	data += "\"Parameter1\":\"<doc>\\n  ";
	data += "<item name=\\\"documentCommand\\\" value=\\\"i\\\"/>\\n  ";
	data += "<item name=\\\"documentType\\\" value=\\\"" + docType + "\\\"/>\\n  ";
	data += "<item name=\\\"offset\\\" value=\\\"0\\\"/>\\n  ";
	data += "<item name=\\\"bytesRead\\\" value=\\\"" + base64Ret.size + "\\\"/>\\n  ";
	data += "<item name=\\\"bDoneUpload\\\" value=\\\"false\\\"/>\\n  ";
	data += "<item name=\\\"documentVar\\\" value=\\\"\\\"/>\\n  ";
	data += "<item name=\\\"vendorFileName\\\" value=\\\"" + pdfFilename + "\\\"/>\\n  ";
	data += "<item name=\\\"ahsEncounterID\\\" value=\\\"0\\\"/>\\n  ";
	data += "<item name=\\\"ownerCode\\\" value=\\\"10040\\\"/>\\n  ";
	data += "<item name=\\\"organizationName\\\" value=\\\"Professional\\\"/>\\n  ";
	data += "<item name=\\\"attachsubject\\\" value=\\\"" + subject + "\\\"/>\\n   ";
	data += "<item name=\\\"patientFirstName\\\" value=\\\"\\\"/>\\n  ";
	data += "<item name=\\\"patientLastName\\\" value=\\\"\\\"/>\\n</doc>\\n\",";
	data += "\"Parameter2\":\"\",\"Parameter3\":\"\",\"Parameter4\":\"\",\"Parameter5\":\"\",";
	data += "\"Parameter6\":\"" + base64Text + "\",\"Data\":\"\"}";

	//WScript.Echo(data);
	request = postData(url, data, "uploading a pdf");

	if (request.status != 200) {
		WScript.Echo(request.responseText + "\n\n\n");
		WScript.Echo("There was an error when uploading the document.  See the above message for some information on the problem at hand.");
		throw '';
	}

	eval('jsonResponse = ' + request.responseText);
	var docID = jsonResponse[0].savedocumentimageinfo[0].documentVar;

	data = "{\"Action\":\"SaveDocumentImage\",";
	data += "\"AppUserID\":\"jeff.paarsa\",";
	data += "\"Appname\":\"RemotePlusPro\",";
	data += "\"PatientID\":" + patientID;
	data += ",\"Token\":\"" + token;
	data += "\",\"Parameter1\":\"<doc>\\n  ";
	data += "<item name=\\\"documentCommand\\\" value=\\\"i\\\"/>\\n  ";
	data += "<item name=\\\"documentType\\\" value=\\\"" + docType + "\\\"/>\\n  ";
	data += "<item name=\\\"offset\\\" value=\\\"0\\\"/>\\n  ";
	data += "<item name=\\\"bytesRead\\\" value=\\\"" + "14970" + "\\\"/>\\n  ";
	data += "<item name=\\\"bDoneUpload\\\" value=\\\"true\\\"/>\\n  ";
	data += "<item name=\\\"documentVar\\\" value=\\\"" + docID + "\\\"/>\\n  ";
	data += "<item name=\\\"vendorFileName\\\" value=\\\"" + pdfFilename + "\\\"/>\\n  ";
	data += "<item name=\\\"ahsEncounterID\\\" value=\\\"0\\\"/>\\n  ";
	data += "<item name=\\\"ownerCode\\\" value=\\\"10040\\\"/>\\n  ";
	data += "<item name=\\\"organizationName\\\" value=\\\"Professional\\\"/>\\n  ";
	data += "<item name=\\\"attachsubject\\\" value=\\\"" + "This is my subject." + "\\\"/>\\n   ";
	data += "<item name=\\\"patientFirstName\\\" value=\\\"\\\"/>\\n  ";
	data += "<item name=\\\"patientLastName\\\" value=\\\"\\\"/>\\n</doc>\\n\",";
	data += "\"Parameter2\":\"\",\"Parameter3\":\"\",\"Parameter4\":\"\",\"Parameter5\":\"\",";
	data += "\"Parameter6\":\"\",\"Data\":\"\"}";

	request = postData(url, data, "uploading a pdf");

	if (request.status != 200) {
		WScript.Echo(request.responseText + "\n\n\n");
		WScript.Echo("There was an error when uploading the document.  See the above message for some information on the problem at hand.");
		throw '';
	} else {
		WScript.Echo("Succesfully uploaded the document.");
	}
}

function getBase64(filename) {
	var inputStream = WScript.CreateObject("ADODB.Stream");
	inputStream.Type = 1;
	inputStream.Open();
	inputStream.LoadFromFile(filename);

	// WScript.Echo("\n\n\nReal filename = " + filename + "\n\n\n");
	// WScript.Echo("\n\n\nFileName = " + inputStream.FileName + "\n\n\n");

	var xml = WScript.CreateObject("MSXml2.DOMDocument");
	var element = xml.createElement("Base64Data");
	element.dataType = "bin.base64";

	element.nodeTypedValue = inputStream.Read();

	var ret = {};
	ret.text = element.text;
	ret.size = inputStream.Size;

	// WScript.Echo("\n\n\nret.text = " + ret.text + "\n\n\n");
	// WScript.Echo("\n\n\nret.size = " + ret.size + "\n\n\n");

	inputStream.Close();

	return ret;
}