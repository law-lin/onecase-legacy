import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

import SignOutButton from "./Profile/SignOutButton";

import { ReactComponent as HomeIcon } from "./icons/home.svg";
import { ReactComponent as ExhibitionsIcon } from "./icons/exhibitions.svg";
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
  icon: {
    width: "50px",
    marginRight: "20px",
  },
});

function BottomNavbar(props) {
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
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
  }, []);

  function redirectTo(route) {
    props.history.push(route);
    props.history.go();
  }

  return (
    <BottomNavigation className={classes.root}>
      <BottomNavigationAction icon={<HomeIcon />} component={Link} to="/feed" />
      <BottomNavigationAction icon={<ExhibitionsIcon />} />
      <BottomNavigationAction
        icon={<img style={{ width: "50px" }} src={profilePicture} />}
      />
    </BottomNavigation>
  );
}

export default withFirebase(withRouter(BottomNavbar));
