_kiwi.view.MediaList = Backbone.View.extend({
    tagName: "div",
    events: {
        "click .nick": "nickClick",
        "click .channel_info": "channelInfoClick"
    },

    initialize: function (options) {
        this.model.bind('all', this.render, this);
        this.model.userState = 'disconnected';
        this.$el.appendTo('#kiwi .medialist');

        console.log('views.medialist::init');
        // Holds meta data. User counts, etc
        this.$meta = $('<div class="meta"></div>').appendTo(this.$el);
        this.renderMetaDisconnected();

        // The list for holding the videos
        this.$list = $('<ul></ul>').appendTo(this.$el);
    },

    render: function () {
        var that = this;
        console.log('views.medialist::render');

        this.$list.empty();
        this.model.forEach(function (member) {
            member.view.$el.data('member', member);
            that.$list.append(member.view.$el);
        });

        // User count
        if(this.model.channel.isActive()) {
            this.renderMeta();
        }

        return this;
    },

    renderMetaDisconnected: function () {
      this.$meta.html(
        '<p class="title"> Video Chat</p>' +
        '<div class="status no-rx-no-tx"> Disconnected </div>' +
        '<div class="status currently"> ?? video users, ?? audio users </div>' +
        '<div class="video-tools">' +
          '<button><i class="fa fa-eye media_spectate" title="Spectate"></i> Spectate</button>' +
          '<button><i class="fa fa-video-camera media_join" title="Join"></i> Join</button>' +
        '</div>');
    },

    renderMetaSpectating: function () {
      this.$meta.html(
        '<p class="title"> Video Chat</p>' +
        '<div class="status rx-no-tx"> Spectating </div>' +
        '<div class="status currently"> ?? video users, ?? audio users </div>' +
        '<div class="video-tools">' +
          '<button><i class="fa fa-video-camera media_join" title="Join"></i> Join</button>' +
          '<button><i class="fa fa-close media_stop" title="Stop"></i> Stop</button>' +
        '</div>');
    },

    renderMetaTransmitting: function () {
      this.$meta.html(
        '<p class="title"> Video Chat</p>' +
        '<div class="status rx-tx"> Transmitting </div>' +
        '<div class="status currently"> ?? video users, ?? audio users </div>' +
        '<div class="video-tools">' +
          '<button><i class="fa fa-eye media_spectate" title="Spectate"></i> Spectate</button>' +
          '<button><i class="fa fa-close media_stop" title="Stop"></i> Stop</button>' +
        '</div>');
    },

    show: function () {
        $('#kiwi .memberlists').children().removeClass('active');
        $(this.el).addClass('active');
        this.renderMeta();
    }
});
