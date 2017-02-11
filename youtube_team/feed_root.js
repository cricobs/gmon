//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base"),
        Base = base.Base();

    var item = require("./item"),
        TypeFeed = item.TypeFeed;

    module.exports = {
        FeedRoot: FeedRoot
    };
}
//</editor-fold>

function FeedRoot() {
    TypeFeed.call(this, "root");
}

FeedRoot.prototype = Object.create(TypeFeed.prototype);

FeedRoot.prototype.load = function (picks) {
    return TypeFeed.prototype.load.call(this, picks.here);
};