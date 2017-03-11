/* Let CRA handle linting for sample app */
import React, { Component } from 'react';
import Spinner from 'react-spinner';
import classNames from 'classnames';
import ReactJWPlayer from 'react-jw-player';

// import opentok from 'opentok';
import otCore from 'opentok-accelerator-core';
import 'opentok-solutions-css';

import logo from './logo.svg';
import config from '../config.json';
import './App.css';

const otCoreOptions = {
  credentials: {
    apiKey: config.apiKey,
    sessionId: config.sessionId,
    token: config.token,
  },
  // A container can either be a query selector or an HTML Element
  streamContainers(pubSub, type, data, streamId) {
    return {
      publisher: {
        camera: '#cameraPublisherContainer',
        screen: '#screenPublisherContainer',
      },
      subscriber: {
        camera: '#cameraSubscriberContainer',
        screen: '#screenSubscriberContainer',
      },
    }[pubSub][type];
  },
  controlsContainer: '#controls',
  packages: ['archiving'],
  communication: {
    callProperites: null, // Using default
  },
  textChat: {
    name: ['David', 'Paul', 'Emma', 'George', 'Amanda'][Math.random() * 5 | 0], // eslint-disable-line no-bitwise
    waitingMessage: 'Messages will be delivered when other users arrive',
    container: '#chat',
  },
  screenSharing: {
    extensionID: 'plocfffmbcclpdifaikiikgplfnepkpo',
    annotation: true,
    externalWindow: false,
    dev: true,
    screenProperties: {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      showControls: false,
      style: {
        buttonDisplayMode: 'off',
      },
      videoSource: 'window',
      fitMode: 'contain' // Using default
    },
  },
  archiving: {
    startURL: 'https://example.com/startArchive',
    stopURL: 'https://example.com/stopArchive',
  },
};

/**
 * Build classes for container elements based on state
 * @param {Object} state
 */
const containerClasses = (state) => {
  const { active, meta, localAudioEnabled, localVideoEnabled } = state;
  const sharingScreen = meta ? !!meta.publisher.screen : false;
  const viewingSharedScreen = meta ? meta.subscriber.screen : false;
  const activeCameraSubscribers = meta ? meta.subscriber.camera : 0;
  const activeCameraSubscribersGt2 = activeCameraSubscribers > 2;
  const activeCameraSubscribersOdd = activeCameraSubscribers % 2;
  const screenshareActive = viewingSharedScreen || sharingScreen;
  return {
    controlClass: classNames('App-control-container', { hidden: !active }),
    localAudioClass: classNames('ots-video-control circle audio', { muted: !localAudioEnabled }),
    localVideoClass: classNames('ots-video-control circle video', { muted: !localVideoEnabled }),
    cameraPublisherClass: classNames('video-container', { hidden: !active, small: !!activeCameraSubscribers || sharingScreen, left: screenshareActive }),
    screenPublisherClass: classNames('video-container', { hidden: !sharingScreen }),
    cameraSubscriberClass: classNames('video-container', { hidden: !activeCameraSubscribers },
      { 'active-gt2': activeCameraSubscribersGt2 && !screenshareActive },
      { 'active-odd': activeCameraSubscribersOdd && !screenshareActive },
      { small: screenshareActive }
    ),
    screenSubscriberClass: classNames('video-container', { hidden: !viewingSharedScreen }),
  };
};

const connectingMask = () =>
  <div className="App-mask">
    <Spinner />
    <div className="message with-spinner">Connecting</div>
  </div>;

const startCallMask = start =>
  <div className="App-mask">
    <button className="message button clickable" onClick={start}>Click to Start Call </button>
  </div>;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      active: false,
      publishers: null,
      subscribers: null,
      meta: null,
      localAudioEnabled: true,
      localVideoEnabled: true
    };

    this.startCall = this.startCall.bind(this);
    this.toggleLocalAudio = this.toggleLocalAudio.bind(this);
    this.toggleLocalVideo = this.toggleLocalVideo.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    const { openSession } = nextProps;

    if (openSession) {
      this.startCall();
    }
  }

  componentDidMount() {
    otCore.init(otCoreOptions);
    otCore.connect().then(() => this.setState({ connected: true }));
    const events = [
      'subscribeToCamera',
      'unsubscribeFromCamera',
      'subscribeToScreen',
      'unsubscribeFromScreen',
      'startScreenShare',
      'endScreenShare',
    ];

    events.forEach(event => otCore.on(event, ({ publishers, subscribers, meta }) => {
      this.setState({ publishers, subscribers, meta });
    }));
  }

  startCall() {
    otCore.startCall()
    .then(({ publisher, publishers, subscribers, meta }) => {
      this.setState({ publishers, subscribers, meta, active: true });
    })
    .catch(error => console.log(error));
  }

  toggleLocalAudio() {
    otCore.toggleLocalAudio(!this.state.localAudioEnabled);
    this.setState({ localAudioEnabled: !this.state.localAudioEnabled });
  }

  toggleLocalVideo() {
    otCore.toggleLocalVideo(!this.state.localVideoEnabled);
    this.setState({ localVideoEnabled: !this.state.localVideoEnabled });
  }

  render() {
    const { connected, active } = this.state;
    const { openSession } = this.props;
    const {
      localAudioClass,
      localVideoClass,
      controlClass,
      cameraPublisherClass,
      screenPublisherClass,
      cameraSubscriberClass,
      screenSubscriberClass,
    } = containerClasses(this.state);

    return (
      <div className="App">
        <div id="myDiv">This text will be replaced with a player.</div>
        <ReactJWPlayer
          playerId='myDiv'
          isAutoPlay={true}
          aspectRatio='16:9'
          playerScript='https://content.jwplatform.com/libraries/9AFwMfdb.js'
          file='https://www.youtube.com/watch?v=szROVj0Swcs'
        />
        <div className="App-main">
          <div className="App-video-container">
            { !active && startCallMask(this.startCall)}
            <div id="cameraPublisherContainer" className={cameraPublisherClass} />
            <div id="screenPublisherContainer" className={screenPublisherClass} />
          </div>
          <div className="App-video-container2">
            { !active && startCallMask(this.startCall)}
            <div id="cameraSubscriberContainer" className={cameraSubscriberClass} />
            <div id="screenSubscriberContainer" className={screenSubscriberClass} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
