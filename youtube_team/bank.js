//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base");
    var Base = base.Base,
        HookDual = base.HookDual;

    module.exports = {
        Bank: Bank
    };
}
//</editor-fold>

function Bank(name) {
    this.name = name;

    this.give = new HookDual(this.giveIput.bind(this), this.giveOput.bind(this));
    this.keep = new HookDual(this.keepIput.bind(this), this.keepOput.bind(this));
    this.swap = new HookDual(this.swapIput.bind(this), this.swapOput.bind(this));
}

Bank.prototype = Object.create(Base.prototype);

Bank.prototype.giveIput = function (name) {
    throw new Error(["giveIput", "wild", arguments]);
};

Bank.prototype.giveOput = function () {
    teamLull();

    return arguments
};

Bank.prototype.keepIput = function (name) {
    throw new Error(["keepIput", "wild", arguments]);
};

Bank.prototype.keepOput = function () {
    return arguments
};

Bank.prototype.swapIput = function (name) {
    throw new Error(["swapIput", "wild", arguments]);
};

Bank.prototype.swapOput = function () {
    return arguments
};
