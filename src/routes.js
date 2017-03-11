import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import About from './About';

const Routes = (props) => (
  <Router {...props}>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/about" component={About} />
    </div>
  </Router>
);

export default Routes;
