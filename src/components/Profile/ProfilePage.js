import React, { Component, useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

import NotFound from "../NotFound";
import BridgePage from "./BridgePage";
import PersonalProfilePage from "./Private/PersonalProfilePage";
import PublicProfilePage from "./Public/PublicProfilePage";
import { ModalContainer, ModalRoute } from "react-router-modal";

import Followers from "../Followers.js";
import Following from "../Following";

import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

function ProfilePage(props) {
  const [personal, setPersonal] = useState(false);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const username = props.match.params.username.toString().toLowerCase();

    if (!ROUTES.NON_USERNAMES.includes(username)) {
      setValid(true);
      props.firebase.auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          props.firebase.currentUser().on("value", (snapshot) => {
            if (snapshot.val().username.toLowerCase() === username) {
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
  }, []);

  let match = useRouteMatch();

  if (!loading) {
    if (valid) {
      if (personal) {
        return (
          <React.Fragment>
            <Switch>
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

const condition = (authenticated) => !!authenticated;

export default withFirebase(ProfilePage);
