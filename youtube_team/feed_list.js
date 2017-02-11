//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base"),
        Base = base.Base,
        HookDual = base.HookDual;

    var item = require("./item"),
        TypeFeed = item.TypeFeed;

    module.exports = {
        FeedList: FeedList
    };
}
//</editor-fold>

function FeedList() {
    TypeFeed.call(this, "list");

    this.swap = new HookDual(this.swapIput.bind(this), this.swapOput.bind(this));
}

FeedList.prototype = Object.create(TypeFeed.prototype);

Object.defineProperty(FeedList.prototype, "items", {
    get: function () {
        return this._items;
    },
    set: function (items) {
        if (!items) {
            return;
        }
        this._items = items
            .remove()
            .sort(function (a, b) {
                a = $(a).find(".display-name").text().trim();
                b = $(b).find(".display-name").text().trim();

                return (a < b) ? 1 : (a > b) ? -1 : 0;
            });
        //.sort(function (a, b) {
        //    a = +($(a).find(".guide-count-value").text().trim());
        //    b = +($(b).find(".guide-count-value").text().trim());
        //
        //    return (a < b) ? -1 : (a > b) ? 1 : 0;
        //})
    }
});

function tale(team, load, mode) {
    team
        .find(".guide-count-value")
        .text(function () {
            load = +$(this).text() + ((!mode ? 1 : -1) * load);

            return isNaN(load) ? "+" : load || "";
        });
}

FeedList.prototype.swapOput = function (feed, teams) {
    var load = +(feed.find(".guide-count-value").text());
    if (feed.prevAll(".team").length) {
        $("[href='" + feed.find(".guide-item").attr("href") + "']")
            .closest("li")
            .each(function () {
                tale($(this).prevAll(".team").first(), load, true);
            })
            .remove();
    }

    var i, feeds = [];
    for (i = 0; i < teams.length; i++) {
        feed = feed.clone();
        tale(teams[i].after(feed), load);

        feeds.push(feed);
    }

    return [feeds];
};

FeedList.prototype.swapIput = function (feed) {
    feed = $(feed);

    return [feed.find(".guide-item").prop("href"), feed];
};

FeedList.prototype.find = function (find) {
    return this.items
        .find("[href='" + find.replace(/.*(?=\/channel.*$)/, "") + "']")
        .parent()
};

FeedList.prototype.load = function (picks) {
    picks = TypeFeed.prototype.load.call(this, picks.here);

    var i, item;
    for (i = 0; i < this.items.length; i++) {
        item = this.items[i];
        this.swap.iput(item);
    }

    return picks;
};