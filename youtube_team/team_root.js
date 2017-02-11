//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base"),
        Base = base.Base,
        HookDual = base.HookDual;

    var item = require("./item"),
        TypeTeam = item.TypeTeam;

    module.exports = {
        TeamRoot: TeamRoot
    };
}
//</editor-fold>

function TeamRoot() {
    TypeTeam.call(this, "root");

    this.take = new HookDual(this.takeIput.bind(this), this.takeOput.bind(this));
    this.find = new HookDual(this.findIput.bind(this), this.findOput.bind(this));
    this.view = new HookDual(this.viewIput.bind(this), this.viewOput.bind(this));
}

TeamRoot.prototype = Object.create(TypeTeam.prototype);

TeamRoot.prototype.findIput = function (feed, teams) {
    teams = teams || [];

    var items = teams.map(this.find.oput);
    if (teams.length != items.length) {
        throw new Error(["team not found", teams, items]);
    }

    var args = Array.from(arguments);
    args.splice(args.indexOf(teams), 1, items);

    return args;
};

TeamRoot.prototype.findOput = function (team, once) {
    var teams = this.items.find("#team-" + team);
    if (teams.get().length < 1) {
        if (!once) {
            this.take.oput(team);

            return this.findOput(team, true);

        } else {
            throw new Error("take.oput is not hooked");
        }
    }

    return teams;
};

TeamRoot.prototype.takeIput = function (take) {
    take.prependTo(this.items);
};

TeamRoot.prototype.takeOput = function () {
    return arguments;
};

TeamRoot.prototype.viewIput = function (view) {
    var fold = this.fold();
    if (fold.closest(view).get().length == 0) {
        view.nextUntil(".team").toggle();
    }
};

TeamRoot.prototype.viewOput = function () {
};

TeamRoot.prototype.fold = function () {
    return this.items
        .find(".team +:not(.team):visible")
        .prev()
        .nextUntil(".team")
        .hide()
        .end();
};

TeamRoot.prototype.load = function (picks) {
    return TypeTeam.prototype.load.call(this, picks.here);
};