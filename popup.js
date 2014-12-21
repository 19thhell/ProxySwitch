function load() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://letushide.com/location/cn/list_of_free_China_proxy_servers", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
//			alert(xhr.responseText);
			document.write(xhr.responseText);
		}
	}
	xhr.send();
}
load();
