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
    <Box display="flex" flexDirection="column" style={{ marginTop: "75%" }}>
      {username && (
        <React.Fragment>
          <Box>
            <Link href={"/feed"} style={{ textDecoration: "none" }}>
              <Button className={classes.root}>
                <HomeIcon className={classes.icon} />
                Home
              </Button>
            </Link>
          </Box>
          <Box>
            <Link href={"/feed"} style={{ textDecoration: "none" }}>
              <Button className={classes.root}>
                <ExhibitionsIcon className={classes.icon} />
                Exhibitions
              </Button>
            </Link>
          </Box>

          <Box>
            <Link href={"/" + username} style={{ textDecoration: "none" }}>
              <Button className={classes.root}>
                {!loading && (
                  <Avatar
                    round="50px"
                    size="50"
                    style={{ marginRight: "20px" }}
                    src={profilePicture}
                  />
                )}
                Profile
              </Button>
            </Link>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default withFirebase(withRouter(LeftNavbar));
