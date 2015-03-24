/**
 * Created by ghoststreet on 3/24/15.
 */

var serverURL = location.protocol + '//' + location.hostname;
var username  = location.hash ? location.hash.replace('#', '') : 'Anon';

// Helpers
var log = function () {
    console.log.apply(console, arguments);
};

var reportError = function (error) {
    console.error('Error:', error);
};

var id = function () {
    return arguments[0];
};

_kiwi.model.VideoChat = Backbone.Model.extend({
    initialize: function (options) {
        // set view here
        console.log('model.VideoChat::init');
        console.log(options);

        this.peerVideoMap = {};
        this.remoteVideos = new Backbone.Collection([], { model: _kiwi.model.Video });
        this.view = new _kiwi.view.VideoChat({"model": this});

        this.room = new P2PRoom(options.channelName, serverURL + ":8081");
        this.room.on('peerConnected', this.peerConnected);
        this.room.on('peerDisconnected', this.peerDisconnected);
    },

    peerConnected: function (peer) {
        console.debug('NEW PEER!', peer);

        switch (peer.meta.type) {
            case "audio":
            case "video":
                if (this.localVideo) {
                    peer.pc.addStream(this.localVideo.stream);
                }

                var video = new Video(peer.username);
                peer.pc.onaddstream = function (event) {
                    console.debug('onaddstream for peer:', peer.username, event.stream.id);
                    video.attachStream(event.stream);
                };

                video.appendTo(remoteContainer);
                this.peerVideoMap[peer.id] = video;

                if (peer.meta.type === 'audio') {
                    video.showAudioOnly();
                }

                break;

            case "spectator":
                if (this.localVideo) {
                    peer.pc.addStream(this.localVideo.stream);
                }

                var video = new Video(peer.username);
                video.showNoSignal();
                video.appendTo(remoteContainer);
                this.peerVideoMap[peer.id] = video;

                break;

            default:
                console.error('Unknown peer type:', peer.meta.type);

        }

    },

    peerDisconnected: function (peer) {
        console.debug('PEER LOST', peer);
        var video = this.peerVideoMap[peer.id];
        if (!video) { return; }
        delete this.peerVideoMap[peer.id];
        remoteContainer.removeChild(video.dom.main);
    },


    //
    // Listeners
    //

    spectate: function () {
        log('models::VideoChat::spectate');
        this.room.join(this.username, { type: 'spectator' });
    },

    joinVideo: function () {
        this.createLocalVideo('mi');

        console.log(this.localVideo, this.attributes);

        log('models::VideoChat::joinVideo');
        navigator.webkitGetUserMedia({ video: true, audio: false }, this.onUserMedia('video'), reportError);
    },

    joinAudio: function () {
        log('models::VideoChat::joinAudio');
        this.createLocalVideo('mi', 'audio');

        navigator.webkitGetUserMedia({ video: false, audio: true }, this.onUserMedia('audio'), reportError);
    },

    leave: function () {
        log('models::VideoChat::leave');
        for (var peerId in this.peerVideoMap) {
            var video = this.peerVideoMap[peerId];
            remoteContainer.removeChild(video.dom.main);
            delete this.peerVideoMap[peerId];
        }
        if (this.localVideo) {
            this.localVideo.dom.main.parentNode.removeChild(this.localVideo.dom.main);
        }
        this.localVideo = undefined;
        this.room.leave();
    },

    onUserMedia: function (type) {
        return (function (stream) {
            console.log('onUserMedia: ', stream);
            this.localVideo.attachStream(stream);
            log('Attempting to join room, type: ', type);
            this.room.join(this.username, { type: type });
        }).bind(this);
    },

    createLocalVideo: function (username, type) {
        this.localVideo = new _kiwi.model.Video({ username: username, type: type || 'video', isLocal: true });
        this.set('localVideo', this.localVideo);
    }
});