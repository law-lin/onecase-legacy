import React, { useState, useEffect } from "react";

import { Switch, Route, useRouteMatch, useParams } from "react-router-dom";

import NotFound from "../NotFound";
import BridgePage from "./BridgePage";
import PersonalProfilePage from "./Private/PersonalProfilePage";
import PublicProfilePage from "./Public/PublicProfilePage";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

function ProfilePage(props) {
  const [personal, setPersonal] = useState(false);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);

  const { username } = useParams();
  useEffect(() => {
    let usernameParams = username.toString().toLowerCase();

    if (!ROUTES.NON_USERNAMES.includes(usernameParams)) {
      setValid(true);
      props.firebase.auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          props.firebase.currentUser().on("value", (snapshot) => {
            if (snapshot.val().username.toLowerCase() === usernameParams) {
              setPersonal(true);
              setLoading(false);
            } else {
              setPersonal(false);
              setLoading(false);
            }
          });
        } else {
          setPersonal(false);
          setLoading(false);
        }
      });
    } else {
      setValid(false);
      setLoading(false);
    }
  }, [props.firebase, username]);

  let match = useRouteMatch();

  if (!loading) {
    if (valid) {
      if (personal) {
        return (
          <React.Fragment>
            <Switch>
              <Route exact path={`${match.path}/links`}>
                <PersonalProfilePage />
              </Route>
              <Route exact path={`${match.path}/:cardTitle`}>
                <BridgePage />
              </Route>
              <Route exact path={match.path}>
                <PersonalProfilePage />
              </Route>
            </Switch>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <Switch>
              <Route exact path={`${match.path}/links`}>
                <PublicProfilePage />
              </Route>
              <Route exact path={`${match.path}/:cardTitle`}>
                <BridgePage />
              </Route>
              <Route exact path={match.path}>
                <PublicProfilePage />
              </Route>
            </Switch>
          </React.Fragment>
        );
      }
    } else {
      return <NotFound />;
    }
  } else {
    return null;
  }
}

export default withFirebase(ProfilePage);
