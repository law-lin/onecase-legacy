import React from "react";

import Button from "@material-ui/core/Button";

import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
function SignOutButton(props) {
  const signOut = () => {
    props.history.push("/");
    props.firebase.doSignOut();
  };
  return (
    <Button type="button" variant="contained" color="primary" onClick={signOut}>
      Sign Out
    </Button>
  );
}

export default withFirebase(withRouter(SignOutButton));
