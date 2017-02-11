// ==UserScript==
// @name        filter
// @namespace   manobastardo
// @version     1
// @grant       GM_xmlhttpRequest
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description filter elements
// ==/UserScript==

// menu
function menu_action(e) {
    // @ right click on menuitem
    var item = e.target;
    item.expression = item.expression ? menu.expression : item.expression;

    switch (item.title) {
        case "edit":
            var expression = prompt("edit filter", item.expression);
            if (expression == null) {
                return;
            }
            item.expression = expression;
            break;

        case "reload":
            database_get();
            return;
    }
    if (element_selected != null) {
        element_selected.addClass("filter-selected");
    }

    filter_add(item.expression);
}

function format_ellipsis(value, length) {
    length = length === null ? 22 : length;
    return value.length > length ? value.substring(0, length).trim() + "..." : value
}

function menu_update(element, selection) {
    var regex = element.getAttribute("regex");
    if (regex !== null) {
        var expression = regex.replace("#", selection);
        element.expression = expression;

        var ellipsis = format_ellipsis(expression);
        element.label = "/" + ellipsis + "/";
    }

    var items = element.childNodes;
    var i, l = items.length;
    for (i = 0; i < l; i++) {
        menu_update(items[i], selection);
    }
}

function menu_show() {
    // @ right click on page
    var s = document.getSelection().toString();
    menu_update(menu, (s ? s : "").replace(/[\s\n\r]+/g, ' ').trim());
}

var menu_values = [{
    "id": "filter-context-menu",
    "type": "context",
    "items": [
        {
            "title": "filter",
            "label": "test",
            "regex": "\\b#\\b",
            "items": [
                {
                    "title": "add",
                    "label": "add"
                },
                {
                    "label": "expressions",
                    "items": [
                        {
                            "title": "s",
                            "id": "s",
                            "regex": "\\b#(s|)\\b"
                        },
                        {
                            "title": "es",
                            "id": "es",
                            "regex": "\\b#(es|)\\b"
                        },
                        {
                            "title": "y1",
                            "id": "y1",
                            "regex": "\\b#(ies|y)\\b"
                        },
                        {
                            "title": "y2",
                            "id": "y2",
                            "regex": "\\b#(ied|ier|iest|ily|y)\\b"
                        },
                        {
                            "title": "y3",
                            "id": "y3",
                            "regex": "\\b#(ing|y)\\b"
                        },
                        {
                            "title": "ie",
                            "id": "ie",
                            "regex": "\\b#(ying|ie)\\b"
                        },
                        {
                            "title": "e",
                            "id": "e",
                            "regex": "\\b#(ing|e)\\b"
                        }
                    ]
                },
                {
                    "title": "edit",
                    "label": "edit"
                },
                {
                    "title": "reload",
                    "label": "reload"
                }
            ]
        }
    ]
}];

function format_menu(parent, values) {
    var i, v, l = values.length;
    for (i = 0; i < l; i++) {
        v = values[i];
        var element = document.createElement("items" in v ? "menu" : "menuitem");
        parent.appendChild(element);
        var attribute, value;
        for (attribute in v) {
            if (!v.hasOwnProperty(attribute)) {
                continue;
            }
            value = v[attribute];
            switch (attribute) {
                case "items":
                    format_menu(element, value);
                    break;
                default:
                    element.setAttribute(attribute, value);
            }
        }
    }
}

var menu_element = document.body.appendChild(document.createElement("menu"));
format_menu(menu_element, menu_values);

var html = document.documentElement;
html.setAttribute("contextmenu", "filter-context-menu");
html.addEventListener("contextmenu", menu_show, false);

var menu = document.querySelector("#filter-context-menu menu");
menu.addEventListener("click", menu_action, false);

// filter
function filter_options(action, expression, hits, state) {
    return {
        action: action,
        expression: expression,
        hits: hits || 0,
        state: state || 1
    }
}

function filter_add(expression) {
    database_set(filter_options("add", expression));
}

