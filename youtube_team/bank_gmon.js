//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var Base = require("./base").Base;
    var Bank = require("./bank").Bank;

    module.exports = {
        BankGmon: BankGmon
    };
}
//</editor-fold>

function BankGmon(name) {
    Bank.apply(this, arguments);

    this.give.iput.then(this.give.oput);
    this.keep.iput.then(this.keep.oput);
    this.swap.iput.then(this.swap.oput);
}

BankGmon.prototype = Object.create(Bank.prototype);

BankGmon.prototype.giveIput = function (name) {
    return [GM_getValue(name || this.name, "{}")];
};

BankGmon.prototype.keepIput = function (name, value) {
    GM_setValue(name || this.name, value);

    return arguments;
};

BankGmon.prototype.swapIput = function (name, value) {
    return this.keepIput.apply(this, arguments);
};