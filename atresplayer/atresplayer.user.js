// ==UserScript==
// @name        atresplayer
// @namespace   manobastardo
// @include     http://www.atresplayer.com/*
// @version     1
// @grant       none
// ==/UserScript==

var button;

function wait_play () {
  button = $("a.playerimg.play:first");

  if (button.length > 0 && button.is(':visible')) {
    button[0].click();
    $($("#capa_modulo_player").find("> object").get().splice(1)).remove();
    setTimeout(wait_play, 111);
  }
}

wait_play();