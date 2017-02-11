//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base"),
        Base = base.Base,
        HookDual = base.HookDual;

    var item = require("./item"),
        TypeFeed = item.TypeFeed;

    module.exports = {
        FeedMenu: FeedMenu
    };
}
//</editor-fold>

function FeedMenu() {
    TypeFeed.call(this, "menu");

    this.edit = new HookDual(this.editIput.bind(this), this.editOput.bind(this));
    this.take = new HookDual(this.takeIput.bind(this), this.takeOput.bind(this));
    this.keep = new HookDual(this.keepIput.bind(this), this.keepOput.bind(this));

    $('html').click(this.keep.iput);
}

FeedMenu.prototype = Object.create(TypeFeed.prototype);

Object.defineProperty(FeedMenu.prototype, "items", {
    get: function () {
        return this._items;
    },
    set: function (items) {
        if (!items) {
            return;
        }
        this._items = items
            .clone()
            .appendTo("body")
            .click(function () {
                return false;
            })
            .hide()

            .find("#subscription-create")
            .submit(this.take.iput)
            .end();
    }
});

FeedMenu.prototype.keepIput = function () {
    var teams = this.items
        .find(".contains-all-selected-videos")
        .get()
        .map(function (i) {
            return (i.innerText || i.textContent).trim();
        });

    var feed = this.items
        .data("edit");

    this.items
        .data("edit", null)
        .hide()

        .find("ul")
        .empty();

    return [feed.find(".guide-item").prop("href"), feed, teams];
};

FeedMenu.prototype.keepOput = function () {
};

FeedMenu.prototype.takeIput = function (event) {
    event.preventDefault();
    event.stopPropagation();

    var iput = $(event.target).find("input");
    var teams = [iput.val()];

    iput.val("");

    return [null, null, null, teams, teams];
};

FeedMenu.prototype.takeOput = function (take) {
    this.items.find("ul").prepend(take);
};

FeedMenu.prototype.editIput = function (feed, x, y) {
    if (!this.items.is(":visible")) {
        this.items
            .data("edit", feed)
            .css({top: y, left: x})
            .show()
    }
};

FeedMenu.prototype.editOput = function () {
};

FeedMenu.prototype.load = function (picks) {
    return TypeFeed.prototype.load.call(this, picks.away);
};