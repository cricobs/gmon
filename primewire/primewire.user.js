// ==UserScript==
// @name        primewire
// @namespace   manobastardo
// @include     http://www.primewire.ag/*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description primewire remove sponsored links|click unique search result|click preferred links
// ==/UserScript==

// version block
var block = ['sponsor host', "promo host"];

$("table.movie_version").each(function () {
    var sample = $(this).find(".version_host").text().toLowerCase();
    var length = block.length;
    while (length--) {
        if (sample.indexOf(block[length]) != -1) {
            $(this).css("display", "none");
        }
    }
});

// search result
var items = $(".index_item.index_item_ie");

if (items.length == 1) {
    window.location.assign(items.find("a").attr("href"));
}

/*
 version preferred
 if the same movie is visited multiple times consecutively, link will be assumed broken, a new one will be selected.
 it will be forgotten when a new movie is visited.
 */

var sites = [
    "novamov",
    "filenuke",
    "sharesix",
    "bestreams",
    "gorillavid",
    "streamin",
    "vidzi",
    "vodlocker",
    "streamplay"
];

var versions = $('.movie_version');
var part = GM_getValue("last_part");
var links = JSON.parse(GM_getValue("last_links", "[]"));
var site, version, link, g, i;
for (g = sites.length - 1; g > -1; g--) {
    site = sites[g];
    for (i = versions.length - 1; i > -1; i--) {
        version = $(versions[i]).find('.version_host').text();
        if (version.indexOf(site) > -1) {
            link = $(versions[i]).find("a");

            if (part == window.location.href) {
                if (links.indexOf(link.attr("href")) != -1) {
                    continue;
                }
                links.push(link.attr("href"))

            } else {
                part = window.location.href;
                links = [link.attr("href")];
            }

            GM_setValue("last_part", part);
            GM_setValue("last_links", JSON.stringify(links));

            window.location.assign(link.attr("href"));

            i = g = -2;
        }
    }
}

if (g == -1) {
    for (g = sites.length - 1; g > -1; g--) {
        site = sites[g];
        for (i = versions.length - 1; i > -1; i--) {
            link = $(versions[i]).find("a");

            if (part == window.location.href) {
                if (links.indexOf(link.attr("href")) != -1) {
                    continue;
                }
                links.push(link.attr("href"))

            } else {
                part = window.location.href;
                links = [link.attr("href")];
            }

            GM_setValue("last_part", part);
            GM_setValue("last_links", JSON.stringify(links));

            window.location.assign(link.attr("href"));

            i = g = -2;
        }
    }
}