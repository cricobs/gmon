// ==UserScript==
// @name        bbc
// @namespace   manobastardo
// @include     http://www.bbc.com/
// @version     1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==


$("a[href^='/sport']").parents('.media-list__item').css("display", "none");