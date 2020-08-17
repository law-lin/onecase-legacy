import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DefaultProfilePicture from "../images/default-profile-pic.png";
import { withFirebase } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";

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
  signup: {
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
function SignUp(props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [error, setError] = useState(null);

  const classes = useStyles();
  useEffect(() => {
    setOpen(props.open);
    if (props.noButton) {
      setOpen(true);
    }
  }, [props.open]);
  const handleSignUp = (event) => {
    event.preventDefault();

    let valid = true;
    let formattedUsername = username.toLowerCase();

    props.firebase
      .checkDuplicateUsername(formattedUsername)
      .once("value")
      .then((snapshot) => {
        // Email validation
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regexp.test(email)) {
          setEmailError(null);
        } else {
          setEmailError("Please enter a valid email.");
          valid = false;
        }

        // Username validation
        const usernameRegexp = /^(?=.{1,20}$)(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/;
        if (usernameRegexp.test(username)) {
          if (!snapshot.exists()) {
            setUsernameError(null);
          } else {
            setUsernameError("Username is already taken.");
            valid = false;
          }
        } else {
          setUsernameError(
            "Please use only letters (a-z, A-Z), numbers, underscores, and periods. (1-30 characters)"
          );
          valid = false;
        }
        // Password validation
        // TODO: Password strength
        if (password === confirmPassword) {
          setPasswordError(null);
        } else {
          setPasswordError("Passwords do not match.");
          valid = false;
        }

        if (valid) {
          if (valid) {
            props.firebase
              .doCreateUserWithEmailAndPassword(email, password)
              .then((authUser) => {
                // Create a user in your Firebase realtime database
                props.firebase.user(authUser.user.uid).set({
                  name: username,
                  username,
                  email,
                  bio: "",
                  followerCount: 0,
                  followingCount: 0,
                  profilePicture: DefaultProfilePicture,
                });

                return props.firebase.usernames().update({
                  [formattedUsername]: authUser.user.uid,
                });
              })
              .then(() => {
                setOpen(false);
                props.history.push(username);
                props.history.go();
              })
              .catch((error) => {
                setError(error);
              });
          }
        }
      });
  };
  const validateNotEmpty = () => {
    return (
      email !== "" &&
      username !== "" &&
      password !== "" &&
      confirmPassword !== ""
    );
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <React.Fragment>
        <Dialog
          open={props.handleOpen}
          onClose={props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>

          <DialogContent>
            <TextField
              error={emailError}
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              value={email}
              helperText={emailError}
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              error={usernameError}
              margin="dense"
              id="username"
              label="Username"
              type="username"
              value={username}
              helperText={usernameError}
              fullWidth
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              error={passwordError}
              margin="dense"
              id="password"
              label="Password"
              type="password"
              value={password}
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              error={passwordError}
              margin="dense"
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              helperText={passwordError}
              fullWidth
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <DialogContentText style={{ color: "red" }}>
                {error.message}
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-danger log"
              onClick={handleClose}
              color="primary"
            >
              Cancel
            </button>
            <Button
              disabled={!validateNotEmpty()}
              className={classes.signup}
              onClick={handleSignUp}
              color="primary"
            >
              Sign Up
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </React.Fragment>
  );
}

export default withFirebase(SignUp);
