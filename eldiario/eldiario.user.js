// ==UserScript==
// @name        eldiario
// @namespace   manobastardo
// @include     http://www.eldiario.es*
// @version     1
// @grant       none
// @description eldiario remove user distinction
// ==/UserScript==

var wait = setInterval(function () {
    var elements = $(".comment-item-v2-user_type");
    if (elements.length) {
        elements.removeClass("comment-item-v2-user_type");
        clearInterval(wait);
    }
}, 111);