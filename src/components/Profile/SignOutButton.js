import React from "react";

import { ReactComponent as SignOutIcon } from "../icons/signout.svg";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { Mixpanel } from "../Mixpanel";

const useStyles = makeStyles({
  root: {
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    color: "#3E4E56",
    textDecoration: "none",
    textTransform: "none",
    fontSize: "20px",
    height: "40px",
  },
  icon: {
    width: "25px",
    marginRight: "20px",
  },
});

function SignOutButton(props) {
  const classes = useStyles();

  const signOut = () => {
    Mixpanel.track("Sign Out");
    Mixpanel.reset();
    props.firebase.doSignOut();
    window.location.href = "/";
  };
  return (
    <Button className={classes.root} onClick={signOut}>
      <SignOutIcon className={classes.icon} />
      Sign Out
    </Button>
  );
}

export default withFirebase(withRouter(SignOutButton));
