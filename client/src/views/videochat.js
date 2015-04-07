/**
 * Created by ghoststreet on 3/24/15.
 */

_kiwi.view.VideoChat = Backbone.View.extend({
    tagName: "div",
    events: {
        "click [data-action='join-video']": "joinVideo",
        "click [data-action='join-audio']": "joinAudio",
        "click [data-action='spectate']": "spectate",
        "click [data-action='leave']": "leave"
    },
    initialize: function (options) {
        this.model.bind('change:localVideo', this.render, this);
        this.$el.appendTo('#kiwi .videochat');
        this.render();
    },
    render: function () {
        var $this = this.$el;
        $this.html('<div class="controls"><button data-action="join-video"> Join with Video </button><button data-action="join-audio"> Join with Audio </button><button data-action="spectate"> Spectate </button><button data-action="leave"> Leave </button></div>');
        if (this.model.localVideo) {
            this.model.localVideo.view.$el.appendTo( this.$el );
        }

        return this;
    },

    joinVideo: function () {
        this.model.joinVideo();
    },
    joinAudio: function () {
        this.model.joinAudio();
    },
    spectate: function () {
        this.model.spectate();
    },
    leave: function () {
        this.model.leave();
    }
});
