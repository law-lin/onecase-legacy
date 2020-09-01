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
import PasswordResetPage from "./components/PasswordResetPage";
import FeedPage from "./components/FeedPage";
import ExplorePage from "./components/ExplorePage";
import CategoriesPage from "./components/CategoriesPage";
import ExhibitionsPage from "./components/ExhibitionsPage";
import SearchResultsPage from "./components/SearchResults";

import * as ROUTES from "./constants/routes";

import { withAuthentication } from "./components/Session";

// import AuthRoute from './components/AuthRoute'
import "./App.css";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

function Routes() {
  let location = useLocation();
  const [previousLocation, setPreviousLocation] = useState(location);

  const size = useWindowSize();

  useEffect(() => {
    if (!(location.state && location.state.modal)) {
      setPreviousLocation(location);
    }
  });

  const isModal =
    location.state &&
    location.state.modal &&
    previousLocation !== location &&
    size.width >= 1115;

  return (
    <React.Fragment>
      <Switch location={isModal ? previousLocation : location}>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        {/* <Route exact path={ROUTES.LANDING} component={EarlyAccessLandingPage} /> */}
        <Route path="/categories/:category" component={CategoriesPage} />
        <Route exact path={ROUTES.WELCOME} component={WelcomePage} />
        <Route path={ROUTES.FEED} component={FeedPage} />
        <Route exact path={ROUTES.EXHIBITIONS} component={ExhibitionsPage} />
        <Route exact path={"/explore"} component={ExplorePage} />
        <Route exact path={ROUTES.SEARCH} component={SearchResultsPage} />
        <Route exact path={ROUTES.ADMIN} component={AdminPage} />
        <Route
          exact
          path={"/account/password-reset"}
          component={PasswordResetPage}
        />
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
