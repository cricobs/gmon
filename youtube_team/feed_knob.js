//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base"),
        Base = base.Base,
        HookDual = base.HookDual;

    var item = require("./item"),
        TypeFeed = item.TypeFeed;

    module.exports = {
        FeedKnob: FeedKnob
    };
}
//</editor-fold>

function FeedKnob() {
    TypeFeed.call(this, "knob");

    this.take = new HookDual(this.takeIput.bind(this), this.takeOput.bind(this));
    this.edit = new HookDual(this.editIput.bind(this), this.editOput.bind(this));
}

FeedKnob.prototype = Object.create(TypeFeed.prototype);

FeedKnob.prototype.load = function (picks) {
    return TypeFeed.prototype.load.call(this, picks.here);
};

FeedKnob.prototype.takeIput = function (feeds) {
    if (!feeds) {
        return;
    }
    
    var i, feed;
    for (i = 0; i < feeds.length; i++) {
        feed = feeds[i];
        feed
            .find(" > a > .yt-valign-container")
            .prepend(this.items.clone())
            .end()

            .find("button")
            .on("click", this.edit.iput)
            .end();
    }
};

FeedKnob.prototype.takeOput = function () {
};

FeedKnob.prototype.editIput = function (event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("editIput", arguments);

    var edit = $(event.target).closest("li");

    return [edit.find(".guide-item").prop("href"), edit, event.pageX, event.pageY];
};

FeedKnob.prototype.editOput = function () {
};