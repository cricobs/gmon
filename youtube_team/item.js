//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    var base = require("./base");
    var Base = base.Base;

    module.exports = {
        TypeTeam: TypeTeam,
        TypeFeed: TypeFeed,
        NameMenu: NameMenu,
        NameList: NameList,
        NameRoot: NameRoot
    };
}
//</editor-fold>

function Item(name, type) {
    this.items = null;
    this.type = type;
    this.name = name;
}

Item.prototype = Object.create(Base.prototype);

Item.prototype.load = function (picks) {
    this.items = $(picks[this.type].picks[this.name]);
};

//<editor-fold desc="items">
function ItemType(name, type) {
    Item.call(this, name || this.name, type);
}

ItemType.prototype = Object.create(Item.prototype);


function ItemName(name, type) {
    Item.call(this, name, type || this.type);
}

ItemName.prototype = Object.create(Item.prototype);
//</editor-fold>

//<editor-fold desc="types">
function TypeTeam(name) {
    ItemType.call(this, name, "team");
}

TypeTeam.prototype = Object.create(ItemType.prototype);


function TypeFeed(name) {
    ItemType.call(this, name, "feed");
}

TypeFeed.prototype = Object.create(ItemType.prototype);
//</editor-fold>

//<editor-fold desc="names">
function NameRoot() {
    ItemName.call(this, "root");
}

NameRoot.prototype = Object.create(ItemName.prototype);


function NameMenu() {
    ItemName.call(this, "menu");

    $('html').click(this.hide.bind(this));
}

NameMenu.prototype = Object.create(ItemName.prototype);

NameMenu.prototype.hide = function () {
    if (this.items.is(":visible")) {
        this.items
            .data("edit", null)
            .hide();
    }
};


function NameList() {
    ItemName.call(this, "list");
}

NameList.prototype = Object.create(ItemName.prototype);
//</editor-fold>