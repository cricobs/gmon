// ==UserScript==
// @name        countdown wait
// @namespace   manobastardo
// @include     *vodlocker.com*
// @include     *gorillavid*
// @include     http://bestreams.net*
// @include     *thevideo*
// @include     *streamin*
// @include     *vidbull*
// @include     *daclips*
// @include     *streamplay*
// @version     1.1
// @grant       none
// @description video countdown wait|play click
// ==/UserScript==

current_url = window.location.href;

function elements() {
    var values = {
        "button": "",
        "player": "",
        "wanted": "",
        "current": ""
    };

    if (current_url.indexOf("gorillavid") > -1) {
        values.button = $('#btn_download');
        values.wanted = "continue";
        values.current = values.button.attr("value");
    } else if (current_url.indexOf("streamplay") > -1) {
        values.button = $('#btn_download');
        values.wanted = "hidden";
        values.current = $("#countdown_str").css("visibility");
    } else if (current_url.indexOf("daclips") > -1) {
        values.button = $('#btn_download');
        values.wanted = "continue";
        values.current = values.button.attr("value");
    } else if (current_url.indexOf("bestreams") > -1) {
        values.button = $('#btn_download');
        values.wanted = "hidden";
        values.current = $("#countdown_str").css("visibility");
    } else if (current_url.indexOf("vodlocker") > -1) {
        values.button = $('#btn_download');
        values.wanted = "hidden";
        values.current = $("#countdown_str").css("visibility");
    } else if (current_url.indexOf("thevideo") > -1) {
        values.button = $('#btn_download');
        values.wanted = "proceed";
        values.current = values.button.text();
    } else if (current_url.indexOf("streamin") > -1) {
        values.button = $('#btn_download');
        values.wanted = "hidden";
        values.current = $("#countdown_str").css("visibility");
    } else if (current_url.indexOf("vidbull") > -1) {
        values.button = $('#btn_download');
        values.wanted = "block";
        values.current = $('#download_linkb').css("display");
    }

    return values
}

function wait_button() {
    var e = elements();
    
    if (e.current.toLowerCase().indexOf(e.wanted) > -1) {
        e.button[0].click();
    } else {
        setTimeout(wait_button, 333);
    }
}

window.onload = wait_button;