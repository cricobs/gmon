//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base");
    var Base = base.Base,
        HookDual = base.HookDual;

    var FeedMenu = require("./feed_menu").FeedMenu,
        FeedRoot = require("./feed_root").FeedRoot,
        FeedList = require("./feed_list").FeedList,
        FeedTeam = require("./feed_team").FeedTeam,
        FeedKnob = require("./feed_knob").FeedKnob;

    module.exports = {
        Feed: Feed
    };
}
//</editor-fold>

function Feed() {
    this.load = new HookDual(this.loadIput.bind(this), this.loadOput.bind(this));
    this.swap = new HookDual(this.swapIput.bind(this), this.swapOput.bind(this));
    this.edit = new HookDual(this.editIput.bind(this), this.editOput.bind(this));
    this.keep = new HookDual(this.keepIput.bind(this), this.keepOput.bind(this));

    this.root = new FeedRoot();
    this.menu = new FeedMenu();
    this.list = new FeedList();
    this.knob = new FeedKnob();
    this.team = new FeedTeam();

    this.list.swap.iput.then(this.swap.iput);      // swap
    this.swap.oput.then(this.list.swap.oput);      // |
    this.list.swap.oput.then(this.knob.take.iput); // |

    this.knob.edit.iput.then(this.edit.iput);      // edit
    this.edit.oput.then(this.team.take.iput);      // | take load
    this.team.take.oput.then(this.menu.take.oput); // | | edit
    this.menu.take.iput.then(this.team.take.iput); // | | | mint
    this.team.take.iput.then(this.menu.edit.iput); // | show

    this.menu.keep.iput.then(this.keep.iput);      // keep
}

Feed.prototype = Object.create(Base.prototype);

Feed.prototype.keepIput = function () {
    return arguments;
};

Feed.prototype.keepOput = function () {
};

Feed.prototype.editIput = function () {
    return arguments;
};

Feed.prototype.editOput = function () {
    return arguments;
};

Feed.prototype.swapIput = function () {
    return arguments;
};

Feed.prototype.swapOput = function () {
    return arguments;
};

Feed.prototype.loadIput = function (picks) {
    this.root.load(picks);
    this.menu.load(picks);
    this.knob.load(picks);
    this.team.load(picks);
    this.list.load(picks);

    teamLull();
};

Feed.prototype.loadOput = function () {
};
