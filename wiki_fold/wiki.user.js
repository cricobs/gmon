// ==UserScript==
// @name        wiki fold
// @namespace   manobastardo
// @include     *wikipedia.org*
// @include     *wiktionary.org*
// @include     *wikisource.org*
// @include     *wikiversity.org*
// @include     https://wiki.greasespot.net/*
// @version     1
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @resource    wiki.css wiki.css
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @description double click on header to show/hide all | single click on header to show/hide content | double click on content to show/hide reference&link
// ==/UserScript==

GM_addStyle(GM_getResourceText("wiki.css"));

function time_click(single, double) {
    var step = 0, time = null;
    return function (e) {
        step++;
        if (step === 1) {
            time = setTimeout(function () {
                step = 0;
                single(e);
            }, 333);
        } else {
            clearTimeout(time);
            step = 0;
            double(e);
        }
    }
}

function Fold() {
    this.names = {
        "head": "wiki-expand",
        "mint": "wiki-current",
        "hide": "wiki-collapse",
        "item": "wiki-collapsible",
        "root": "wiki-head",
        "text": "wiki-text-shadow"
    };

    this.picks = {
        "text": '#mw-content-text',
        "head": '> h1, > h2, > h3, > h4, > h5, > h6',
        "reference": ".reference",
        "omit": "noscript",
        "link": "a:not([href^='#cite'])"
    };

    this.text = $(this.picks.text);
    this.head = $("<div>").addClass(this.names.root).prependTo(this.text);

    this.take_heads(this.text.find(this.picks.head).add(this.head));
    this.head.click();
}

Fold.prototype = Object.create(Fold.prototype);

Fold.prototype._name = function (name) {
    return this.names[name];
};

Fold.prototype._class = function (name) {
    return "." + this._name(name);
};

Fold.prototype._class_not = function (name) {
    return ":not(" + this._class(name) + ")"
};

Fold.prototype._class_join = function (names, join) {
    join = typeof b !== 'undefined' ? join : " ";
    return names.map(this._class.bind(this)).join(join);
};

Fold.prototype._class_item_mint = function () {
    return this._class("item") + this._class_not("mint")
};

Fold.prototype.lose = function (name) {
    $(this._class(name)).removeClass(this._name(name));
};

Fold.prototype.hide_past = function () {
    $(this._class_item_mint()).addClass(this._name("hide"));
};

Fold.prototype.hide_each = function (event) {
    $(this._class("item")).addClass(this._name("hide"));

    $(event.target).get(0).scrollIntoView()
};

Fold.prototype.show_each = function (event) {
    this.lose("hide");
    this.lose("mint");

    $(event.target).get(0).scrollIntoView()
};

Fold.prototype.flip_each = function (event) {
    if ($(this._class("mint")).length == 0 &&
        $(this._class("item")).filter(":visible:not(" + this.picks.omit + ")").length != 0) {
        this.hide_each(event);
        return
    }

    this.show_each(event)
};

Fold.prototype.flip_link = function () {
    $(this.picks.text + " " + this.picks.link).toggleClass(this._name("text"))
};

Fold.prototype.flip_reference = function () {
    $(this.picks.reference).toggle()
};

Fold.prototype.flip_content = function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.flip_link();
    this.flip_reference();
};

Fold.prototype.flip_head = function (event) {
    if ($(this._class("mint")).length == 0) {
        this.show_head(event);
        return
    }
    this.lose("mint");

    var head = $(event.target)
        .addClass(this._name("mint"))
        .closest(this._class("head"))
        .nextUntil(this._class("head"))
        .addClass(this._name("mint"))
        .toggleClass(this._name("hide"))
        .end();

    this.hide_past();

    $(head).get(0).scrollIntoView();
};

Fold.prototype.show_head = function (event) {
    this.lose("mint");

    var head = $(event.target)
        .addClass(this._name("mint"))
        .closest(this._class("head"))
        .nextUntil(this._class("head"))
        .addClass(this._name("mint"))
        .removeClass(this._name("hide"))
        .end();

    this.hide_past();

    $(head).get(0).scrollIntoView();
};

Fold.prototype.take_head = function (head) {
    head = $(head);

    if (head.children().filter(':visible').length == 0 && !head.hasClass("wiki-head")) {
        head.removeClass(this._name("head"));
        return;
    }

    head
        .on("click", time_click(this.flip_head.bind(this), this.flip_each.bind(this)))
        .nextUntil(this._class("head"))
        .addClass(this._name("hide"))
        .addClass(this._name("item"))
        .dblclick(this.flip_content.bind(this));
};

Fold.prototype.take_heads = function (heads) {
    return heads
        .addClass(this._name("head"))
        .get()
        .reverse()
        .map(this.take_head.bind(this));
};

new Fold();