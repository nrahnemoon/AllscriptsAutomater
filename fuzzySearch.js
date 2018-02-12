//var csvPath = WScript.arguments(0);
//var filePath = WScript.arguments(1);

js = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("blacklist.js", 1).ReadAll();
eval(js);

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
	var text = file.ReadAll().toLowerCase();
	text = filterText(text);
	file.close();

	var origSoftMatches = [];
	var origHardMatches = [];
	var softMatches = [];
	var hardMatches = [];
	var line;
	var patient;

	//WScript.echo(text);
	patients = [];
	while(!is.AtEndOfStream) {
		line = is.ReadLine();
		line = line.split(",");
		patient = {};
		patient.id = line[0];
		patient.firstName = line[1].toLowerCase();
		patient.lastName = line[2].toLowerCase();
		patient.day1 = line[3];
		patient.day2 = pad(line[3], 2);
		patient.month1 = line[4];
		patient.month2 = pad(line[4], 2);
		patient.month3 = getShortMonthName(parseInt(line[4]));
		patient.month4 = getLongMonthName(parseInt(line[4]));
		patient.year1 = line[5];
		patient.year2 = line[5].substring(2);
		var textCopy = text.toLowerCase();

		if(isBlacklisted(patient))
			continue;

		patients.push(patient);
	}
	is.Close();

	for (var i = 0; i < patients.length; i++) {
		var patient = patients[i];
		if (matchName1(patient.firstName, patient.lastName, textCopy)) {
			if (canBeSoftMatch(patient)) {
				origSoftMatches.push(patient);
				WScript.Echo("Orig Soft Match'ed " + patient.firstName + " " + patient.lastName);
			}
			if (matchYear(patient, textCopy)) {
				WScript.Echo("Orig Hard Match'ed " + patient.firstName + " " + patient.lastName);
				origHardMatches.push(patient);
			}
		}
	}

	if (origHardMatches.length == 0) {
		for (var i = 0; i < patients.length; i++) {
			var patient = patients[i];
			if (matchName2(patient.firstName, patient.lastName, textCopy)) {
				if (canBeSoftMatch(patient)) {
					softMatches.push(patient);
					WScript.Echo("Soft Match'ed " + patient.firstName + " " + patient.lastName);
				}
				if (matchYear(patient, textCopy)) {
					WScript.Echo("Hard Match'ed " + patient.firstName + " " + patient.lastName);
					hardMatches.push(patient);
				}
			}
		}
		if (hardMatches.length == 0) {
			if (origSoftMatches.length == 0) {
				return softMatches;
			} else {
				return origSoftMatches;
			}
		} else {
			return hardMatches;
		}
	} else {
		return origHardMatches;
	}
}

function matchYear(patient, textCopy) {
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
		var shortStartIndex = (yearIndex - 9) < 0 ? 0 : (yearIndex - 9) ;
		var shortEndIndex = (yearIndex + 9) > textCopy.length ? textCopy.length : (yearIndex + 9) ;
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

		var day1Index = dateText.indexOf(patient.day1);
		var day2Index = dateText.indexOf(patient.day2);

		if (day1Index != -1 || day2Index != -1) {
			return true;
		}
	}
}

function canBeSoftMatch(patient) {
	name = getMatchingNames(patient.firstName).join("")
	name += getMatchingNames(patient.lastName).join("")

	if (name.length > 7)
		return true;
	else
		return false;
}

function getMatchingNames(name) {
	var unfilteredNames = name.split(" ");
	var names = []
	if (unfilteredNames.length > 1 && unfilteredNames.sort(function (a, b) { return b.length - a.length; })[0].length > 2) {
		for (var i = 0; i < unfilteredNames.length; i++) {
			if (unfilteredNames[i].length > 2) {
				names.push(unfilteredNames[i]);
			}
		}
	} else {
		names = unfilteredNames;
	}

	return names;
}

