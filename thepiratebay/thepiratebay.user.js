// ==UserScript==
// @name        thepiratebay
// @namespace   manobastardo
// @include     https://thepiratebay.org/torrent/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 68  && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
        window.open($("#details").find(".download:first a").attr("href"), '_self', '');
        window.close();
    }
}, false);