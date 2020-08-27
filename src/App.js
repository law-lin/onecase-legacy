import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { ModalContainer, ModalRoute } from "react-router-modal";
import EarlyAccessLandingPage from "./components/EarlyAccessLandingPage";
import WelcomePage from "./components/WelcomePage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/Profile/ProfilePage";
import BridgeCardContent from "./components/Profile/BridgeCardContent";
import AdminPage from "./components/AdminPage";
import FeedPage from "./components/FeedPage";
import CategoriesPage from "./components/CategoriesPage";
import ExhibitionsPage from "./components/ExhibitionsPage";
import SearchResultsPage from "./components/SearchResults";

import * as ROUTES from "./constants/routes";

import { withAuthentication } from "./components/Session";

// import AuthRoute from './components/AuthRoute'
import "./App.css";

function Routes() {
  let location = useLocation();
  const [previousLocation, setPreviousLocation] = useState(location);

  useEffect(() => {
    if (!(location.state && location.state.modal)) {
      setPreviousLocation(location);
    }
  });
  const isModal =
    location.state && location.state.modal && previousLocation !== location;

  return (
    <React.Fragment>
      <Switch location={isModal ? previousLocation : location}>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        {/* <Route exact path={ROUTES.LANDING} component={EarlyAccessLandingPage} /> */}
        <Route path="/categories/:category" component={CategoriesPage} />
        <Route exact path={ROUTES.WELCOME} component={WelcomePage} />
        <Route path={ROUTES.FEED} component={FeedPage} />
        <Route exact path={ROUTES.EXHIBITIONS} component={ExhibitionsPage} />
        <Route exact path={ROUTES.SEARCH} component={SearchResultsPage} />
        <Route exact path={ROUTES.ADMIN} component={AdminPage} />
        <Route exact path="/c/:cardID">
          <BridgeCardContent isModal={isModal} />
        </Route>
        <Route path={ROUTES.USERNAME} component={ProfilePage} />
      </Switch>
      {isModal ? (
        <Route exact path="/c/:cardID">
          <BridgeCardContent isModal={isModal} />
        </Route>
      ) : null}
    </React.Fragment>
  );
}
function App() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}
export default withAuthentication(App);
