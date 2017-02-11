// ==UserScript==
// @name        random
// @namespace   manobastardo
// @include     http://www.primewire.ag/watch-5163-Its-Always-Sunny-in-Philadelphia-online-free
// @include     http://www.primewire.ag/watch-11149-Tosh0-online-free
// @version     1
// @grant       GM_openInTab
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// ==/UserScript==

function randAmid(head, tail) {
    return Math.round(Math.random() * (tail - head) + head);
}

var NAME = ".tv_episode_item";

var skip_texts = ["e0"];
var skip_hrefs = JSON.parse(GM_getValue("skip_href", "[]"));

function openRand() {
    var items = $(NAME).get();
    var item, text, href, rand;
    while (true) {
        rand = randAmid(0, items.length - 1);
        item = $(items[rand]).find("a");
        text = item.clone().children().remove().end().text().trim().toLowerCase();
        href = item.attr("href");
        if ((skip_hrefs.indexOf(href) > -1) || (skip_texts.indexOf(text) > -1)) {
            items.splice(rand, 1);
            if (items.length <= 0) {
                skip_hrefs = [];
                items = $(NAME).get();
            }
        } else {
            skip_hrefs.push(href);
            GM_setValue("skip_href", JSON.stringify(skip_hrefs));
            GM_openInTab(href);
            break;
        }
    }
}

var input_rand = $('<input/>').attr({
    type: "button",
    id: "open-rand",
    value: 'random',
    style: "width: 100%;"
});

input_rand.click(openRand);
$("body").prepend(input_rand);

openRand();