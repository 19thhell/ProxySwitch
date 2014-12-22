$(document).ready(function() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://letushide.com/location/cn/list_of_free_China_proxy_servers", true);
	index = 0;
	chrome.storage.local.get('index', function(result) {
		if (result.index == undefined) {
			chrome.storage.local.set({'index': '0'});
		}
		else {
			index = result.index;
		}
	});
	xhr.onreadystatechange = (function() {
		return function() {
			if (xhr.readyState == 4) {
				console.log(index);
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
					if (index != '0') {
						$('button#' + index).text('Proxied');
						$('button#' + index).css('color', 'navy');
					}
					$('button').click(function() {
						id = $(this).attr('id');
						if (id == '0') {
							chrome.proxy.settings.clear(
								{scope: 'regular'},
								function() {});
							console.log('reset');
							if (index != '0') {
								$('button#' + index).text('Connect');
								$('button#' + index).css('color', '');
								chrome.storage.local.set({'index': '0'});
								index = '0';
							}
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
							};
							chrome.proxy.settings.set(
									{value: config, scope: 'regular'},
									function() {});
							console.log(protocol.toLowerCase() + "://" + ip + ":" + ports);
							console.log(index);
							if (index != '0') {
								$('button#' + index).text('Connect');
								$('button#' + index).css('color', '');
							}
							index = id;
							$(this).text('Proxied');
							$(this).css('color', 'navy');
							chrome.storage.local.set({'index': id});
						}
					});
				}
			}
		}
	})();
	xhr.send();
});
