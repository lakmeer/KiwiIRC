_kiwi.view.VideoPanel = Backbone.View.extend({
    tagName: "div",

    events : {
        "click .vidni-join"     : "join",
        "click .vidni-spectate" : "spectate",
        "click .vidni-leave"    : "leave"
    },

    initialize: function (options) {
        console.log('views.video-panel::init', this.template);

        _.bindAll( this, 'renderFull', 'renderMeta', 'show', 'join', 'spectate', 'leave' );

        this.template = {
          full: _.template($('#tmpl_videopanel'   ).text()),
          meta: _.template($('#tmpl_videochatmeta').text())
        };

        this.renderFull();
        this.renderMeta(this.model);
        this.$el.appendTo('#kiwi .videochats');
    },

    renderFull: function () {
        console.log('views.video-panel::render');
        this.$el.html( this.template.full({}) );
        this.$remote = this.$el.find('.remote');
        this.$meta   = this.$el.find('.meta');
        this.$self   = this.$el.find('.self');
    },

    renderMeta: function () {
        this.$meta.html( this.template.meta(this.model) );
    },


    // Room functions
    join: function () {
      console.log('view.video-panel::join');
      this.model.join();
    },

    spectate: function () {
      this.model.spectate();
    },

    leave: function () {
      this.model.leave();
    },

    show: function () {
        $('#kiwi .memberlists').children().removeClass('active');
        $(this.el).addClass('active');
        this.renderMeta();
    }

});
