$(document).ready(function() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://letushide.com/location/cn/list_of_free_China_proxy_servers", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			html = xhr.responseText;
			page = $('<div></div>');
			page.html(html);
			table = page.find("table.data").first();
			tbody_r = table.children("tbody").children("tr");
			new_body = "";
			color = ["#efefef", "ffffff"];
			for (var i = 0;i < tbody_r.length;i++) {
				tds = tbody_r[i].childNodes;
				id = tds[0].innerHTML;
				host = tds[1].childNodes[0].innerHTML;
				port = tds[2].innerHTML;
				protocol = tds[3].childNodes[0].innerHTML;
				speed = tds[5].className[1];
				reliability = tds[6].innerHTML;
				new_body += "<tr style='background-color:" + color[i % 2] + ";text-align:center;'><td><button id='" + id + "'>Connect</button></td><td>" + host + "</td><td>" + port + "</td><td>" + protocol + "</td><td>" + speed + "</td><td>" + reliability + "</td></tr>";
			}
			document.write("<div><table><thead><tr style='color:navy;text-align:center;'><td><button id='0'>Reset</button></td><td>Host</td><td>Port</td><td>Protocol</td><td>Speed</td><td>Reliability</td></tr></thead>" + new_body + "</table></div>");
			$('button').click(function() {
				id = $(this).attr('id');
				if (id == '0') {
					chrome.proxy.settings.clear(
						{scope: 'regular'},
						function() {});
					console.log('reset');
				}
				else {
					next = $(this).parent().next();
					ip = next.text();
					next = next.next();
					ports = next.text();
					next = next.next();
					protocol = next.text();
					config = {
						mode: 'fixed_servers',
						rules: {
							singleProxy: {
								scheme: protocol.toLowerCase(),
								host: ip,
								port: parseInt(ports)
							}
						}
					}
					chrome.proxy.settings.set(
							{value: config, scope: 'regular'},
							function() {});
					console.log(protocol.toLowerCase() + "://" + ip + ":" + ports);
					chrome.proxy.settings.get(
							  {'incognito': false},
							  function(config) {console.log(JSON.stringify(config));});
				}
			});
		}
	}
	xhr.send();
});
