import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import { withLoader }  from 'loader';

import Collection from 'lists/Collection';
import List from 'lists/List';


const NoMatch = () => <p class="not-found">Page Not Found</p>;

const App = (props) => (
  <Router>
    <div className="App">
        <div className="header">
            <h1>Lists</h1>
        </div>
        <div className="contents">
          <Switch>
            <Route exact path="/" component={withLoader(Collection)} />
            <Route path="/lists/:id" component={withLoader(List)} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </div>
        <div className="footer">
            Made with <span role="img" aria-label="fire">🔥</span> by Cyrus Freshman
        </div>
    </div>
  </Router>
);

export default App;