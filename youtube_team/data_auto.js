//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var Data = require("./data").Data;

    module.exports = {
        DataAuto: DataAuto
    }
}
//</editor-fold>

function DataAuto(auto) {
    Data.call(this);

    this.auto = auto;
}

DataAuto.prototype = Object.create(Data.prototype);

Object.defineProperty(DataAuto.prototype, "names", {
    get: function () {
        var names = Data.prototype.__lookupGetter__("names").call(this);
        names.teams.unshift(this.auto);

        return names;
    }
});

DataAuto.prototype.findTeams = function (name) {
    var teams = Data.prototype.findTeams.call(this, name);

    if (!name) {
        return teams.filter(function (team) {
            return team != this.auto;
        }, this);
    }

    return !teams || teams.length < 1 ? [this.auto] : teams;
};

DataAuto.prototype.keepTeams = function (name, teams) {
    teams = teams.filter(function (team) {
        return team != this.auto;
    }, this);

    teams = Data.prototype.keepTeams.call(this, name, teams);

    return !teams || teams.length < 1 ? [this.auto] : teams;
};