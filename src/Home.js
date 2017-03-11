import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import App from './App';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSession: false
    };

    this.displaySession = this.displaySession.bind(this);
  }

  displaySession() {
    this.setState({
      showSession: true
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.displaySession}>Join</button>
        {
          this.state.showSession ? <App /> : null
        }
      </div>
    );
  }
}