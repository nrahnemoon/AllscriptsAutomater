var username = WScript.arguments(0);
var password = WScript.arguments(1);
var patientCSV = WScript.arguments(2);
var filename = WScript.arguments(2);

js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("getToken.js", 1).ReadAll();
eval(js);

var token = getToken(username, password);

js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("fuzzySearch.js", 1).ReadAll();
eval(js);

matches = fuzzySearch(token, patientCSV, filename);

if (matches.length == 1) {
	WScript.echo("Uploading for " + matches[0].firstName + " " + matches[0].lastName);
} else {
	WScript.echo(matches.length + " matches.  Won't upload.");
}
