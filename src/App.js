import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import EarlyAccessLandingPage from "./components/EarlyAccessLandingPage";
import WelcomePage from "./components/WelcomePage";

import * as ROUTES from "./constants/routes";

import { withAuthentication } from "./components/Session";

import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path={ROUTES.LANDING} component={EarlyAccessLandingPage} />
        <Route exact path={ROUTES.WELCOME} component={WelcomePage} />
      </Router>
    );
  }
}

export default withAuthentication(App);
