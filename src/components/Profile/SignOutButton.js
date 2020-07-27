import React from "react";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "red",
    },
    color: "white",
    backgroundColor: "black",
    textTransform: "none",
    marginTop: "200px",
    fontSize: "20px",
    justifyContent: "center",
  },
});

function SignOutButton(props) {
  const classes = useStyles();

  const signOut = () => {
    props.history.push("/");
    props.firebase.doSignOut();
  };
  return (
    <Button
      type="button"
      variant="contained"
      color="blue"
      className={classes.root}
      onClick={signOut}
    >
      Sign Out
    </Button>
  );
}

export default withFirebase(withRouter(SignOutButton));