// database
function database_options(mode, values) {
    var options = {
        headers: {
            "Content-Type": "application/json"
        },
        method: mode,
        url: "http://localhost/filter/index.php",
        onload: database_changed
    };

    if (values !== undefined) {
        for (var name in values) {
            if (!values.hasOwnProperty(name)) {
                continue;
            }
            options[name] = values[name];
        }
    }
    return options;
}

function database_set(options) {
    GM_xmlhttpRequest(database_options("POST", {data: JSON.stringify(options)}));
}

function database_get() {
    GM_xmlhttpRequest(database_options("GET"));
}

var site_options = {
    "reddit": {
        "regex": /.*www\.reddit\.com\/(?!user)(?!.*\/comments\/)/,
        "contents": [".entry"],
        "element": ".thing"
    },
    "youtube": {
        "regex": /.*youtube\.com\/feed\/subscriptions$/,
        "contents": [".yt-lockup-description", ".yt-lockup-title"],
        "element": ".item-section"
    },
    "twitter": {
        "regex": /.*twitter\.com/,
        "contents": [".tweet-text:not(.u-hidden)"],
        "element": ".tweet"
    }
};

var site_url;
function element_options() {
    site_url = window.location.href;
    var options;
    for (var site in site_options) {
        if (!site_options.hasOwnProperty(site)) {
            continue
        }
        options = site_options[site];
        if (options["regex"].test(site_url)) {
            return options;
        }
    }
}

var element_selected;
function element_context() {
    element_selected = $(this);
}

function element_scroll(current) {
    var position = $(document).height();
    if (current != null) {
        var i, v, l = clean.length;
        for (i = 0; i < l; i++) {
            v = clean[i].offset().top;
            if (v > current.offset().top) {
                position = v;
                break;
            }
        }
    } else {
        position = clean.length > 0 ? clean[0].offset().top : position;
    }
    $('html, body').animate({scrollTop: position}, "fast");
}

function element_matches(e, t) {
    var matches = [];
    var groups = e.exec(t);
    var match;
    while (groups != null) {
        match = groups[0].toLowerCase();
        var i = matches.indexOf(match); // some freaky shit is going down, duplicates are being added
        if (i > -1) {
            matches.splice(i, 1);
        }
        matches.push(match);
        groups = e.exec(t);
    }
    return matches.join("/");
}

var clean;
function database_changed(response) {
    var filters = JSON.parse(response.responseText).map(
        function (f) {
            return f["expression"];
        }
    );
    var expression = new RegExp("(" + filters.join(")|(") + ")", 'gi');

    clean = [];
    var elements = $(selectors.element);
    elements.each(function () {
        var i, v, l = selectors.contents.length;
        for (i = 0; i < l; i++) {
            v = $(this).find(selectors.contents[i]).text();
            var match = element_matches(expression, v);
            if (match != "") {
                $(this)
                    .addClass("filtered")
                    .removeClass("filter-selected")
                    .attr('filter', match)
                    .attr('title', match)
                    .css("position", "relative");

                $(this).find(".filtered-overlay").remove();
                $(this).append(
                    "<div class='filtered-overlay'> \
                        <a href='http://localhost/filter/database/test.php'>/" + match + "/</a>\
                    </div>"
                );
                return;
            }
        }
        clean.push($(this));
    });

    if (elements.length > 0) {
        elements.dblclick(function () {
            var overlay = $(this).find(".filtered-overlay");
            if (overlay.length > 0) {
                overlay.addClass("hidden");
            } else {
                element_scroll($(this));
            }

        });

        elements.mouseleave(function () {
            $(this).find(".filtered-overlay").removeClass("hidden");
        });
    }

    element_selected = null;
}

function on_updated() {
    database_get();
}

var selectors = element_options();
if (selectors !== undefined) {
    document.body.addEventListener('updated', on_updated, false);
    $(selectors.element).on("contextmenu", element_context);
    database_get();
}