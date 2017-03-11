import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import App from './App';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayURLModal: false,
      songUrl: null,
      openSession: false
    };

    this.onJoin = this.onJoin.bind(this);
    this.onURLSubmission = this.onURLSubmission.bind(this);
    this.onURLInputChange = this.onURLInputChange.bind(this);
  }

  onJoin() {
    this.setState({
      displayURLModal: true
    });
  }

  onURLSubmission(event) {
    event.preventDefault();
    // send songUrl to jwplayer
    console.log(this.state.songUrl);
    // when jwplayer verifies the url
    localStorage.setItem("songURL", this.state.songUrl);
    this.setState({
      openSession: true,
      displayURLModal: false
    });
  }

  onURLInputChange(event) {
    event.preventDefault();
    this.setState({
      songUrl: event.target.value
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
                this.state.displayURLModal ? (
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

        { this.state.openSession ? <App /> : null }
      </div>
    );
  }
}