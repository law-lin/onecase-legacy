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
        const usernameRegexp = /^(?=.{1,20}$)(?:[a-z\d]+(?:(?:\.|-|_)[a-z\d])*)+$/;
        if (usernameRegexp.test(username)) {
          if (!snapshot.exists()) {
            setUsernameError(null);
          } else {
            setUsernameError("Username is already taken.");
            valid = false;
          }
        } else {
          setUsernameError(
            "Please use only lowercase letters (a-z), numbers, underscores, and periods. (1-30 characters)"
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
                props.firebase.usernames().update({
                  [formattedUsername]: authUser.user.uid,
                });
                props.firebase.names().update({
                  [formattedUsername]: authUser.user.uid,
                });
              })
              .then(() => {
                setOpen(false);
                window.location.href = "/" + username;
              })
              .catch((error) => {
                setError(error);
              });
          }
        }
      });
  };

  const validateLogin = () => {
    return password !== "" && email !== "";
  };

  const handleLogin = (event) => {
    event.preventDefault();

    props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        props.firebase.currentUser().on("value", (snapshot) => {
          window.location.href = "/feed";
        });
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog open={props.handleOpen} onClose={props.handleClose}>
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
          <DialogContentText>
            {error && <p style={{ color: "red" }}>{error.message}</p>}
          </DialogContentText>
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
