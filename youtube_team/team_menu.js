//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base"),
        Base = base.Base,
        HookDual = base.HookDual;

    var item = require("./item"),
        TypeTeam = item.TypeTeam;

    module.exports = {
        TeamMenu: TeamMenu
    };
}
//</editor-fold>

function TeamMenu() {
    TypeTeam.call(this, "menu");

    this.edit = new HookDual(this.editIput.bind(this), this.editOput.bind(this));
    this.swap = new HookDual(this.swapIput.bind(this), this.swapOput.bind(this));
    this.oust = new HookDual(this.oustIput.bind(this), this.oustOput.bind(this));

    $('html').click(this.hide.bind(this));
}

TeamMenu.prototype = Object.create(TypeTeam.prototype);

Object.defineProperty(TeamMenu.prototype, "items", {
    get: function () {
        return this._items;
    },
    set: function (items) {
        if (items) {
            this._items = items
                .first()
                .clone()
                .addClass("team-menu")
                .appendTo("body")

                .find(".yt-uix-button-icon-checkbox")
                .remove()
                .end()

                .find("li")
                .first()
                .click(this.swap.iput)
                .find("span")
                .text("rename")
                .end()
                .end()

                .next()
                .click(this.oust.iput)
                .find("span")
                .text("remove")
                .end()

                .nextAll()
                .remove()
                .end()
                .end()

                .end();
        }
    }
});

TeamMenu.prototype.editIput = function (edit, x, y) {
    this.items
        .data("edit", edit)
        .css({top: y, left: x})
        .show();
};

TeamMenu.prototype.editOput = function () {
};

TeamMenu.prototype.load = function (picks) {
    return TypeTeam.prototype.load.call(this, picks.here);
};

TeamMenu.prototype.swapIput = function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.swap.oput(this.items.data("edit"));

    this.hide();
};

TeamMenu.prototype.swapOput = function (swap) {
    return [swap];
};

TeamMenu.prototype.oustIput = function (event) {
    event.preventDefault();
    event.stopPropagation();

    var team = this.items.data("edit");
    var name = team.find(".display-name").attr("title");
    var feeds = team.nextUntil(".team").get().reduce(function (feeds, feed) {
        feeds[$(feed).find(".guide-item").prop("href")] = feed;
        return feeds;
    }, {});

    return [feeds, name, team];
};

TeamMenu.prototype.oustOput = function (feeds, name, team) {
    this.hide();
    team.remove();
};

TeamMenu.prototype.hide = function () {
    if (this.items.is(":visible")) {
        this.items
            .data("edit", null)
            .hide();
    }
};
