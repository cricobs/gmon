//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base");
    var Base = base.Base,
        HookDual = base.HookDual;

    module.exports = {
        Data: Data
    };
}
//</editor-fold>

function Data() {
    this.feeds = null;

    this.load = new HookDual(this.loadIput.bind(this), this.loadOput.bind(this));
    this.keep = new HookDual(this.keepIput.bind(this), this.keepOput.bind(this));
    this.oust = new HookDual(this.oustIput.bind(this), this.oustOput.bind(this));
    this.swap = new HookDual(this.swapIput.bind(this), this.swapOput.bind(this));

    this.findSwap = new HookDual(this.findSwapIput.bind(this), this.findSwapOput.bind(this));
    this.findEdit = new HookDual(this.findEditIput.bind(this), this.findEditOput.bind(this));

    this.findEdit.iput.then(this.findEdit.oput);
    this.findSwap.iput.then(this.findSwap.oput);
}
//<editor-fold desc="make">
Data.prototype = Object.create(Base.prototype);

Object.defineProperties(Data.prototype, {
    teams: {
        get: function () {
            var feed_teams, teams = {};
            for (var feed in this.feeds) {
                if (this.feeds.hasOwnProperty(feed)) {
                    feed_teams = this.feeds[feed];
                    var i, team;
                    for (i = 0; i < feed_teams.length; i++) {
                        team = feed_teams[i];
                        if (!(team in teams)) {
                            teams[team] = [feed];
                        } else {
                            teams[team].push(feed);
                        }
                    }
                }
            }

            return teams;
        }
    },
    names: {
        get: function () {
            return {
                teams: Object.keys(this.teams).sort().reverse(),
                feeds: Object.keys(this.feeds)
            }
        }
    }
});
//</editor-fold>
//<editor-fold desc="bank">
Data.prototype.swapIput = function (feeds, used, mint) {
    var teams;
    for (var name in feeds) {
        if (feeds.hasOwnProperty(name)) {
            teams = this.feeds[name];
            teams.splice(teams.indexOf(used), 1, mint);
        }
    }

    var args = Array.from(arguments);
    args.splice(0, 3, null, JSON.stringify(this.feeds));

    return args;
};

Data.prototype.swapOput = function () {
};

Data.prototype.oustIput = function (feeds, oust) {
    var feed, teams;
    for (var name in feeds) {
        if (feeds.hasOwnProperty(name)) {
            feed = feeds[name];
            teams = this.feeds[name].filter(function (team) {
                return team != oust;
            });

            this.keep.iput(name, $(feed), teams);
        }
    }

    return arguments;
};

Data.prototype.oustOput = function () {
};

Data.prototype.loadIput = function (feeds) {
    this.feeds = JSON.parse(feeds);

    teamLull();

    return [this.names];
};

Data.prototype.loadOput = function () {
};

Data.prototype.keepTeams = function (name, teams) {
    this.feeds[name] = teams || [];

    return this.feeds[name];
};

Data.prototype.keepIput = function (name, feed, teams) {
    teams = this.keepTeams(name, teams);
    var args = Array.from(arguments);
    args.splice(0, 3, null, JSON.stringify(this.feeds), feed, teams);

    return args;
};

Data.prototype.keepOput = function () {
    return Array.from(arguments).splice(2, arguments.length);
};
//</editor-fold>
//<editor-fold desc="find">
Data.prototype.findTeams = function (name) {
    if (!name) {
        return this.names.teams;
    }
    return this.feeds[name];
};

Data.prototype.findSwapIput = function (name) {
    var teams = this.findTeams(name);
    if (!teams) {
        console.warn("findSwapTeamsIput", name, teams);

        return;
    }

    var args = Array.from(arguments);
    args.shift();
    args.push(teams);

    return args;
};

Data.prototype.findSwapOput = function () {
    return arguments;
};

Data.prototype.findEditIput = function (name) {
    var args = Array.from(arguments);
    args.shift();
    args.push(this.findTeams(name), this.findTeams());

    return args;
};

Data.prototype.findEditOput = function () {
    return arguments;
};
//</editor-fold>