import React from "react";

import { ReactComponent as SignOutIcon } from "../icons/signout.svg";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

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
    width: "100%",
    justifyContent: "left",
  },
  icon: {
    width: "50px",
    marginRight: "20px",
  },
});

function SignOutButton(props) {
  const classes = useStyles();

  const signOut = () => {
    props.history.push("/");
    props.firebase.doSignOut();
  };
  return (
    <Button className={classes.root} onClick={signOut}>
      <SignOutIcon className={classes.icon} />
      Sign Out
    </Button>
  );
}

export default withFirebase(withRouter(SignOutButton));
