//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base");
    var Base = base.Base,
        Hook = base.Hook,
        HookDual = base.HookDual;

    module.exports = {
        PickFuse: PickFuse
    };
}
//</editor-fold>

//<editor-fold desc="pick">
function Pick(name) {
    this.name = name;
    this.picks = null;

    this.load = new HookDual(this.loadIput.bind(this), this.loadOput.bind(this));
    this.dump = new HookDual(this.dumpIput.bind(this), this.dumpOput.bind(this));
}

Pick.prototype = Object.create(Base.prototype);
//<editor-fold desc="load">
Pick.prototype.loadIput = function () {
    this.loadGmon(this.name) || this.loadFile(this.name);
};

Pick.prototype.loadOput = function (data) {
    this.picks = this.read(data);

    return [this.picks];
};

Pick.prototype.read = function (data) {
    throw new Error(["read", "wild", arguments]);
};

Pick.prototype.loadGmon = function (name) {
    if (typeof GM_getValue !== 'undefined') {
        this.load.oput(GM_getResourceText(name));

        return true;
    }
};

Pick.prototype.loadFile = function (name) {
    if (typeof require !== "undefined") {
        this.load.oput(require('fs').readFileSync("./" + name, 'utf8'));

        return true;
    }
};
//</editor-fold>
//<editor-fold desc="dump">
Pick.prototype.code = function (data) {
    throw new Error(["code", "wild", arguments]);
};

Pick.prototype.dumpIput = function (data) {
    data = this.code(data);
    this.dumpGmon(this.name, data) || this.dumpFile(this.name, data);
};

Pick.prototype.dumpOput = function () {
    throw new Error(["dumpOput", "wild", arguments]);
};

Pick.prototype.dumpGmon = function (name, data) {
    if (typeof GM_setValue !== 'undefined') {
        throw new Error(["dumpGmon", "wild", arguments]);
    }
};

Pick.prototype.dumpFile = function (name, data) {
    if (typeof require !== "undefined") {
        throw new Error(["dumpFile", "wild", arguments]);
    }
};
//</editor-fold>
//</editor-fold>

//<editor-fold desc="pick_away">
function PickAway(data) {
    Pick.apply(this, arguments);
}

PickAway.prototype = Object.create(Pick.prototype);

PickAway.prototype.read = function (data) {
    return JSON.parse(data);
};
//</editor-fold>

//<editor-fold desc="pick_here">
function PickHere(data) {
    Pick.apply(this, arguments);
}

PickHere.prototype = Object.create(Pick.prototype);

PickHere.prototype.read = function (data) {
    return $('<div/>')
        .html(data)
        .find(".type")
        .get()
        .reduce(function (picks, pick) {
            picks[pick.getAttribute('title')] = {
                picks: $(pick)
                    .find(".part")
                    .get()
                    .reduce(function (picks, pick) {
                        picks[pick.getAttribute('title')] = pick;
                        return picks;
                    }, {})
            };
            return picks;
        }, {})
};
//</editor-fold>

//<editor-fold desc="pick_fuse">
function PickFuse(here, away) {
    this.picks = {};

    this.here = new PickHere(here);
    this.away = new PickAway(away);

    this.load = new HookDual(this.loadIput.bind(this), this.loadOput.bind(this));

    this.load.iput.then(this.here.load.iput);
    this.load.iput.then(this.away.load.iput);

    this.away.load.oput.then(this.loadOputHere.bind(this));
    this.here.load.oput.then(this.loadOputAway.bind(this));
}

PickFuse.prototype.loadOputCheck = function () {
    if (Object.keys(this.picks).length == 2) {
        this.load.oput(this.picks);
    }
};

PickFuse.prototype.loadOputAway = function (picks) {
    this.picks.away = picks;
    this.loadOputCheck();
};

PickFuse.prototype.loadOputHere = function (picks) {
    this.picks.here = picks;
    this.loadOputCheck();
};

PickFuse.prototype.loadIput = function () {
    this.args = Array.from(arguments);
};

PickFuse.prototype.loadOput = function (picks) {
    teamLull();

    this.args.unshift(picks);

    return this.args;
};
//</editor-fold>
