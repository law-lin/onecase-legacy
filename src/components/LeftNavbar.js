import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SignOutButton from "./Profile/SignOutButton";

import { ReactComponent as HomeIcon } from "./icons/home.svg";
import { ReactComponent as ExhibitionsIcon } from "./icons/exhibitions.svg";
import { withFirebase } from "./Firebase";
import { withRouter } from "react-router-dom";
import "./landingpage.css";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      textDecoration: "none",
    },

    color: "#3E4E56",
    textDecoration: "none",
    textTransform: "none",
    fontSize: "30px",
    width: "100%",
    justifyContent: "left",
  },
  icon: {
    width: "50px",
    marginRight: "20px",
  },
});

function LeftNavbar(props) {
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
    <Grid container alignItems="center" style={{ margin: "50% 0 0 5%" }}>
      <Grid item xs={12}>
        <a href="/feed" style={{ textDecoration: "none" }}>
          <Button className={classes.root}>
            <HomeIcon className={classes.icon} />
            Home
          </Button>
        </a>
      </Grid>
      <Grid item xs={12}>
        <a href="/exhibitions" style={{ textDecoration: "none" }}>
          <Button className={classes.root}>
            <ExhibitionsIcon className={classes.icon} />
            Exhibitions
          </Button>
        </a>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={() => redirectTo("/" + username)}
          className={classes.root}
        >
          {!loading && (
            <img
              className={classes.icon}
              src={profilePicture}
              alt="profile pic"
            />
          )}
          Profile
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <SignOutButton />
      </Grid>
    </Grid>
  );
}

export default withFirebase(withRouter(LeftNavbar));
