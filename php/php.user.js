// ==UserScript==
// @name        php
// @namespace   manobastardo
// @include     http://php.net/manual/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==

$("#breadcrumbs").detach().insertAfter("#layout");