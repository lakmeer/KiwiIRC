_kiwi.view.MediaList = Backbone.View.extend({
    tagName: "div",
    events: {
        "click .vidni-join": "joinVideoRoom",
        //"click .vidni-spectate": "spectateRoom",
        "click .vidni-stop": "closeVideoRoom"
    },

    closeVideoRoom: function (event) {
      this.ice.close();
      this.model.userState = 'disconnected';
    },

    joinVideoRoom: function (event) {
      this.ice.connect('lojban');
      this.model.userState = 'transmitting';
    },

    spectateRoom: function (event) {
      this.ice.connect('lojban', { stream: false });
      this.model.userState = 'spectating';
    },

    initialize: function (options) {
        this.model.bind('all', this.render, this);
        this.model.userState = 'disconnected';
        this.model.numClients = 0;
        this.$el.appendTo('#kiwi .medialist');

        THIS = this;

        console.log('views.medialist::init');

        // Holds meta data. User counts, etc
        this.$meta = $('<div class="meta"></div>').appendTo(this.$el);
        this.renderMetaDisconnected(this.model);

        $remoteVideos = $('<div class="videos">').appendTo(this.$el);

        // Icecomm test code
        console.log('Polyfill navigator.getUserMedia');

        if (navigator.webkitGetUserMedia) {
          navigator.getUserMedia = navigator.webkitGetUserMedia;
        }

        var a = 'FQAG1hVoJOGT2fK2CPlgTYmm4GSCOR80ELErfB57RY520Gl0';

        this.ice = new Icecomm(a, { debug: true });

        this.ice.on('local', function (opts) {
          console.log('on local:', THIS, opts)
          $remoteVideos.append(opts.video);
          opts.video.className = "local";
          THIS.renderMetaTransmitting(THIS.model);
        });

        this.ice.on('connected', function (opts) {
          console.log('on connected:', THIS, opts)
          $remoteVideos.append(opts.video);
          THIS.model.numClients = THIS.ice.getRoomSize();
          THIS.renderMetaTransmitting(THIS.model);
        });

        this.ice.on('disconnect', function (opts) {
          console.log('on disconnected:', THIS, opts)
          $remoteVideos.find('#' + opts.callerID).remove();
          THIS.model.numClients -= 1;
          THIS.renderMetaDisconnected(THIS.model);
        });

        // END icecomm test code

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

        switch (this.model.userState) {
          case "disconnected":
            this.renderMetaDisconnected(this.model);
            break;
          case "transmitting":
            this.renderMetaTransmitting(this.model);
            break;
          case "spectating":
            this.renderMetaSpectating(this.model);
            break;
          default:
            // nothing
        }

        // User count
        if (this.model.channel.isActive()) {
            this.renderMeta();
        }

        return this;
    },

    renderMetaDisconnected: function (model) {
      this.$meta.html(
        '<p class="title"> Video Chat</p>' +
        '<div class="status no-rx-no-tx"> Disconnected </div>' +
        '<div class="status currently">' + model.numClients + ' video users </div>' +
        '<div class="video-tools">' +
          '<button class="vidni-spectate disabled"><i class="fa fa-eye media_spectate" title="Spectate"></i> Spectate</button>' +
          '<button class="vidni-join"><i class="fa fa-video-camera media_join" title="Join"></i> Join</button>' +
        '</div>');
    },

    renderMetaSpectating: function (model) {
      this.$meta.html(
        '<p class="title"> Video Chat</p>' +
        '<div class="status rx-no-tx"> Spectating </div>' +
        '<div class="status currently">' + model.numClients + ' video users </div>' +
        '<div class="video-tools">' +
          '<button class="vidni-join"><i class="fa fa-video-camera media_join" title="Join"></i> Join</button>' +
          '<button class="vidni-stop"><i class="fa fa-close media_stop" title="Stop"></i> Stop</button>' +
        '</div>');
    },

    renderMetaTransmitting: function (model) {
      this.$meta.html(
        '<p class="title"> Video Chat</p>' +
        '<div class="status rx-tx"> Transmitting </div>' +
        '<div class="status currently">' + model.numClients + ' video users </div>' +
        '<div class="video-tools">' +
          '<button class="vidni-spectate disabled"><i class="fa fa-eye media_spectate" title="Spectate"></i> Spectate</button>' +
          '<button class="vidni-stop"><i class="fa fa-close media_stop" title="Stop"></i> Stop</button>' +
        '</div>');
    },

    show: function () {
        $('#kiwi .memberlists').children().removeClass('active');
        $(this.el).addClass('active');
        this.renderMeta();
    }
});
