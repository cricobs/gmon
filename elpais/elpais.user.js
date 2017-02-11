// ==UserScript==
// @name        elpais
// @namespace   manobastardo
// @include     http://elpais.com/*
// @version     1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==
$("body").children().each(function () {
    $(this).text($(this).text().replace(/\"/g,""));
});