function matchName(name, text) {

	var names = getMatchingNames(name);
	names.sort(function (a, b) { return b.length - a.length; });
	if (names.length > 1 && names[1].length >= 5)
		names = names.splice(0, 2);
	else if (names.length > 1 && names[1].length < 4)
		names = names.splice(0, 1);

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

function matchName1(firstName, lastName, textCopy) {
	var firstNameIndex = matchName(firstName, textCopy);
	while (firstNameIndex != -1) {
		textCopy = textCopy.substring(0, firstNameIndex) + textCopy.substring(firstNameIndex + firstName.length);
		var startIndex = (firstNameIndex - lastName.length - 5) < 0 ? 0 : (firstNameIndex  - lastName.length - 5);
		var endIndex = (firstNameIndex + lastName.length + 5) > textCopy.length ? textCopy.length : (firstNameIndex + lastName.length + 5);
		var nameText = textCopy.substring(startIndex, endIndex).toLowerCase();

		var lastNameIndex = matchName(lastName, nameText);
		if (lastNameIndex != -1) {
			return true
		}
		firstNameIndex = matchName(firstName, textCopy);
	}
	return false;
}

function isLikelyMatch(firstName, lastName, text) {

	names = (getMatchingNames(firstName)).concat(getMatchingNames(lastName));
	names.sort(function (a, b) { return b.length - a.length; });
	if (names[1].length >= 5)
		names = names.splice(0, 2);
	else if (names[1].length < 4)
		names = names.splice(0, 1);

	for (var i = 0; i < names.length; i++) {
		if (text.indexOf(names[i]) != -1)
			return true;
	}

	return false;
}

function matchName2(firstName, lastName, text) {
	if (isLikelyMatch(firstName, lastName, text)) {
		names = (getMatchingNames(firstName)).concat(getMatchingNames(lastName));
		names.sort(function (a, b) { return b.length - a.length; });
		if (names[1].length >= 5)
			names = names.splice(0, 2);
		for (var i = 0; i < names.length; i++) {
			var textCopy = text;
			var ind = textCopy.indexOf(names[i]);
			while (ind != -1) {
				var frontSlice = textCopy.substring(0, ind);
				var backSlice = textCopy.substring(ind + names[i].length);
				textCopy = frontSlice + backSlice;
				var namesCopy = names.slice();
				namesCopy.splice(i, 1);
				var joinedLength = namesCopy.join(" ").length;
				var acceptableLength = parseInt(joinedLength * 2.5);
				var startIndex = ind - acceptableLength < 0 ? 0 : ind - acceptableLength;
				var endIndex = ind + acceptableLength >= textCopy.length ? textCopy.length - 1 : ind + acceptableLength;
				var textCopyBack = textCopy.substring(startIndex, ind);
				var textCopyFront = textCopy.substring(ind, endIndex);
				var matched = true;
				if (namesCopy.length == 0)
					return false;
				for (var j = 0; j < namesCopy.length; j++) {
					var matchedBack = fuzzyMatch(namesCopy[j], textCopyBack, namesCopy[j].length, 0);
					var matchedFront = fuzzyMatch(namesCopy[j], textCopyFront, namesCopy[j].length, 0);
					
					if (!(matchedBack || matchedFront))
						matched = false;
				}
				if (matched)
					return true;

				var ind = textCopy.indexOf(names[i]);
			}
		}
	}
	return false;
}

function fuzzyMatch(name, text, origLength, numMatch) {
	if (origLength > 10 && numMatch/origLength > 0.7)
		return true;
	else if (origLength > 6 && numMatch/origLength > 0.74)
		return true;
	else if (origLength > 4 && numMatch/origLength > 0.79)
		return true;
	else if (origLength >= 1 && origLength <= 4 && numMatch/origLength == 1)
		return true;
	else if (numMatch/origLength >= 0.85)
		return true;

	if (name.length == 0 || text.length == 0)
		return false;

	//console.log("name = " + name + ", text = " + text + ", origLength = " + origLength + ", numMatch = " + numMatch);
	if (text.indexOf(name.charAt(0)) != -1) {
		var newText = text.substring(text.indexOf(name.charAt(0)) + 1, text.indexOf(name.charAt(0)) + parseInt(name.length * 2));
		var matched1 = fuzzyMatch(name.substring(1), newText, origLength, numMatch + 1);
		var matched2 = fuzzyMatch(name, text.substring(text.indexOf(name.charAt(0)) + 1), origLength, numMatch);
		var matched3 = fuzzyMatch(name.substring(1), text, origLength, numMatch);
		return matched1 || matched2 || matched3;
	} else {
		return fuzzyMatch(name.substring(1), text, origLength, numMatch);
	}
}
