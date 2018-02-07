var blacklist = [];

var currPatient = {};
currPatient.firstName = "pit c.";
currPatient.lastName = "tan";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "na";
currPatient.lastName = "su";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "li";
currPatient.lastName = "pan";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "test";
currPatient.lastName = "test";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "maryam";
currPatient.lastName = "rahnemun";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "ali";
currPatient.lastName = "ali";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "sung un";
currPatient.lastName = "yi";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "farah  duplicate";
currPatient.lastName = "el moudari duplicate";
blacklist.push(currPatient);

function isBlacklisted(patient) {
	for (var i = 0; i < blacklist.length; i++) {
		if (patient.firstName.toLowerCase() == blacklist[i].firstName && patient.lastName.toLowerCase() == blacklist[i].lastName)
			return true;
	}
	return false;
}
