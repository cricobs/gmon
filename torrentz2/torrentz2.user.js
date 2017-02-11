// ==UserScript==
// @name        torrentz2
// @namespace   manobastardo
// @include     /^https:\/\/torrentz2\.eu\/(?!search)/
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==

var sites = [
    "monova",
    "torrentproject"
];

var items = $(".download dl");
var site, item, link, g, i;
for (g = sites.length - 1; g > -1; g--) {
    site = sites[g];
    for (i = items.length - 1; i > -1; i--) {
        item = $(items[i]).find('.u').text();
        if (item.indexOf(site) > -1) {
            link = $(items[i]).find("a");
            window.location.assign(link.attr("href"));

            i = g = -2;
        }
    }
}