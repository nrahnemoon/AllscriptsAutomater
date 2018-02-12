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

var currPatient = {};
currPatient.firstName = "than";
currPatient.lastName = "aye";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "male";
currPatient.lastName = "training";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "quest";
currPatient.lastName = "test5";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "brain";
currPatient.lastName = "test";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "babyboy";
currPatient.lastName = "training";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "babygirl";
currPatient.lastName = "training";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "female";
currPatient.lastName = "training";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "girlfriend";
currPatient.lastName = "training";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "pregnant";
currPatient.lastName = "training";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "boychild";
currPatient.lastName = "training";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "girlchild";
currPatient.lastName = "training";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "testpatient";
currPatient.lastName = "ten";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "patient";
currPatient.lastName = "test";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "young";
currPatient.lastName = "ja ";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "tai";
currPatient.lastName = "vo";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "testpatient";
currPatient.lastName = "connect";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "testpatient";
currPatient.lastName = "insurance";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "u";
currPatient.lastName = "tain";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "testpatient";
currPatient.lastName = "medicare";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "testpatient";
currPatient.lastName = "comm";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "testpatient";
currPatient.lastName = "three";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "testpatient";
currPatient.lastName = "eight";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "questmedicare";
currPatient.lastName = "test";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "test";
currPatient.lastName = "donotdelete";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "paul";
currPatient.lastName = "(949) 262-0520";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "testpatient";
currPatient.lastName = "four";
blacklist.push(currPatient);

var currPatient = {};
currPatient.firstName = "maryam";
currPatient.lastName = "vanpanahandehvansofl";
blacklist.push(currPatient);

function isBlacklisted(patient) {
	for (var i = 0; i < blacklist.length; i++) {
		if (patient.firstName.toLowerCase() == blacklist[i].firstName && patient.lastName.toLowerCase() == blacklist[i].lastName)
			return true;
	}
	return false;
}

var textBlacklist = [
	"monarch",
	"maryam rahnemun",
	"maryamrahnemun",
	"maryam rahn",
	"rahnemun,maryam",
	"rahnemun, maryam",
	"mun, maryam",
	"align",
	"confidentiality",
	"quality",
	"dissemination",
	"relevant",
	"grievance",
	"cvs",
	"walgreen",
	"understand",
	"disseminat",
	"st. joseph hospital",
	"st. joseph health",
	"st joseph hospital",
	"st joseph health",
	"st. joseph",
	"st joseph",
	"los angeles",
	"normal",
	"portion",
	"service",
	"provider"
];

function filterText(text) {
	for (var i = 0; i < textBlacklist.length; i++) {
    	re = new RegExp(textBlacklist[i], "g");
    	text = text.replace(re, "");
	}
	return text;
}
