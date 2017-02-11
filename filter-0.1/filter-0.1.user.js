// ==UserScript==
// @name        filter-0.1
// @namespace   manobastardo
// @version     1
// @grant       GM_xmlhttpRequest
// @include     //localhost(:[0-9]+|)/filter-0\.1/test\.(php|html)/
// @include     https://www.reddit.com*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

// callback
function Call(calls) {
    this.calls = calls || {}
}

Call.prototype = {};

Call.prototype.find = function(finds) {
    var calls = finds.reduce(function (calls, find) {
        return calls[find];
    }, this.calls);

    if (calls === undefined) {
        throw Error("callback find " + finds);
    }

    return calls;
};

Call.prototype.push = function (finds, push) {
    this.find(finds).push(push);
    return this;
};

Call.prototype.call = function (finds, call) {
    this.find(finds).map(function (func) {
        func(call);
    });
    return this;
};

// request
function Tell(mode, form, href, type) {
    this.mode = mode;
    this.type = type;
    this.href = href;
    this.form = form;
}

Tell.prototype = new Call({
    fine: [],
    flaw: []
});

Tell.prototype.fine = function (fine) {
    switch (this.mode) {
        case "gmon":
            fine = fine.responseText;
            break;
    }
    switch (this.type) {
        case "json":
            fine = JSON.parse(fine);
            break;
    }
    this.call(["fine"], fine);
};

Tell.prototype.flaw = function (flaw) {
    console.warn("request flaw " + this.href);
    console.info(flaw);
    this.call(["flaw"], flaw);
};

Tell.prototype.hear = function () {
    switch (this.mode) {
        case "gmon":
            GM_xmlhttpRequest({
                method: this.form,
                url: this.href,
                onload: this.fine.bind(this),
                onerror: this.flaw.bind(this)
            });
            break;
        case "ajax":
            $.ajax(this.href, {
                success: this.fine.bind(this),
                error: this.flaw.bind(this)
            });
            break;
        default:
            throw Error("request mode: " + this.mode);
    }

    return this;
};

var tell = new Tell("gmon", "GET", "//localhost/filter-0/item/item.php", "json")
    .push(["fine"], function (values) {
        console.info(values);
    }).hear();

console.info(tell);