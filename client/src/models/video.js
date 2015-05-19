<<<<<<< HEAD
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


=======
_kiwi.model.Video = Backbone.Model.extend({

  volume: 1,

  initialize: function (info, stream) {
    console.log('model.video::new');
    this.username = info.username || "anon";
    this.id = info.id;
    this.view = new _kiwi.view.Video({ model: this });

    if (stream) {
      this.addStream(stream);
    }
  },

  addStream: function (stream) {
    this.stream = stream;
    this.view.video.src = URL.createObjectURL(stream);
    this.playWhenReady();
  },

  renderIn: function ($host) {
    this.view.render($host);
  },

  reverseOutput: function () {
    this.view.reverseOutput();
  },

  playWhenReady: function () {
    // TODO: Fully implement when necessary
    this.view.video.play();
  }

});
>>>>>>> 9374f7666b95f7a9073f43985d1f429deea7ae55
