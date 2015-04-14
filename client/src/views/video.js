/**
 * Created by ghoststreet on 3/24/15.
 */
_kiwi.view.Video = Backbone.View.extend({

    className: 'video',

    initialize: function (options) {
        //this.model.bind('change', this.render, this);
        this.model.bind('change:stream', this.attachStream, this);
        this.render();
    },

    render: function () {
        var $this = this.$el;

        if (this.streamAttached) { return; }

        var tmpl = $('#tmpl_video').html();
        this.$el.html(_.template(tmpl, this.model.attributes));
        this.video = $this.find('video')[0];

        if (this.model.attributes.isLocal) {
            this.markLocal();
        }

        if (this.model.attributes.type === 'audio') {
            this.showAudioOnly();
        }

        if (this.model.attributes.type === 'spectator') {
            this.showSpectator();
        }

        return this;
    },

    markLocal: function () {
        this.$el.addClass('local');
    },

    waitUntilReady: function () {
        var videoElement = this.video;
        function waitUntilReady () {
            if (!(videoElement.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA)) {
                videoElement.play();
            } else {
                setTimeout(waitUntilReady, 50);
            }
        }
        waitUntilReady();
    },

    attachStream: function (model) {
        this.streamAttached = true;
        this.video.src = URL.createObjectURL(model.attributes.stream);
        this.waitUntilReady();
    },

    showAudioOnly: function () {
        this.$el.addClass('audio-only');
    },

    showSpectator: function () {
        this.$el.addClass('spectator');
    }
});
