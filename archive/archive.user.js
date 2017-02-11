// ==UserScript==
// @name        archive
// @namespace   manobastardo
// @include     https://archive.org/*
// @version     1
// @grant       none
// ==/UserScript==

function wait() {
    var items = $("#jw6_display_button");
    if (items.length != 0) {
        return items.click();
    }
    setTimeout(wait, 333); 
}

wait();