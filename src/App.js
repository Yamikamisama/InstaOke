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



class App extends Component {
  constructor(props) {
    super(props);

    this.removeSongURL = this.removeSongURL.bind(this);
    this.setPlayerReady = this.setPlayerReady.bind(this);
  }

  componentDidMount() {
    var apiKey = '45793172';
    var sessionId = '1_MX40NTc5MzE3Mn5-MTQ4OTI0OTA1NTg3NX5LOWhWZnhveTFKa1czUWhzTmxYK0hJYm5-fg';
    var token = 'T1==cGFydG5lcl9pZD00NTc5MzE3MiZzaWc9MjI5NDFjZmE0NmNjNjE0MGM2Njc3OWUyM2I2ZTQzMmNlZTZjM2UyYzpzZXNzaW9uX2lkPTFfTVg0ME5UYzVNekUzTW41LU1UUTRPVEkwT1RBMU5UZzNOWDVMT1doV1puaHZlVEZLYTFjelVXaHpUbXhZSzBoSlltNS1mZyZjcmVhdGVfdGltZT0xNDg5MjQ5MDYzJm5vbmNlPTAuNDIxMDU5MDEwMzM5MDEwNiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDkxODM3NDYy';
    var session = OT.initSession(apiKey, sessionId)
    .on('streamCreated', function(event) {
      session.subscribe(event.stream);
    })
    .connect(token, function(error) {
      var publisher = OT.initPublisher();
      session.publish(publisher);
    });
  }

  setPlayerReady() {
    this.props.db.ref('ready').on('value', (ss) => {
      console.log(value);
      const value = ss.val();
      const newValue = value ? 2 : 1;

      this.props.db.ref('ready').set(newValue)

      if (newValue === 2) {
        jwplayer().play(true);
      }
    });
  }

  removeSongURL() {
    return Promise.all([
      this.props.db.ref('songURL').remove(),
      this.props.db.ref('ready').remove()
    ]);
  }

  render() {
    return (
      <div className="App">
        <div id="myDiv">This text will be replaced with a player.</div>
        <ReactJWPlayer
          playerId='myDiv'
          aspectRatio='16:9'
          playerScript='https://content.jwplatform.com/libraries/9AFwMfdb.js'
          file={ this.props.songURL }
          onReady={ this.setPlayerReady }
          onOneHundredPercent={ this.removeSongURL }
        />
        <div className="App-main">
        </div>
      </div>
    );
  }
}

export default App;
