import React, { useState, useEffect } from "react";

import NotFound from "../NotFound";

import Bridge from "./Bridge";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

function BridgePage(props) {
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    setLoading(true);
    const username = props.match.params.username.toString().toLowerCase();
    const cardTitle = props.match.params.cardTitle;

    if (!ROUTES.NON_USERNAMES.includes(username)) {
      setValid(true);
      if (cardTitle !== null) {
        let modifiedCardTitle = cardTitle[0].toUpperCase() + cardTitle.slice(1);
        props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
          const userIDState = snapshot.val();
          if (userIDState) {
            props.firebase
              .getCardNumberWithCardTitle(userIDState, modifiedCardTitle)
              .on("value", (snapshot) => {
                const state = snapshot.val();
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
    }
  }, [
    props.firebase,
    props.match.params.username,
    props.match.params.cardTitle,
  ]);

  if (!loading && valid) {
    if (exists) {
      return <Bridge />;
    } else {
      return <NotFound />;
    }
  } else {
    return null;
  }
}

export default withFirebase(withRouter(BridgePage));
