import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import SignInForm from './pages/SignInForm';
import Home from './pages/Home';

import './App.css';

class App extends Component {
  render() {
    return (


      <Router basename="/">

        <div className="App">




          <div className="App__Form">


              <Route exact path="/" component={SignUpForm}>
              </Route>
              <Route path="/sign-in" component={SignInForm}>
              </Route>
              <Route exact path="/path" component={Home}>

              </Route>
          </div>

        </div>
      </Router>

    );
  }
}

export default App;
