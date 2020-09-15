import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

import { withFirebase } from "./Firebase";
import { Mixpanel } from "./Mixpanel";

const useStyles = makeStyles({
  button: {
    "&:hover": {
      backgroundColor: "#0069d9",
      borderColor: "#0062cc",
    },
    "&:active": {
      backgroundColor: "#0062cc",
      borderColor: "#005cbf",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(38, 143, 255, 0.5)",
      outline: "none",
    },
    color: "#FFFFFF",
    display: "inline-block",
    backgroundColor: "#007bff",
    fontFamily: ["Mukta Mahee", "san-serif"],
    border: "1px solid transparent",
    borderColor: "#007bff",
    padding: "0.5rem 1rem",
    fontSize: "1.25rem",
    lineHeight: 1.5,
    borderRadius: "15px",
    transition:
      "color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    fontWeight: 400,
    textTransform: "none",
  },
  login: {
    "&:hover": {
      backgroundColor: "#0069d9",
      borderColor: "#0062cc",
    },
    "&:active": {
      backgroundColor: "#0062cc",
      borderColor: "#005cbf",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(38, 143, 255, 0.5)",
      outline: "none",
    },
    color: "#FFFFFF",
    display: "inline-block",
    backgroundColor: "#007bff",
    fontFamily: ["Mukta Mahee", "san-serif"],
    border: "1px solid transparent",
    borderColor: "#007bff",
    padding: ".375rem .75rem",
    fontSize: "1rem",
    lineHeight: 1.5,
    transition:
      "color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    fontWeight: 400,
    textTransform: "none",
  },
});
function LogIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const classes = useStyles();

  const validateLogin = () => {
    return password !== "" && email !== "";
  };

  const handleLogin = (event) => {
    props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((user) => {
        Mixpanel.identify(user.user.uid);
        Mixpanel.track("Login");
        props.handleClose();
      })
      .catch((error) => {
        if (error.message.includes("password is invalid")) {
          setError("The password you've entered is incorrect.");
        } else if (error.message.includes("no user record")) {
          setError(
            "The email address you've entered doesn't match any account."
          );
        } else if (error.message.includes("badly formatted")) {
          setError("Please enter a valid email address.");
        }
      });
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.handleOpen}
        onClose={() => {
          props.handleClose();
          setError(null);
        }}
      >
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            value={email}
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            value={password}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <React.Fragment>
              {error.includes("incorrect") && (
                <DialogContentText style={{ color: "red" }}>
                  {error}{" "}
                  <Link href="/account/password-reset">Forgot password?</Link>
                </DialogContentText>
              )}
              {error.includes("doesn't match") && (
                <DialogContentText style={{ color: "red" }}>
                  {error} Sign up for an account here.
                </DialogContentText>
              )}
              {error.includes("enter a valid") && (
                <DialogContentText style={{ color: "red" }}>
                  {error}
                </DialogContentText>
              )}
            </React.Fragment>
          )}
          <Link href="/account/password-reset">Forgot password?</Link>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-danger log"
            onClick={props.handleClose}
            color="primary"
          >
            Cancel
          </button>
          <button
            disabled={!validateLogin()}
            className={classes.login}
            onClick={handleLogin}
            color="primary"
          >
            Login
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default withFirebase(LogIn);
