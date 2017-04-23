// ==UserScript==
// @name        primewire
// @namespace   manobastardo
// @include     http://www.primewire.ag/*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description primewire remove sponsored last_versions|click unique search result|click preferred last_versions
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
    "vidlox",
    "vidzi",
    "streamin",
    "gorillavid",
    "bestreams",
    "sharesix",
    "filenuke",
    "novamov"
];
var versions = $('.movie_version');
var last_movie = GM_getValue("last_movie");
var last_versions = JSON.parse(GM_getValue("last_versions", "[]"));
var site, site_versions, site_version, i, j;
for (i = 0; i < sites.length; i++) {
    site = sites[i];
    // using rating url as reference
    site_versions = versions.find("a[href*='" + site + "']:first");
    for (j = 0; j < site_versions.length; j++) {
        site_version = $(site_versions[j]);
        if (last_movie == window.location.href) {
            if (last_versions.indexOf(site_version.attr("href")) != -1) {
                continue;
            }
            last_versions.push(site_version.attr("href"));

        } else {
            last_movie = window.location.href;
            last_versions = [site_version.attr("href")];
        }

        GM_setValue("last_movie", last_movie);
        GM_setValue("last_versions", JSON.stringify(last_versions));
        window.location.assign(site_version
            .closest(".movie_version")
            .find(".movie_version_link a")
            .attr("href")
        );

        j = site_versions.length;
        i = sites.length;
    }
}