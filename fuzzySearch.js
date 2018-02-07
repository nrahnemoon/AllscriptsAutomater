//var csvPath = WScript.arguments(0);
//var filePath = WScript.arguments(1);

function fuzzySearch(token, csvPath, filePath) {

	postDataJs = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("util.js", 1).ReadAll();
	eval(postDataJs);

	var fh;
	var fso  = new ActiveXObject("Scripting.FileSystemObject");

	// Loads csv and gets handles to csv file
	if (!fileExists(csvPath))
		throw "";

	fh = fso.GetFile(csvPath);
	is = fh.OpenAsTextStream(1, 0);

	// Reads filePath
	var text = "";

	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var forReading = 1;
	var file = fso.OpenTextFile(filePath, forReading, false, 0);
	var text = file.ReadAll();
	file.close();

	var matches = [];
	var line;
	var patient;
	while(!is.AtEndOfStream) {
		line = is.ReadLine();
		line = line.split(",");
		patient = {};
		patient.id = line[0];
		patient.firstName = line[1];
		patient.lastName = line[2];
		patient.day1 = line[3];
		patient.day2 = pad(line[3], 2);
		patient.month1 = line[4];
		patient.month2 = pad(line[4], 2);
		patient.month3 = getShortMonthName(parseInt(line[4]));
		patient.month4 = getLongMonthName(parseInt(line[4]));
		patient.year1 = line[5];
		patient.year2 = line[5].substring(2);
		var textCopy = text.toLowerCase();
		// WScript.echo(textCopy);
		while(true) {
			var firstNameIndex = matchName(patient.firstName.toLowerCase(), textCopy);
			if (firstNameIndex == -1) {
				break;
			} else {
				textCopy = textCopy.substring(0, firstNameIndex) + textCopy.substring(firstNameIndex + patient.firstName.length);
				var startIndex = (firstNameIndex - patient.lastName.length - 5) < 0 ? 0 : (firstNameIndex  - patient.lastName.length - 5);
				var endIndex = (firstNameIndex + patient.lastName.length + 5) > textCopy.length ? textCopy.length : (firstNameIndex + patient.lastName.length + 5);
				var nameText = textCopy.substring(startIndex, endIndex).toLowerCase();

				
				var lastNameIndex = matchName(patient.lastName.toLowerCase(), nameText);
				if (lastNameIndex != -1) {
					while (true) {
						var yearIndex = textCopy.indexOf(patient.year1);
						if (yearIndex == -1) {
							yearIndex = textCopy.indexOf(patient.year2);
							if (yearIndex == -1)
								break;
							else
								textCopy = textCopy.substring(0, yearIndex) + textCopy.substring(yearIndex + 2);
						} else {
							textCopy = textCopy.substring(0, yearIndex) + textCopy.substring(yearIndex + 4);
						}
						var shortStartIndex = (yearIndex - 6) < 0 ? 0 : (yearIndex - 6) ;
						var shortEndIndex = (yearIndex + 6) > textCopy.length ? textCopy.length : (yearIndex + 6) ;
						var longStartIndex = (yearIndex - 15) < 0 ? 0 : (yearIndex - 15) ;
						var longEndIndex = (yearIndex + 15) > textCopy.length ? textCopy.length : (yearIndex + 15) ;
						var shortDateText = textCopy.substring(shortStartIndex, shortEndIndex).toLowerCase();
						var longDateText = textCopy.substring(longStartIndex, longEndIndex).toLowerCase();
						var dateText = "";

						// WScript.Echo(patient.month1 + " " + patient.month2 + " " + patient.month3 + " " + patient.month4);
						var month1Index = shortDateText.indexOf(patient.month1);
						var month2Index = shortDateText.indexOf(patient.month2);
						var month3Index = longDateText.indexOf(patient.month3.toLowerCase());
						var month4Index = longDateText.indexOf(patient.month4.toLowerCase());
						// WScript.echo(month1Index  + " " + month2Index + " " + month3Index + " " + month4Index);
						if (month4Index != -1)
							dateText = longDateText.substring(0, month4Index) + longDateText.substring(month4Index + patient.month4.length);
						else if (month3Index != -1)
							dateText = longDateText.substring(0, month3Index) + longDateText.substring(month3Index + patient.month3.length);
						else if (month2Index != -1)
							dateText = shortDateText.substring(0, month2Index) + shortDateText.substring(month2Index + patient.month2.length);
						else if (month1Index != -1)
							dateText = shortDateText.substring(0, month1Index) + shortDateText.substring(month1Index + patient.month1.length);
						else
							continue;
						// WScript.Echo("Month matched");

						var day1Index = dateText.indexOf(patient.day1);
						var day2Index = dateText.indexOf(patient.day2);

						if (day1Index != -1 || day2Index != -1) {
							if (!(patient.firstName == "Maryam" && patient.lastName == "Rahnemun") && !(patient.firstName == "Ali" && patient.lastName == "Ali") && !(patient.firstName == "Sung Un" && patient.lastName == "Yi")) {
								WScript.Echo("Matched " + patient.firstName + " " + patient.lastName + " " + patient.id + " with birthday ****************************************************************************!");
								matches.push(patient);
								break;
							}
						}
					}
					// WScript.Echo("Matched " + patient.firstName + " " + patient.lastName);
					break;
				}
			}
		}
	}
	is.Close();
	return matches;
}

function matchName(name, text) {
	var names = name.split(" ");
	var hasMatch = false;
	var indices = [];
	var index;
	for (var i = 0; i < names.length; i++) {
		if (names[i].length <= 1)
			continue;
		index = text.indexOf(names[i]);
		if (index != -1) {
			hasMatch = true; 
			indices.push(index);
		}
	}
	if (hasMatch)
		return Math.min.apply(null, indices);
	return -1;
}

function getShortMonthName(monthNum) {
	switch (monthNum) {
		case 1:
			return "Jan";
		case 2:
			return "Feb";
		case 3:
			return "Mar";
		case 4:
			return "Apr";
		case 5:
			return "May";
		case 6:
			return "Jun";
		case 7:
			return "Jul";
		case 8:
			return "Aug";
		case 9:
			return "Sep";
		case 10:
			return "Oct";
		case 11:
			return "Nov";
		case 12:
			return "Dec";
	}
}

function getLongMonthName(monthNum) {
	switch (monthNum) {
		case 1:
			return "January";
		case 2:
			return "February";
		case 3:
			return "March";
		case 4:
			return "April";
		case 5:
			return "May";
		case 6:
			return "June";
		case 7:
			return "July";
		case 8:
			return "August";
		case 9:
			return "September";
		case 10:
			return "October";
		case 11:
			return "November";
		case 12:
			return "December";
	}
}