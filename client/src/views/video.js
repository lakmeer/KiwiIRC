_kiwi.view.Video = Backbone.View.extend({

  tagName: "div",

  events: {
  },

  initialize: function () {
    console.log('views.video-chat::new');
    this.template = _.template( $('#tmpl_videochat').text() );
    this.$el.html( this.template(this.model) );
    this.video = this.$el.find('video')[0];
    this.bindVolume();
    this.setVolume(this.model.volume);
  },

  render: function ($host) {
    console.log('views.video-chat::render');
    this.$el.appendTo($host);
  },

  reverseOutput: function () {
    this.video.style.transform = 'scale(-1, 1)';
  },

  bindVolume: function () {
    this.$outer = this.$el.find('.volume-control-container');
    this.$inner = this.$el.find('.volume-control-value');

    var onChange = changeValue.bind(this);

    function engage () {
      $(document).on('mousemove', onChange);
    };

    function disengage () {
      $(document).off('mousemove', onChange);
    };

    function changeValue (event) {
      var max = this.$outer.height(),
          y   = event.pageY - this.$outer.offset().top,
          val = 1 - (y / max);
      this.setVolume(val);
    }

    this.$outer.on('mousedown', engage.bind(this));
    $(document).on('mouseup', disengage.bind(this));
  },

  setVolume: function (vol) {
    var vol = vol > 1 ? 1 : vol < 0 ? 0 : vol;
    this.$inner.height(Math.round(vol * this.$outer.height()));
    this.model.volume = vol;
  }
});
