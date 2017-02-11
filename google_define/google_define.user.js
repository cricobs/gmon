// ==UserScript==
// @name        google define
// @namespace   manobastardo
// @include     https://www.google.com/search?*q=define*
// @include     https://translate.google.com*
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// ==/UserScript==

window.onload = function () {
    $(".vk_ard, .cd-exp-ar").each(function () {
        console.info($(this));
        $(this).click();
    });
};
