$(document).ready(function() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://letushide.com/location/cn/list_of_free_China_proxy_servers", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			index = 0;
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
				new_body += "<tr style='background-color:" + color[i % 2] + ";text-align:center;'><td style='width:75px;'><button id='" + id + "'>Connect</button></td><td>" + host + "</td><td>" + port + "</td><td>" + protocol + "</td><td>" + speed + "</td><td>" + reliability + "</td></tr>";
			}
			if (new_body == "") {
				document.write("<div style='color:red;width:200px;text-align:center;'>Failed to load proxies.</div>");
			}
			else {
				document.write("<div><table><thead><tr style='color:navy;text-align:center;'><td style='width:75px;'><button id='0'>Reset</button></td><td>Host</td><td>Port</td><td>Scheme</td><td>Speed</td><td>Reliability</td></tr></thead>" + new_body + "</table></div>");
				$('button').click(function() {
					id = $(this).attr('id');
					if (id == '0') {
						chrome.proxy.settings.clear(
							{scope: 'regular'},
							function() {});
						console.log('reset');
						$('button#' + index.toString()).text('Connect');
						$('button#' + index.toString()).css('color', '');
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
								},
								bypassList: ['*google*', '*gmail*', '*letushide.com*']
							}
						}
						chrome.proxy.settings.set(
								{value: config, scope: 'regular'},
								function() {});
						console.log(protocol.toLowerCase() + "://" + ip + ":" + ports);
						if (index > 0) {
							$('button#' + index.toString()).text('Connect');
							$('button#' + index.toString()).css('color', '');
						}
						index = id;
						$(this).text('Proxied');
						$(this).css('color', 'navy');
					}
				});
			}
		}
	}
	xhr.send();
});
