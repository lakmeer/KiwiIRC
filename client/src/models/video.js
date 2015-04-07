/**
 * Created by ghoststreet on 3/24/15.
 */

_kiwi.model.Video = Backbone.Model.extend({
    initialize: function (options) {
        // set view here
        console.log('model.Video::init');
        this.view = new _kiwi.view.Video({"model": this});
    },

    attachStream: function (stream) {
        this.set('stream', stream);
    },

    remove: function () {
      this.view.remove();
      this.view.unbind();
    }
});


