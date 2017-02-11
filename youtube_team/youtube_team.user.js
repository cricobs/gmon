//<editor-fold desc="greasemonkey">
// ==UserScript==
//
// @name        youtube team
// @description youtube subscriptions manager
// @namespace   manobastardo
// @version     0.0
// @run-at      document-end

// @include     https://www.youtube.com*
//
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
//
// @require     jquery.min.js
//
// @require     base.js
// @require     pick.js
//
// @require     bank.js
// @require     bank_gmon.js
// @require     bank_sql3.js
//
// @require     data.js
// @require     data_auto.js
//
// @require     item.js
//
// @require     team_menu.js
// @require     team_list.js
// @require     team_root.js
// @require     team_edit.js
// @require     team.js
//
// @require     feed_menu.js
// @require     feed_knob.js
// @require     feed_list.js
// @require     feed_root.js
// @require     feed_team.js
// @require     feed.js
//
// @resource    look.css look.css
// @resource    here.html here.html
// @resource    away.json away.json
//
// ==/UserScript==
//</editor-fold>

//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    document = require('jsdom').jsdom('<html/>', {});
    $ = require('jquery')(document.defaultView);
    window = document.defaultView;

    var BankGmon = require("./bank_gmon").BankGmon;
    var BankSql3 = require("./bank_sql3").BankSql3;
    var DataAuto = require("./data_auto").DataAuto;
    var PickFuse = require("./pick").PickFuse;
    var Team = require("./team").Team;
    var Feed = require("./feed").Feed;
}
//</editor-fold>

//<editor-fold desc="info">
var teamTime = new Date().getTime();
teamInfo = function () {
    var mark = (typeof require === "undefined") ? 2 : 3;
    var pile = new Error().stack.split("\n")[mark].trim();

    var infos = {
        func: pile.match("(at|)([^@\(]*)")[2],
        path: pile.match(/(\(|file:\/\/)([^\)]*)/)[2]
    };

    infos.file = infos.path.split("/").slice(-1);
    infos.name = infos.func + "(" + infos.file + ")";

    return infos;
};

teamLull = function () {
    console.warn(new Date().getTime() - teamTime + " " + teamInfo().name);
};

teamEcho = function () {
    console.info([teamInfo().name, arguments.callee.caller.arguments]);
};
//</editor-fold>

if (typeof require === "undefined") {
    GM_addStyle(GM_getResourceText("look.css"));
}

var bank = typeof require === "undefined" ? new BankGmon("data") : new BankSql3("data", "../youtube_team.db");
var data = new DataAuto("other");
var pick = new PickFuse("here.html", "away.json");
var team = new Team();
var feed = new Feed();

bank.give.oput.then(data.load.iput, true);   // load
data.load.iput.then(pick.load.iput);         // |
pick.load.oput.then(team.load.iput);         // |
team.load.iput.then(feed.load.iput);         // |
feed.load.iput.then(team.load.oput);         // |

feed.swap.iput.then(data.findSwap.iput);     // swap
data.findSwap.oput.then(team.findSwap.iput); // | feed
team.findSwap.iput.then(feed.swap.oput);     // | |
team.swap.iput.then(data.swap.iput);         // | team
data.swap.iput.then(bank.swap.iput);         // | |

feed.edit.iput.then(data.findEdit.iput);     // edit
data.findEdit.oput.then(feed.edit.oput);     // |

feed.keep.iput.then(data.keep.iput);         // keep
data.keep.iput.then(bank.keep.iput);         // |
bank.keep.oput.then(data.keep.oput);         // |
data.keep.oput.then(team.findSwap.iput);     // |

team.oust.iput.then(data.oust.iput);         // oust
data.oust.iput.then(team.oust.oput);         // |

bank.give.iput();

// todo
// - remove unsubscribed entries
// - check if click is within bounds on edit team element before closing editor
// - check if multiple teams visible before collapsing all on team click