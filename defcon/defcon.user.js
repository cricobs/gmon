// ==UserScript==
// @name        defcon
// @namespace   manobastardo
// @include     /https://media\.defcon\.org/def.*/
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// ==/UserScript==
$("#list").find("a").each(function () {
    var text = $(this).text()
        .replace(/def(\s|)con [0-9]+/ig, "")
        .replace("Hacking Conference Presentation By ", "")
        .replace(/-[^-]*$/gi, "")
        .trim();

    $(this).text(text);
});