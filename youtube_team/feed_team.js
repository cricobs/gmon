//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base"),
        Base = base.Base,
        HookDual = base.HookDual;

    var item = require("./item"),
        TypeFeed = item.TypeFeed;

    module.exports = {
        FeedTeam: FeedTeam
    };
}
//</editor-fold>

function FeedTeam() {
    TypeFeed.call(this, "team");

    this.take = new HookDual(this.takeIput.bind(this), this.takeOput.bind(this));
}

FeedTeam.prototype = Object.create(TypeFeed.prototype);

FeedTeam.prototype.load = function (picks) {
    return TypeFeed.prototype.load.call(this, picks.away);
};

FeedTeam.prototype.team = function (team, mark) {
    this.take.oput(this.items
        .clone()
        .attr("id", "team-feed-" + team)
        .addClass(mark || mark === undefined ? "contains-all-selected-videos" : "")
        .on("click", function () {
            $(this).toggleClass("contains-all-selected-videos");
        })

        .find(".playlist-name")
        .text(team)
        .end());
};

FeedTeam.prototype.teams = function (marks, teams) {
    return teams.map(function (team) {
        return this.team(team, marks.indexOf(team) > -1);
    }, this);
};

FeedTeam.prototype.takeIput = function (feed, x, y, marks, teams) {
    this.teams(marks, teams);

    return arguments;
};

FeedTeam.prototype.takeOput = function () {
    return arguments
};