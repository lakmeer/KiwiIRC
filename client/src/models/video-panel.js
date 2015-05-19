
// Shim getUserMedia

var getUserMedia = window.getUserMedia       ? window.getUserMedia :
                   window.mozGetUserMedia    ? window.mozGetUserMedia :
                   window.webkitGetUserMedia ? window.webkitGetUserMedia :
                   function () { console.error("Can't get user media"); };

//
// Mock WebRTC Engine
//

function MultiPeerRoom () {
  console.log('New MultiPeerRoom');

  this.fakePeers = [
    { username: 'peer-a', id: 1, pc: {} },
    { username: 'peer-d', id: 4, pc: {} }
  ];

  this.callbacks = {
    peer: _.id
  };
}

MultiPeerRoom.prototype.connect = function (server, room) {
  console.log('MultiPeerRoom::connect -', server, room);
};

MultiPeerRoom.prototype.disconenct = function () {
  console.log('MultiPeerRoom::disconnect');
};

MultiPeerRoom.prototype.join = function (λ) {
  _.delay(function dispatchPeers (self) {
    self.fakePeers.forEach(self.callbacks.peer);
  }, 1000, this);
};

MultiPeerRoom.prototype.onNewPeer = function (λ) {
  this.callbacks.peer = λ.bind(this);
};


//
// VideoPanel Model
//

_kiwi.model.VideoPanel = Backbone.Model.extend({

    // State
    userState: 'disconnected',
    numPeers: '??',
    streams: { self: null, peers: {} },

    // Init
    initialize: function (options) {
      console.log('model.video-panel::init');
      this.view = new _kiwi.view.VideoPanel({ model: this });
      console.info('TODO: Init webrtc engine here');

      console.log(this.view);

      // Mock webrtc engine
      this.room = new MultiPeerRoom();
      this.room.onNewPeer(function (peer) {
        this.streams.peers[peer.id] = new _kiwi.model.Video(peer);
        this.streams.peers[peer.id].renderIn(this.view.$remote);
      }.bind(this));
    },

    // Room functions
    join: function () {
      console.log('model.video-panel::join');
      this.room.join();
      this.initCamera();
    },

    spectate: function () {
      console.log('spectate room now');
    },

    leave: function () {
      console.log('leave room now');
    },


    // Self-video functions

    initCamera: function () {
      var myPeerInfo = {
        username: 'mi',
        id: 0,
        pc: {}
      };

      this.streams.self = new _kiwi.model.Video(myPeerInfo);
      this.streams.self.renderIn(this.view.$self);
      this.streams.self.reverseOutput();

      window.getUserMedia(
        { video: true },
        this.streams.self.addStream.bind(this.streams.self),
        console.error.bind(console)
      );
    }

});
