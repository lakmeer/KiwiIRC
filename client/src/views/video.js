/**
 * Created by ghoststreet on 3/24/15.
 */
_kiwi.view.Video = Backbone.View.extend({
    tagName: "div",
    initialize: function (options) {
        //this.model.bind('change', this.render, this);
        this.model.bind('change:stream', this.attachStream, this);
        this.render();
    },
    render: function () {
        var $this = this.$el;

        $this.html('<div class="video"><p class="name"> {{name}} </p><video></video></div>');
        this.video = $this.find('video')[0];

        if (this.model.attributes.isLocal) {
            this.markLocal();
        }

        if (this.model.attributes.type === 'audio') {
            this.showAudioOnly();
        }

        return this;
    },

    markLocal: function () {
        this.video.style.transform = 'scale(-1, 1)';
        this.el.style.border = '2px solid blue';
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
        this.video.src = URL.createObjectURL(model.attributes.stream);
        this.waitUntilReady();
    },

    showAudioOnly: function () {
        this.video.style.opacity = 0;
        this.el.style.background = 'blue';
    }/*,

    showNoSignal: function () {
        this.video.style.opacity = 0;
        this.el.style.background = 'red';
    }*/
});
