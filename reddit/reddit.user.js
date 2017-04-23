// ==UserScript==
// @name        reddit
// @namespace   manobastardo
// @include     https://www.reddit.com/*
// @version     1.0.2
// @grant       none
// @description reddit upvote post on hover|remove matching text from post|hide all posts on next page clicked
// ==/UserScript==
var elements = $(".entry");

elements.find("a.title").each(
    function () {
        $(this).text(
            function () {
                return $(this).text().replace(/\b(til|lpt|(\s+|)today(\s+|)i(\s+|)learned)(\s+|)([^a-zA-Z0-9]|)(\s+|)(that|of|about|)\b/ig, '');
            }
        )
    }
);

elements.parent().hover(
    function () {
        var time_value = $(this).find(".live-timestamp").attr("datetime");
        var time_regex = /(\d{4})-(\d{2})-(\d{2}).(\d{2}):(\d{2}):(\d{2})/;
        var [, year, month, day, hour, min, sec] = time_regex.exec(time_value);
        var date_old = new Date(year, month - 1, day, hour, min, sec);
        date_old.setHours(0, 0, 0, 0);

        var date_new = new Date();
        date_new.setMonth(date_new.getMonth() - 6);
        date_new.setHours(0, 0, 0, 0);

        if (date_old > date_new) {
            $(this).find(".arrow.up").click();
        }
    }
);

function hidden() {
    if (elements.find(".hide-button.state-button span a[action='hide']").length) {
        return setTimeout(hidden, 1000);
    }
    $(".next a")[0].click();
}

$(".next a").click(
    function (e) {
        $(this).text("loading");
        e.preventDefault();
        console.log("hide");
        return false;
        //
        //var visible = elements.find(".hide-button a");
        //console.log(visible);
        //
        //if (visible.length) {
        //    e.preventDefault();
        //    console.log($(this)[0]);
        //    visible.each(function () {
        //        $(this)[0].click();
        //    });
        //    hidden();
        //    return false;
        //}
    });

var commentCount = $("a.comments").text().match(/\d+/);
commentCount = commentCount ? +commentCount[0] : 0;

if (commentCount > 200) {
    $('<a id="show-all" class="pretty-button" style="cursor: pointer;">show all</a>').insertAfter($("div.panestack-title span.title"));
    $("#show-all").click(function () {
        $(this).text("loading");
        var check_more = setInterval(function () {
            var more = $(".morecomments");
            if (more.length > 0) {
                more.each(function () {
                    $("#show-all").text("loading " + $(this).text().match(/\d+/));
                    $(this).find("a").click();
                });
            } else {
                $("#show-all").text("all shown");
                $("html, body").animate({scrollTop: $(document).height()}, 1000);
                clearInterval(check_more);
            }
        }, 1111);
    });
}

// prevent click
$(".thing a").click(function (e) {
    e.preventDefault();
    return false;
});

// add custom last_versions
function html_link(name, href) {
    return '<li>\
        <a href="' + href + '" class="choice">' + name + '</a>\
    </li>';
}

function html_links(links) {
    var i, r = [];
    for (i in links) {
        r.push(html_link(i, links[i]));
    }

    return r.join("");
}

function html_menu(links) {
    return '<ul class="flat-list sr-bar hover custom">' + html_links(links) + '</ul>'
}

var menu_links = {
    "last": "/new",
    "busy": "/",
    "open": "/controversial",
    "lift": "/rising",
    "head": "/top"
};

$(".sr-list")
    .append(html_menu(menu_links))
    .find(".flat-list:not(.custom)").remove();


$(".thing").each(function () {
    var list = $(this).find('ul.flat-list');

    var comments = $(this).find(".comments").attr("href");
    list.prepend('<li class="link-comments comments-button">\
        <a title="' + comments + '" href="' + comments + '">c</a>\
    </li>');

    var source = $(this).find("A.title").attr("href");
    if (!comments.endsWith(source)) {
        list.prepend('<li class="link-source source-button">\
            <a title="' + source + '" href="' + source + '">s</a>\
        </li>');
    }

});

$(".selected.title").text("threads");
$(".nextprev").contents()[0].remove();