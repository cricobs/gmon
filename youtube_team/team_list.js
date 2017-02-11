//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base"),
        Base = base.Base,
        HookDual = base.HookDual;

    var item = require("./item"),
        TypeTeam = item.TypeTeam;

    module.exports = {
        TeamList: TeamList
    };
}
//</editor-fold>

function TeamList() {
    TypeTeam.call(this, "list");

    this.take = new HookDual(this.takeIput.bind(this), this.takeOput.bind(this));
    this.view = new HookDual(this.viewIput.bind(this), this.viewOput.bind(this));
    this.edit = new HookDual(this.editIput.bind(this), this.editOput.bind(this));
}

TeamList.prototype = Object.create(TypeTeam.prototype);

Object.defineProperty(TeamList.prototype, "items", {
    get: function () {
        return this._items;
    },
    set: function (items) {
        if (items) {
            this._items = items
                .find("> .guide-item")
                .removeClass("guide-item-selected")
                .not(":has(guide-count)")
                .append('\
                <span class="guide-count yt-uix-tooltip yt-valign">\
                    <span class="yt-valign-container guide-count-value"></span>\
                </span>')
                .end();
        }
    }
});

TeamList.prototype.load = function (picks) {
    return TypeTeam.prototype.load.call(this, picks.here);
};

TeamList.prototype.takeIput = function (take) {
    take.map(this.take.oput)
};

TeamList.prototype.takeOput = function (take) {
    return [this.items
        .first()
        .clone()
        .attr("id", "team-" + take)
        .addClass("team")
        .click(function () {
            return false
        })
        .on("mousedown", this.view.iput)

        .find(".thumb")
        .removeClass("guide-watch-later-icon")
        .addClass("guide-my-subscriptions-icon")
        .attr("title", "manage the " + take + " team")
        .on("mousedown", this.edit.iput)
        .end()

        .find(".guide-count-value")
        .text("")
        .end()

        .find('.display-name')
        .text(take)
        .attr("title", take)
        .end()
    ];
};

TeamList.prototype.viewIput = function (event) {
    return [$(event.target).closest(".team")];
};

TeamList.prototype.viewOput = function () {
};

TeamList.prototype.editIput = function (event) {
    event.preventDefault();
    event.stopPropagation();

    return [$(event.target).closest(".guide-item"), event.pageX, event.pageY];
};

TeamList.prototype.editOput = function () {
};