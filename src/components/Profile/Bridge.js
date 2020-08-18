import React, { Component, useState, useEffect } from "react";

import NotFound from "../NotFound";
import Navbar from "../Navbar";
import PersonalBridge from "./Private/PersonalBridge";
import PublicBridge from "./Public/PublicBridge";
import { withRouter } from "react-router-dom";
import { withAuthorization } from "../Session";
import DefaultProfilePicture from "../../images/default-profile-pic.png";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

function Bridge(props) {
  const [personal, setPersonal] = useState(false);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    setLoading(true);
    const username = props.match.params.username.toString().toLowerCase();
    const cardTitle = props.match.params.cardTitle;

    if (!ROUTES.NON_USERNAMES.includes(username)) {
      setValid(true);
      props.firebase.auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          props.firebase.currentUser().on("value", (snapshot) => {
            if (snapshot.val().username.toLowerCase() === username) {
              setPersonal(true);
            } else {
              setPersonal(false);
            }
          });

          if (cardTitle !== null) {
            props.firebase
              .getIDWithUsername(username)
              .on("value", (snapshot) => {
                const userIDState = snapshot.val();
                if (userIDState) {
                  props.firebase
                    .getCardNumberWithCardTitle(userIDState, cardTitle)
                    .on("value", (snapshot) => {
                      const state = snapshot.val();
                      console.log(state);
                      if (state) {
                        setExists(true);
                        setLoading(false);
                      } else {
                        setExists(false);
                        setLoading(false);
                      }
                    });
                } else {
                  setExists(false);
                  setLoading(false);
                }
              });
          } else {
            setLoading(false);
          }
        } else {
          setPersonal(false);
          setLoading(false);
        }
      });
    }
  }, [
    props.firebase,
    props.match.params.username,
    props.match.params.cardTitle,
  ]);

  if (!loading && valid) {
    if (exists) {
      if (personal) {
        return <PersonalBridge />;
      } else {
        return <PublicBridge />;
      }
    } else {
      return <NotFound />;
    }
  } else {
    return null;
  }
}

export default withFirebase(withRouter(Bridge));
