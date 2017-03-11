import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import Home from './Home';
import About from './About';

const Routes = (props) => (
  <Router {...props}>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/app" component={App}></Route>
      <Route path="/about" component={About} />
    </div>
  </Router>
);

export default Routes;
