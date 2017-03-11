import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import Routes from './routes';
import './index.css';

const browserHistory = createBrowserHistory();

ReactDOM.render(
  <Routes history={ browserHistory } />,
  document.getElementById('root')
);
