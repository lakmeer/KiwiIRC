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
        this.model.bind('change:connectionStatus', this.render, this);
        this.model.remoteVideos.bind('add', this.addRemoteVideo, this);
        this.model.remoteVideos.bind('remove', this.removeRemoteVideo, this);
        this.$el.appendTo('#kiwi .videochat');
        this.render();
    },

    render: function () {
        this.$el.html( _.template( $('#tmpl_videochat').html(), this.model.attributes ));
        this.$localVideo   = this.$el.find('.localVideo');
        this.$remoteVideos = this.$el.find('.remoteVideos');

        if (this.model.localVideo) {
            this.model.localVideo.view.$el.appendTo( this.$localVideo );
        }

        return this;
    },

    addRemoteVideo: function (video) {
        this.$remoteVideos.append(video.view.$el);
    },

    removeRemoteVideo: function (video) {
        console.log('Removing:', video);
        video.view.$el.remove();
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
