import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ModalContainer, ModalRoute } from "react-router-modal";
import EarlyAccessLandingPage from "./components/EarlyAccessLandingPage";
import WelcomePage from "./components/WelcomePage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/Profile/ProfilePage";
import AdminPage from "./components/AdminPage";
import FeedPage from "./components/FeedPage";
import ExhibitionsPage from "./components/ExhibitionsPage";
import SearchResultsPage from "./components/SearchResults";
import Bridge from "./components/Profile/Bridge";
import * as ROUTES from "./constants/routes";

import { withAuthentication } from "./components/Session";

// import AuthRoute from './components/AuthRoute'
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          {/* <Route exact path={ROUTES.LANDING} component={EarlyAccessLandingPage} /> */}

          <Route exact path={ROUTES.WELCOME} component={WelcomePage} />
          <Route exact path={ROUTES.FEED} component={FeedPage} />
          <Route exact path={ROUTES.EXHIBITIONS} component={ExhibitionsPage} />
          <Route exact path={ROUTES.SEARCH} component={SearchResultsPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.USERNAME} component={ProfilePage} />
        </Switch>

        <ModalContainer />
      </Router>
    );
  }
}
export default withAuthentication(App);
