var username = WScript.arguments(0);
var password = WScript.arguments(1);
var patientCSV = WScript.arguments(2);
var toProcessFolder = WScript.arguments(3);
var noMatchFolder = WScript.arguments(4);
var multipleMatchFolder = WScript.arguments(5);
var uploadedFolder = WScript.arguments(6);

js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("getToken.js", 1).ReadAll();
eval(js);

var token = getToken(username, password);
WScript.Echo("token = " + token);

js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("getPatients.js", 1).ReadAll();
eval(js);

WScript.Echo("patients = " + patientCSV);
getPatients(token, patientCSV);

js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("uploadPdf.js", 1).ReadAll();
eval(js);

js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
eval(js);

js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("categories.js", 1).ReadAll();
eval(js);

var fso = new ActiveXObject("Scripting.FileSystemObject");
var folder = fso.GetFolder(toProcessFolder);
var fileCollection = folder.Files;
var filename = "C:\\Users\\nrahn\\Desktop\\AllscriptsAutomater\\PatientDocs\\uploaded\\2018-02-01 16-32-27 PM_1(Authorization).pdf";
//uploadPdf(filename, 8116, "This is just a test", -46, token);

WScript.Echo("Processing files.");
for(var objEnum = new Enumerator(fileCollection); !objEnum.atEnd(); objEnum.moveNext()) {

	var txtFileName = String(objEnum.item());
	var extension = txtFileName.split(".")[1].toLowerCase();
	var fileName = txtFileName.split("\\")[txtFileName.split("\\").length - 1].split(".")[0];

	if (extension == "txt") {
		var pdfFileName = txtFileName.split(".")[0] + ".pdf";

		WScript.Echo("In processFile to process " + pdfFileName);
		js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("fuzzySearch.js", 1).ReadAll();
		eval(js);

		WScript.Echo("fuzzyMatching " + txtFileName);
		matches = fuzzySearch(token, patientCSV, txtFileName);
		WScript.echo("Num matches = " + matches.length);

		if (matches.length == 1) {
			WScript.echo("Uploading " + pdfFileName + " for " + matches[0].firstName + " " + matches[0].lastName + " with category " + getCategory(txtFileName));
			// uploadPdf(filename, matches[0].id, "This is just a test", 1, token)
			// WScript.echo("Uploading to " + uploadedFolder + "\\" + fileName + ".txt");
			fso.MoveFile(txtFileName, uploadedFolder + "\\" + fileName + ".txt") ;
			fso.MoveFile(pdfFileName, uploadedFolder + "\\" + fileName + ".pdf");
		} else if (matches.length == 0) {
			WScript.echo(matches.length + " matches.  Won't upload.");
			fso.MoveFile(txtFileName, noMatchFolder + "\\" + fileName + ".txt");
			fso.MoveFile(pdfFileName, noMatchFolder + "\\" + fileName + ".pdf");
		} else {
			WScript.echo(matches.length + " matches.  Won't upload.");
			fso.MoveFile(txtFileName, multipleMatchFolder + "\\" + fileName + ".txt");
			fso.MoveFile(pdfFileName, multipleMatchFolder + "\\" + fileName + ".pdf");
		}
	}
}

function getCategory(filePath) {

	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var forReading = 1;
	var file = fso.OpenTextFile(filePath, forReading, false, 0);
	var text = file.ReadAll();
	file.close();

	for (var i = 0; i < categories.length; i++) {
		for (var j = 0; j < categories[i].values.length; j++) {
			if (hasMatch(categories[i].values[j], text)) {
				return categories[i].id;
			}
		}
	}

	return defaultCategory.id;
}
