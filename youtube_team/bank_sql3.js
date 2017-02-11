//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base");
    var Base = base.Base,
        HookDual = base.HookDual;

    var Bank = require("./bank").Bank;

    module.exports = {
        BankSql3: BankSql3
    };
}
//</editor-fold>

function BankSql3(name, file) {
    Bank.apply(this, arguments);

    this.sql3 = require("sqlite3").verbose();
    this.base = new this.sql3.Database(file);

    this.team = new HookDual(this.teamIput.bind(this), this.teamOput.bind(this));
    this.item = new HookDual(this.itemIput.bind(this), this.itemOput.bind(this));
}

BankSql3.prototype = Object.create(Bank.prototype);
//<editor-fold desc="task">
BankSql3.prototype.task = function (task, iput) {
    var args = Array.from(arguments).splice(2, arguments.length);
    var bank = this;
    this.base.serialize(
        function () {
            bank.base.each(
                task,
                function (error, row) {
                    iput.apply(bank, [row].concat(args));
                }
            )
        }
    );
};

BankSql3.prototype.taskRecord = function (iput, name) {
    this.task.call(this, "SELECT * FROM " + this._team, iput, name);
};

BankSql3.prototype.taskTeam = function (iput) {
    this.task.call(this, "select name from sqlite_master where type='table'", iput)
};
//</editor-fold>

BankSql3.prototype.teamIput = function () {
    this.taskTeam(this.team.oput);
};

BankSql3.prototype.teamOput = function (row) {
    this._team = row.name;
};

BankSql3.prototype.itemIput = function (name) {
    this.taskRecord(this.item.oput, name)
};

BankSql3.prototype.itemOput = function (row, name) {
    if (row.name == name) {
        this.give.oput(JSON.parse(row.value));
    }
};

BankSql3.prototype.giveIput = function (name) {
    if (!this._team) { // set it, then recall
        this.team.oput.then((function (bank, name) {
            return function () {
                bank.giveIput(name);
            }
        })(this, name || this.name), true);

        return this.team.iput();
    }
    this.item.iput(name || this.name)
};
