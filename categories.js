var categories = [];

var currCategory = {};
currCategory.key = "Pathology";
currCategory.id = -41;
currCategory.values = [
	"Pathology"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "Mammogram";
currCategory.id = -35;
currCategory.values = [
	"Mammogram"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "Patient Questioner";
currCategory.id = -115;
currCategory.values = [
	"Questionaire"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "Demographics";
currCategory.id = -24;
currCategory.values = [
	"As a primary care physician I can take care of your entire"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "Hospital Report";
currCategory.id = -31;
currCategory.values = [
	"Hospital"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "Assessment";
currCategory.id = 101;
currCategory.values = [
	"Staying Healthy Assessment",
	"MiniMental State Examination"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "Laboratory Reports";
currCategory.id = 5;
currCategory.values = [
	"Labcorp",
	"Quest Diagnostics",
	"Medical Laboratory",
	"Pacific Medical Laboratory",
	"Laboratory Report"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "Radiology";
currCategory.id = -46;
currCategory.values = [
	"Radnet Imaging Center",
	"Advanced Imaging",
	"Dynamic Medical Imaging",
	"West Coast Radiology",
	"Imaging Services",
	"Magnolia Medical Imaging",
	"Orange Imaging Medical",
	"Medizen Advanced Imaging",
	"Orange County Diagnostics",
	"Mission Imaging Center",
	"Mission Hospital Radiology",
	"Lab Radiology Orders",
	"Department Of Imaging",
	"Memorial Care Imaging",
	"Women's Imaging Center",
	"Breastlink",
	"Radiology",
	"Saddleback Valley Radiology",
	"Crown Valley Imaging",
	"CrownValley Imaging",
	"United Medical Imaging"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "Medication Refill";
currCategory.id = -38;
currCategory.values = [
	"Pharmacy Rx",
	"Costco Pharmacy",
	"Target Pharmacy",
	"Rite Aid",
	"CVS Pharmacy",
	"Prescription Refill",
	"Refill Authorization",
	"Savon Pharmacy",
	"Plus Pharmacy",
	"New Prescription",
	"Walgreens",
	"For Refills",
	"Erx Network",
	"Ramsay Rexall",
	"Seena Pharmacy",
	"Farmacia Santa Ana",
	"Razi Pharmacy",
	"Refill Authorization",
	"Rx Authorization",
	"Pars Pharmacy",
	"Medical Arts Pharmacy",
	"Prescription Request",
	"Request For Authorization"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "Authorizations";
currCategory.id = -20;
currCategory.values = [
	"Referral Status Form",
	"Letter of Referral",
	"Notice of Action",
	"Authorization Date/Number",
	"Provider Authorization Notification",
	"Notice Of Authorization Of Services",
	"Notification Of Approval",
	"Form to File a State Hearing",
	"Notice Of Authorization Of Services"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "Consultation Report";
currCategory.id = 1;
currCategory.values = [
	"Patient Clinical Summary",
	"UC Irvine Health",
	"History of present illness",
	"All Health Plans",
	"All Networks",
	"Consultation Report",
	"Consultation Notes",
	"Hearing Care Professionals",
	"STAR Gaps in Care",
	"Emergency Department Visit",
	"Cardiology Specialists",
	"Operative Report",
	"University Physicians & Surgeons",
	"UC Irvine Health",
	"University of California Irvine Health"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "PHQ-9 Patient Depression Questioner";
currCategory.id = -106;
currCategory.values = [
	"PHQ-9 && Depression"
];
categories.push(currCategory);

var currCategory = {};
currCategory.key = "EKG";
currCategory.id = -27;
currCategory.values = [
	"Schiller America",
	"2157-017A"
];
categories.push(currCategory);

var defaultCategory = {};
defaultCategory.key = "Medical Report";
defaultCategory.id = -36;

function getCategory(filePath) {

	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var forReading = 1;
	var file = fso.OpenTextFile(filePath, forReading, false, 0);
	var text = file.ReadAll();
	file.close();

	for (var i = 0; i < categories.length; i++) {
		for (var j = 0; j < categories[i].values.length; j++) {
			if (hasMatch(categories[i].values[j], text)) {
				WScript.echo("Matched " + categories[i].values[j] + " for " + categories[i].key);
				return categories[i];
			}
		}
	}

	return defaultCategory;
}
