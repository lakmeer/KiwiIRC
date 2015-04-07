/**
 * Created by ghoststreet on 3/24/15.
 */

var serverURL = location.protocol + '//' + location.hostname;

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


_kiwi.view.VideoCollectionView = Backbone.View.extend({

  el: '',
  initialise: function (options) {
      console.log(options);
      this.model = options.collection;

      this.model.on('add', this.appendNew);
      this.model.on('chenge', function () {
        console.log(this, arguments);
      });
  },

  render: function () {

  },

  appendNew: function () {
    console.log('appending:', this, arguments);
  }
});


// TODO: Remove this
window.KIWI = _kiwi;

_kiwi.model.VideoChat = Backbone.Model.extend({
    initialize: function (options) {
        // set view here
        console.log('model.VideoChat::init');
        console.log(options);

        this.peerVideoMap = {};
        this.remoteVideos = new Backbone.Collection([], { model: _kiwi.model.Video });
        this.view = new _kiwi.view.VideoChat({"model": this});

        var remoteVideosView = new _kiwi.view.VideoCollectionView({ collection: this.remoteVideos });

        // Listen for connection to be ready
        _kiwi.app.connections.on('active', function (panel, connection) {
            this.updateUsername(connection);
            this.room = new P2PRoom(options.channelName, serverURL + ":8081");
            this.room.on('peerConnected', this.peerConnected.bind(this));
            this.room.on('peerDisconnected', this.peerDisconnected.bind(this));
        }, this);
    },

    createRoom: function (serverURL) {
    },

    updateUsername: function (connection) {
        this.username = connection.get('nick');
        // TODO: Whatever is needed
    },

    peerConnected: function (peer) {
        console.debug('NEW PEER!', peer);

        switch (peer.meta.type) {
            case "audio":
            case "video":
                if (this.localVideo) {
                    peer.pc.addStream(this.localVideo.attributes.stream);
                }

                console.log(peer);

                var video = new _kiwi.model.Video({ username: peer.username, type: peer.meta.type, isLocal: false });

                peer.pc.onaddstream = function (event) {
                    console.debug('onaddstream for peer:', peer.username, event.stream.id);
                    video.attachStream(event.stream);
                };

                this.remoteVideos.add(video);
                this.peerVideoMap[peer.id] = video;
                break;

            case "spectator":
                if (this.localVideo) {
                    peer.pc.addStream(this.localVideo.attributes.stream);
                }

                var video = new _kiwi.model.Video({ username: peer.username, type: peer.meta.type, isLocal: false });
                this.remoteVideos.add(video);
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
            this.remoteVideos.remove(video);
            delete this.peerVideoMap[peerId];
        }
        if (this.localVideo) {
            this.localVideo.remove();
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
