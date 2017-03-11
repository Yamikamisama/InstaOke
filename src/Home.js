import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import App from './App';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayURLModal: false,
      songUrl: null
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
        <button onClick={ this.onJoin }>Join</button>
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
            <App />
          </div>
          ) : null
        }
      </div>
    );
  }
}