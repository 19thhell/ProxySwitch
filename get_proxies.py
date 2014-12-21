import urllib2
import json
from bs4 import BeautifulSoup

def parse_proxy(proxies):
    result = []
    for proxy in proxies:
        ip = proxy.contents[1].contents[0].contents[0]
        port = proxy.contents[2].contents[0]
        protocol = proxy.contents[3].contents[0].contents[0]
        anonymity = proxy.contents[4].contents[0].contents[0]
        speed = proxy.contents[5]['class'][0][-1]
        reliability = proxy.contents[6].contents[0]
        last_check = proxy.contents[8].contents[0]
        result.append({
            'ip' : ip,
            'port' : port,
            'protocol' : protocol,
            'anonymity' : anonymity,
            'speed' : speed,
            'reliability' : reliability,
            'last_check' : last_check
            })
    return result

soups = []
html = urllib2.urlopen('http://letushide.com/location/cn/list_of_free_China_proxy_servers').read()
soup = BeautifulSoup(html)
soups.append(soup)

for page in soup.find('ul', id = 'page').contents[1:]:
    index = page.contents[0].contents[0]
    next_url = 'http://letushide.com/location/cn/' + index + '/list_of_free_China_proxy_servers'
    html = urllib2.urlopen(next_url).read()
    soups.append(BeautifulSoup(html))

result = {'data' : []}
for soup in soups:
    table = soup.find('table', id = 'basic').tbody
    proxies = table.find_all('tr')
    result['data'].extend(parse_proxy(proxies))

with open('proxy.json', 'w') as out_file:
    json.dump(result, out_file)
