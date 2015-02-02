_kiwi.model.MediaList = Backbone.Collection.extend({
    model: _kiwi.model.MediaStream,

    initialize: function (options) {
        this.view = new _kiwi.view.MediaList({ model: this });
    }
});
