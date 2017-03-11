import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import firebase from 'firebase/app';
import 'firebase/database';
import App from './App';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasSongURL: false,
      displayURLModal: false,
      openSession: false
    };

    this.db = null;
    this.onJoin = this.onJoin.bind(this);
    this.onURLSubmission = this.onURLSubmission.bind(this);
    this.onURLInputChange = this.onURLInputChange.bind(this);
  }

  onJoin() {
    this.setState({
      displayURLModal: true,
      openSession: this.state.hasSongURL,
      songURL: this.state.songURL
    });
  }

  onURLSubmission(event) {
    event.preventDefault();
    this.db.ref('songURL').set(this.state.songURL)
    .then(() => {
      this.setState({
        openSession: true,
        hasSongURL: true
      });
    });
  }

  onURLInputChange(event) {
    event.preventDefault();
    this.setState({
      songURL: event.target.value
    });
  }

  componentWillMount() {
    const config = {
      apiKey: "AIzaSyApLK9EnnEerhb7FkqKguzUYnX7NB2IiZw",
      authDomain: "instaoke-565dc.firebaseapp.com",
      databaseURL: "https://instaoke-565dc.firebaseio.com",
      storageBucket: "instaoke-565dc.appspot.com",
      messagingSenderId: "888033206019"
    };

    firebase.initializeApp(config);

    this.db = firebase.database();

    this.db.ref('instaOke').set('ok');

    this.db.ref('songURL').on('value', (ss) => {
      const value = ss.val();

      this.setState({
        songURL: value,
        hasSongURL: !!value
      });
    });
  }

  render() {
    return (
      <div>
      <header id="top" className="header">
          <div className="text-vertical-center">
              <h1>InstaOke</h1>
              <h3>Sing with a friend through the InstaOke App</h3>
              <br/>
              <button className="joinButton" onClick={ this.onJoin }></button>
              {
                !this.state.hasSongURL && this.state.displayURLModal ? (
                <div>
                  <div>
                    <form onSubmit={ this.onURLSubmission }>
                      <label>
                        Song Url:
                        <input type="text" name="url" onChange={ this.onURLInputChange } />
                      </label>
                      <input type="submit" value="Submit" />
                    </form>
                  </div>
                </div>
                ) : null
              }
          </div>
      </header>
        { this.state.openSession ? <App songURL={ this.state.songURL } db={ this.db } /> : null }
      </div>
    );
  }
}