// ==UserScript==
// @name        youtube reload
// @namespace   manobastardo
// @include     https://www.youtube.com/watch?*
// @version     1
// @grant       none
// ==/UserScript==

function reload() {
    player = document.getElementById("movie_player");

    var url = player.getVideoUrl();
    var date = new Date();
    date.setTime(player.getCurrentTime() * 1000);

    url += "&t=";
    url += (date.getUTCSeconds() > 3 ? date.getUTCSeconds() - 3 : 0) + "s";
    url += date.getUTCMinutes() + "m";
    url += date.getUTCHours() + "h";

    window.open(url, '_self', '');
}

// document.addEventListener('keydown', function (e) {
//     if (e.keyCode == 68 && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
//         reload();
//     }
// }, false);

var button = document.createElement("input");
button.setAttribute('type', 'button');
button.setAttribute('id', 'youtube-reload');
button.setAttribute('value', 'reload');
button.onclick = reload;

var parent = document.getElementsByClassName("yt-masthead-logo-container ")[0];
parent.appendChild(button);