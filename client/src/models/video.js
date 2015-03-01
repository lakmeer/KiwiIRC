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
