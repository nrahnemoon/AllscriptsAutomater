/* Usage
 * cscript getPatients.js {csvPath} {filePath}
 */
var csvPath = WScript.arguments(0);
var filePath = WScript.arguments(1);

postDataJs = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
eval(postDataJs);
fuseJs = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("fuse.js", 1).ReadAll();
eval(fuseJs);

var fh;
var fso  = new ActiveXObject("Scripting.FileSystemObject"); 
var patients = [];

if (!fileExists(csvPath))
	throw "";

fh = fso.GetFile(csvPath);
is = fh.OpenAsTextStream(1, 0);


var text = "";

var fso = new ActiveXObject("Scripting.FileSystemObject");
var forReading = 1;
var file = fso.OpenTextFile(filePath, forReading, false, 0);
var text = file.ReadAll();
file.close();
// WScript.echo(text);

var line;
var patient;
while(!is.AtEndOfStream) {
   line = is.ReadLine();
   line = line.split(",");
   patient = {};
   patient.firstName = line[1];
   patient.lastName = line[2];
   patient.day1 = line[3];
   patient.day2 = pad(line[3], 2);
   patient.month1 = line[4];
   patient.month2 = pad(line[4], 2);
   var monthName = getMonthName(line[4]);
   patient.month3 = monthName.short;
   patient.month4 = monthName.long;
   patient.year1 = line[5];
   patient.year2 = line[5].substring(2);
   patients.push(patient);
}
is.Close();

var options = {
	shouldSort: true,
	includeScore: true,
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: [
		"firstName",
		"lastName",
		"day1",
		"day2",
		"month1",
		"month2",
		"month3",
		"month4",
		"year1",
		"year2"
	]
};
var fuse = new Fuse(patients, options);


var result = fuse.search(text);

WScript.echo("Result length = " + result.length);
WScript.echo("Result = " + result[0].item.firstName + " " + result[0].item.lastName + " " + result[0].score);
WScript.echo("Result = " + result[1].item.firstName + " " + result[1].item.lastName + " " + result[1].score);
WScript.echo("Result = " + result[2].item.firstName + " " + result[2].item.lastName + " " + result[2].score);
WScript.echo("Result = " + result[3].item.firstName + " " + result[3].item.lastName + " " + result[3].score);

function getMonthName(monthNum) {
	var month = {};
	switch (monthNum) {
		case 1:
			month.short = "Jan";
			month.long = "January";
		case 2:
			month.short = "Feb";
			month.long = "February";
		case 3:
			month.short = "Mar";
			month.long = "March";
		case 4:
			month.short = "Apr";
			month.long = "April";
		case 5:
			month.short = "May";
			month.long = "May";
		case 6:
			month.short = "Jun";
			month.long = "June";
		case 7:
			month.short = "Jul";
			month.long = "July";
		case 8:
			month.short = "Aug";
			month.long = "August";
		case 9:
			month.short = "Sep";
			month.long = "September";
		case 10:
			month.short = "Oct";
			month.long = "October";
		case 11:
			month.short = "Nov";
			month.long = "November";
		case 12:
			month.short = "Dec";
			month.long = "December";
	}
	return month;
}