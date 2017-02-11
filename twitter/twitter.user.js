// ==UserScript==
// @name        twitter
// @namespace   manobastardo
// @include     https://twitter.com/*
// @version     1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

// todo make direct request
//
// function unsubscribe() {
//     console.info("unsubscribe");
//     console.info($(".twitter-unsubscribe").length);
//     console.info($(".twitter-unsubscribe").find(".fullname").text());
//     $(".twitter-unsubscribe").find(".fullname").mouseover();
//     $(".twitter-unsubscribe").css("background-color", "red");
// }
//
// window.onload = function () {
//     $(".stream-item").hover(function () {
//         $(this).toggleClass("twitter-unsubscribe");
//     });
// };
//
// document.addEventListener('keydown', function (e) {
//     if (e.keyCode == 85  && e.altKey) {
//         unsubscribe();
//     }
//     console.info("keydown");
// }, false);
//
// console.info("OK");


$("#search-query").removeAttr("placeholder");