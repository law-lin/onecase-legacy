import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";
import * as ROUTES from "./constants/routes";

import { withAuthentication } from "./components/Session";

// import AuthRoute from './components/AuthRoute'
import "./App.css";

class App extends Component {
  render() {
    return (
      // <ProfilePage/>
      <Router>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route exact path={"/:username"} component={ProfilePage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        {/* <Route path={ROUTES.CARD_BRIDGE} /> */}
      </Router>
    );
  }
}

export default withAuthentication(App);
