// ==UserScript==
// @name        platform
// @namespace   manobastardo
// @include     http://browserspy.dk*
// @version     1
// @grant       none
// @run-at      document-start
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// ==/UserScript==

Object.defineProperty(navigator, "platform", {
    get: function () {
        return "Win64";
    }
});

Object.defineProperty(navigator, "oscpu", {
    get: function () {
        return "windows";
    }
});

Object.defineProperty(navigator, "userAgent", {
    get: function () {
        return "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/28.0.1469.0 Safari/537.36";
    }
});
