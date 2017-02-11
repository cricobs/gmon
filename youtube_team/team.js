//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base");
    var Base = base.Base,
        HookDual = base.HookDual;

    var TeamMenu = require("./team_menu").TeamMenu,
        TeamRoot = require("./team_root").TeamRoot,
        TeamList = require("./team_list").TeamList,
        TeamEdit = require("./team_edit").TeamEdit;

    module.exports = {
        Team: Team
    };
}
//</editor-fold>

function Team() {
    this.load = new HookDual(this.loadIput.bind(this), this.loadOput.bind(this));
    this.swap = new HookDual(this.swapIput.bind(this), this.swapOput.bind(this));
    this.oust = new HookDual(this.oustIput.bind(this), this.oustOput.bind(this));
    this.findSwap = new HookDual(this.findSwapIput.bind(this), this.findSwapOput.bind(this));

    this.root = new TeamRoot();
    this.menu = new TeamMenu();
    this.list = new TeamList();
    this.edit = new TeamEdit();

    this.findSwap.iput.then(this.root.find.iput);  // find

    this.list.take.oput.then(this.root.take.iput); // take
    this.root.take.oput.then(this.list.take.oput); // | mint

    this.list.edit.iput.then(this.menu.edit.iput); // swap
    this.menu.swap.oput.then(this.edit.swap.iput); // |
    this.edit.swap.oput.then(this.swap.iput);      // |

    this.menu.oust.iput.then(this.oust.iput);      // oust
    this.oust.oput.then(this.menu.oust.oput);      // |

    this.list.view.iput.then(this.root.view.iput); // view
}

Team.prototype = Object.create(Base.prototype);

Team.prototype.swapIput = function () {
    return arguments;
};

Team.prototype.swapOput = function () {
};

Team.prototype.oustIput = function () {
    return arguments;
};

Team.prototype.oustOput = function () {
    return arguments;
};

Team.prototype.findSwapIput = function () {
    return arguments;
};

Team.prototype.findSwapOput = function () {
};

Team.prototype.loadIput = function (picks, names) {
    this.root.load(picks);
    this.menu.load(picks);
    this.list.load(picks);
    this.edit.load(picks);

    this.list.take.iput(names.teams);

    teamLull();

    return arguments
};

Team.prototype.loadOput = function () {
    this.root.fold();
};