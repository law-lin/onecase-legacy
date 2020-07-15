import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import EarlyAccessLandingPage from "./components/EarlyAccessLandingPage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";
import WelcomePage from "./components/WelcomePage";
import Bridge from "./components/Bridge";
import * as ROUTES from "./constants/routes";

import { withAuthentication } from "./components/Session";

// import AuthRoute from './components/AuthRoute'
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path={ROUTES.LANDING} component={EarlyAccessLandingPage} />
        <Route exact path={"/welcome"} component={WelcomePage} />
        <Route exact path={"/:username"} component={ProfilePage} />
        <Route exact path={"/:username/:cardTitle"} component={Bridge} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
      </Router>
    );
  }
}

export default withAuthentication(App);
