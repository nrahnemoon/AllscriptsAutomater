/* Usage
 * cscript getDocuments.js {patientID} {docDir}
 */

if (WScript.arguments.length > 0) {

	var patientID = WScript.arguments(0);
	var docDir = WScript.arguments(1);
	var username = WScript.arguments(2);
	var password = WScript.arguments(3);

	js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("getToken.js", 1).ReadAll();
	eval(js);

	var token = getToken(username, password);

	getDocuments(patientID, docDir, token)
}

function getDocuments(patientID, docDir, token) {

	postDataJs = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
	eval(postDataJs);

	var url = "https://prowand.allscriptscloud.com:5006/UnityService.svc/json/MagicJson";
	var data = "{\"Action\":\"GetDocuments\",";
	data += "\"AppUserID\":\"jeff.paarsa\",";
	data += "\"Appname\":\"RemotePlusPro\",";
	data += "\"PatientID\":\"" + patientID + "\",";
	data += "\"Token\":\"" + token + "\",";
	data += "\"Parameter1\":\"\",\"Parameter2\":\"\",";
	data += "\"Parameter3\":\"\",\"Parameter4\":\"\",";
	data += "\"Parameter5\":\"\",\"Parameter6\":\"\",";
	data += "\"Data\":\"\"}";

	var request = postData(url, data, "getting the patient documents");

	if (request.status != 200)
		throw "";

	eval('jsonResponse = ' + request.responseText);
	var docs = jsonResponse[0].getdocumentsinfo;

	var patientFolder = docDir + "\\" + patientID;
	createFolder(patientFolder);

	for (var i = 0; i < docs.length; i++) {
		
		WScript.echo(docs[i].DocumentID + " " + docs[i].FormatType + " " + docs[i].DocumentType);
		
		var url = "https://prowand.allscriptscloud.com:5006/UnityService.svc/json/MagicJson";
		var data = "{\"Action\":\"GetDocuments\",";
		data += "\"AppUserID\":\"jeff.paarsa\",";
		data += "\"Appname\":\"RemotePlusPro\",";
		data += "\"PatientID\":\"" + patientID + "\",";
		data += "\"Token\":\"" + "E62D99C7-014C-4E97-AD8C-AF3C5141598C" + "\",";
		data += "\"Parameter1\":\"\",\"Parameter2\":\"\",";
		data += "\"Parameter3\":\"" + docs[i].DocumentID + "\",";
		data += "\"Parameter4\":\"" + docs[i].DocumentType + "\",";
		data += "\"Parameter5\":\"\",\"Parameter6\":\"\",";
		data += "\"Data\":\"\"}";

		var request = postData(url, data, "getting the patient doc " + docs[i].DocumentID + "." + docs[i].FormatType);

		if (request.status != 200)
			throw "";

		eval('jsonResponse = ' + request.responseText);
		
		var filename = patientFolder + "\\" + docs[i].DocumentID + "-" + docs[i].DocumentType + "." + docs[i].FormatType;
		var formatType = docs[i].FormatType;

		if (formatType.toUpperCase() == "TIFF")
			continue;
		if (jsonResponse.length == 0 || !jsonResponse[0].hasOwnProperty("getdocumentsinfo") || jsonResponse[0].getdocumentsinfo.length == 0 || !jsonResponse[0].getdocumentsinfo[0].hasOwnProperty("PageContents"))
			continue;

		var text = jsonResponse[0].getdocumentsinfo[0].PageContents;
		if (formatType && (formatType.toUpperCase() == "JPG" || formatType.toUpperCase() == "BIN" || formatType.toUpperCase() == "PDF")) {
			var base64Data = text;
			base64ToBinary(base64Data, filename, docs[i].FormatType);
		} else {
			saveToFile(text, filename);
		}
	}
}

function createFolder(fldr) {
  fso = new ActiveXObject("Scripting.FileSystemObject");
  if (! fso.FolderExists(fldr))
    fso.CreateFolder(fldr);
}

function base64ToBinary(base64String, filePath, mimeType) {
  var dom = new ActiveXObject('Microsoft.XMLDOM');
  var elem = dom.createElement('tmp');
  elem.dataType = 'bin.base64';
  base64String = base64String.replace("data:"+mimeType+";base64,", "");
  elem.text = base64String;
  var decodeBase64 = elem.nodeTypedValue

  var inputStream = new ActiveXObject('ADODB.Stream');
  inputStream.Open();
  inputStream.Type = 1;  // adTypeBinary
  inputStream.Write(decodeBase64);
  inputStream.SaveToFile(filePath, 2);
}

function saveToFile(text, filePath) {
	var fso  = new ActiveXObject("Scripting.FileSystemObject"); 
	var fh = fso.CreateTextFile(filePath, true); 
	fh.WriteLine(text);
	fh.Close();
}
