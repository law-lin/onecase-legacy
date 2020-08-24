import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import SignOutButton from "./Profile/SignOutButton";
import Avatar from "react-avatar";
import { ReactComponent as HomeIcon } from "./icons/home.svg";
import { ReactComponent as ExhibitionsIcon } from "./icons/exhibitions.svg";
import { withFirebase } from "./Firebase";
import { withRouter } from "react-router-dom";
import "./landingpage.css";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 600,
    color: "#3E4E56",
    textDecoration: "none",
    textTransform: "none",
    fontSize: "20px",
    width: "270px",
    justifyContent: "left",
  },
  noText: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    color: "#3E4E56",
    justifyContent: "center",
  },
  noTextIcon: {
    width: "50px",
  },
  button: {
    "&:hover": {
      outline: "none",
      textDecoration: "none",
      color: "#7699a8",
      backgroundColor: "#FFFFFF",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    borderRadius: "15px",
    color: "#3E4E56",
    fontSize: "20px",
    fontWeight: 700,
    height: "80px",
    padding: "10px 0",
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

    props.firebase.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        props.firebase.currentUser().once("value", (snapshot) => {
          if (snapshot) {
            setUsername(snapshot.val().username);
            setProfilePicture(snapshot.val().profilePicture);
            setLoading(false);
          } else {
            setProfilePicture(null);
            setLoading(false);
          }
        });
      } else {
        setUsername(null);
      }
    });
  }, []);

  function redirectTo(route) {
    window.location.href = route;
    // props.history.push(route);
  }

  return (
    <Box display="flex" flexDirection="column" style={{ marginTop: "25vh" }}>
      {!props.noText && (
        <React.Fragment>
          {username && (
            <React.Fragment>
              <Link href={"/feed"} className={classes.button}>
                <div>
                  <HomeIcon className={classes.icon} />
                  Home
                </div>
              </Link>

              <Link href={"/feed"} className={classes.button}>
                <ExhibitionsIcon className={classes.icon} />
                Exhibitions
              </Link>

              <Link href={"/" + username} className={classes.button}>
                {!loading && (
                  <Avatar
                    round="50px"
                    size="50"
                    style={{ marginRight: "20px" }}
                    src={profilePicture}
                  />
                )}
                Profile
              </Link>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {props.noText && (
        <React.Fragment>
          {username && (
            <React.Fragment>
              <Link href={"/feed"} className={classes.button}>
                <HomeIcon className={classes.noTextIcon} />
              </Link>

              <Link href={"/feed"} className={classes.button}>
                <ExhibitionsIcon className={classes.noTextIcon} />
              </Link>

              <Link href={"/" + username} className={classes.button}>
                {!loading && (
                  <Avatar round="50px" size="50" src={profilePicture} />
                )}
              </Link>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Box>
  );
}

export default withFirebase(withRouter(LeftNavbar));
