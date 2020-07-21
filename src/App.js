import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import EarlyAccessLandingPage from "./components/EarlyAccessLandingPage";
import WelcomePage from "./components/WelcomePage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";
import FeedPage from "./components/FeedPage";

import Bridge from "./components/Bridge";
import * as ROUTES from "./constants/routes";

import { withAuthentication } from "./components/Session";

// import AuthRoute from './components/AuthRoute'
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        {/* <Route exact path={ROUTES.LANDING} component={EarlyAccessLandingPage} /> */}
        <Route exact path={ROUTES.WELCOME} component={WelcomePage} />
        <Route exact path={ROUTES.FEED} component={FeedPage} />
        <Route exact path={ROUTES.USERNAME} component={ProfilePage} />
        <Route exact path={ROUTES.USERNAME_CARD} component={Bridge} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
      </Router>
    );
  }
}

export default withAuthentication(App);
