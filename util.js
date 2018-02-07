function postData(url, data, description) {

	var method = "POST";
	var shouldBeAsync = false;
	var request = new ActiveXObject("MSXML2.ServerXMLHTTP");  

	request.open(method, url, shouldBeAsync);

	request.setRequestHeader("Host", "prowand.allscriptscloud.com:5006");
	request.setRequestHeader("Content-Type", "application/json");
	request.setRequestHeader("Accept", "application/json");
	request.setRequestHeader("Accept-Language", "en-us");

	request.send(data);

	if (request.status != 200) {
		WScript.Echo(request.responseText + "\n\n\n");
		WScript.Echo("There was an error " + description + ".  ");
		WScript.Echo("See the above message for some information on the problem at hand.");
		throw '';
	}

	return request;
}


function fileExists(filePath) {
	var fso  = new ActiveXObject("Scripting.FileSystemObject"); 
	return fso.FileExists(filePath);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function fuzzyHasMatch(query, text) {
	query = query.split('').join(' ').replace(/ +(?= )/g,'');
	return hasMatch(query, text);
}

function hasMatch(query, text) {
	text = text.toLowerCase();
	query = query.toLowerCase();
	var queries = query.split(" ");
	while (text.indexOf(queries[0]) != -1) {
		var startIndex = text.indexOf(queries[0]) - query.length - 5;
		startIndex = startIndex < 0 ? 0 : startIndex;
		var endIndex = text.indexOf(queries[0]) + query.length + 5;
		endIndex = endIndex > text.length - 1 ? text.length - 1 : endIndex;
		var subText = text.substring(startIndex, endIndex);

		text = text.substring(0, text.indexOf(queries[0])) + text.substring(text.indexOf(queries[0]) + queries[0].length);

		var matchNum = 1;
		for (var i = 1; i < queries.length; i++) {
			var stIndex = subText.indexOf(queries[i]);
			if (stIndex != -1) {
				subText = subText.substring(0, stIndex) + subText.substring(stIndex + queries[i].length);
				matchNum++;
			}
		}

		if (matchNum/queries.length >= 0.8)
			return true;
	}
	return false;
}
