// ==UserScript==
// @name        google gmail
// @namespace   manobastardo
// @include     https://mail.google.com/mail/*
// @version     1
// @run-at      document-start
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description google gmail remove empty notification
// ==/UserScript==

var seen, step = 0;
var _wait = setInterval(function () {
    step += +(document.readyState == "complete");
    seen = $('a[href*="utm_campaign"]');
    if (seen.length || step > 99) {
        clearInterval(_wait);
        seen.parent().remove();
    }
}, 333);