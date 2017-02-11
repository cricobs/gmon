//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base"),
        Base = base.Base,
        HookDual = base.HookDual;

    var item = require("./item"),
        TypeTeam = item.TypeTeam;

    module.exports = {
        TeamEdit: TeamEdit
    };
}
//</editor-fold>

function TeamEdit() {
    TypeTeam.call(this, "edit");

    this.swap = new HookDual(this.swapIput.bind(this), this.swapOput.bind(this));
}

TeamEdit.prototype = Object.create(TypeTeam.prototype);

TeamEdit.prototype.swapIput = function (swap) {
    this.oput = $(swap)
        .find(".display-name")
        .replaceWith(this.items);

    this.items
        .submit(this.swap.oput)

        .find("#team-oput")
        .val(this.oput.attr("title"))
        .blur(this.swap.oput)
        .focus();
};

TeamEdit.prototype.swapOput = function (event) {
    event.preventDefault();
    event.stopPropagation();

    var used = this.oput
        .attr("title");

    var mint = this.items
        .replaceWith(this.oput)
        .find("#team-oput")
        .val();

    var feeds = this.oput
        .attr("title", mint)
        .text(mint)

        .closest(".team")
        .attr("id", "team-" + mint)
        .end()

        .closest(".team")
        .nextUntil(".team")
        .get()
        .reduce(function (feeds, feed) {
            feeds[$(feed).find(".guide-item").prop("href")] = feed;
            return feeds;
        }, {});

    return [feeds, used, mint];
};

TeamEdit.prototype.load = function (picks) {
    return TypeTeam.prototype.load.call(this, picks.away);
};