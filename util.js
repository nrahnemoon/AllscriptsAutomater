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
