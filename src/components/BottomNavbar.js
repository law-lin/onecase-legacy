import React, { useState, useEffect } from "react";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { ImHome3 } from "react-icons/im";
import { ImSearch } from "react-icons/im";

import MediaQuery from "react-responsive";

import { withFirebase } from "./Firebase";
import { Link, withRouter } from "react-router-dom";
import "./landingpage.css";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      textDecoration: "none",
    },
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
  button: {
    "&:hover": {
      color: "#7699a8",
    },
    color: "#000000",
  },
  icon: {
    width: "32px",
    height: "32px",
  },
});

function BottomNavbar(props) {
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setLoading(true);

    props.firebase.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        props.firebase.currentUser().on("value", (snapshot) => {
          if (snapshot) {
            setUsername(snapshot.val().username);
            setProfilePicture(snapshot.val().profilePicture);
            setLoading(false);
          } else {
            setProfilePicture(null);
            setLoading(false);
          }
        });
      }
    });
  }, []);

  return (
    <MediaQuery maxWidth={1114}>
      <React.Fragment>
        {username && (
          <BottomNavigation className={classes.root}>
            <BottomNavigationAction
              className={classes.button}
              component={Link}
              to="/feed"
              icon={<ImHome3 className={classes.icon} />}
            />
            <BottomNavigationAction
              className={classes.button}
              component={Link}
              to="/explore"
              icon={<ImSearch className={classes.icon} />}
            />
            <BottomNavigationAction
              className={classes.button}
              component={Link}
              to={"/" + username}
              icon={<img className={classes.icon} src={profilePicture} />}
            />
          </BottomNavigation>
        )}
      </React.Fragment>
    </MediaQuery>
  );
}

export default withFirebase(withRouter(BottomNavbar));
