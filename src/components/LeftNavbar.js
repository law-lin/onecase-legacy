import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { ImHome3 } from "react-icons/im";
import SignOutButton from "./Profile/SignOutButton";
import Avatar from "@material-ui/core/Avatar";
import { ImSearch } from "react-icons/im";
import { ReactComponent as HomeIcon } from "./icons/home.svg";
import { ReactComponent as ExhibitionsIcon } from "./icons/exhibitions.svg";
import { withFirebase } from "./Firebase";
import { withRouter } from "react-router-dom";
import MediaQuery from "react-responsive";
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
    color: "#FFFFFF",
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
    height: "50px",
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
    color: "#000000",
    fontSize: "20px",
    fontWeight: 700,
    height: "80px",
    padding: "10px 0",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    width: "50px",
    height: "50px",
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
    <React.Fragment>
      <MediaQuery minWidth={1400}>
        <Box flex={1}>
          <Box
            display="flex"
            flexDirection="column"
            style={{ marginTop: "25vh" }}
          >
            <React.Fragment>
              {username && (
                <React.Fragment>
                  <Link href={"/feed"} className={classes.button}>
                    <div>
                      <ImHome3 className={classes.icon} />
                      Home
                    </div>
                  </Link>

                  <Link href={"/explore"} className={classes.button}>
                    <ImSearch className={classes.icon} />
                    Explore
                  </Link>

                  <Link href={"/" + username} className={classes.button}>
                    {!loading && (
                      <Avatar
                        round="50px"
                        size="50"
                        style={{
                          marginRight: "20px",
                          height: "50px",
                          width: "50px",
                        }}
                        src={profilePicture}
                      />
                    )}
                    Profile
                  </Link>
                </React.Fragment>
              )}
            </React.Fragment>
          </Box>
        </Box>
      </MediaQuery>
      <MediaQuery minWidth={1115} maxWidth={1399}>
        <Box>
          <Box
            display="flex"
            flexDirection="column"
            style={{ marginTop: "25vh" }}
          >
            <React.Fragment>
              {username && (
                <React.Fragment>
                  <Link href={"/feed"} className={classes.button}>
                    <div>
                      <ImHome3 className={classes.noTextIcon} />
                    </div>
                  </Link>
                  <Link href={"/explore"} className={classes.button}>
                    <ImSearch className={classes.noTextIcon} />
                  </Link>
                  <Link href={"/" + username} className={classes.button}>
                    {!loading && (
                      <Avatar round="50px" size="50" src={profilePicture} />
                    )}
                  </Link>
                </React.Fragment>
              )}
            </React.Fragment>
          </Box>
        </Box>
      </MediaQuery>
    </React.Fragment>
  );
}

export default withFirebase(withRouter(LeftNavbar));
