import React, { Component, useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

import PersonalBridge from "./Private/PersonalBridge";
import PublicBridge from "./Public/PublicBridge";

import Bridge from "./Bridge";
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
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    setLoading(true);
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
    }
  }, []);

  let match = useRouteMatch();

  if (valid) {
    if (!loading) {
      if (personal) {
        return (
          <React.Fragment>
            <Switch>
              <Route exact path={`${match.path}/:cardTitle`}>
                <Bridge />
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
                <Bridge />
              </Route>
              <Route exact path={match.path}>
                <PublicProfilePage />
              </Route>
            </Switch>
          </React.Fragment>
        );
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

const condition = (authenticated) => !!authenticated;

export default withFirebase(ProfilePage);
