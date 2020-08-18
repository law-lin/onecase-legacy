import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";

import { withFirebase } from "./Firebase";
import { withRouter } from "react-router-dom";
import "./landingpage.css";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      color: "#aaeef2",
      textDecoration: "none",
      textShadow: "2px 2px transparent",
    },
    color: "#d4f1f3",
    textDecoration: "none",
    textShadow: "2px 2px black",
  },
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
});

function LandingPageNavbar(props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const validateLogin = () => {
    return password !== "" && email !== "";
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        props.firebase.currentUser().on("value", (snapshot) => {
          props.history.push("/feed");
        });
      })
      .catch((error) => {
        setError(error);
      });
  };

  const classes = useStyles();
  return (
    <nav className="zone top">
      <ul className="main-nav">
        <li className="logo">
          <Link href="/" className={classes.root}>
            OneCase
          </Link>
        </li>
        <li className="push">
          <button
            type="button"
            className={classes.button}
            onClick={handleClickOpen}
          >
            Login
          </button>
        </li>
      </ul>
      <Dialog open={open} onClose={handleClose}>
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
            onClick={handleClose}
            color="primary"
          >
            Cancel
          </button>
          <button
            disabled={!validateLogin()}
            className="btn btn-primary log"
            onClick={handleLogin}
            color="primary"
          >
            Login
          </button>
        </DialogActions>
      </Dialog>
    </nav>
  );
}

export default withFirebase(withRouter(LandingPageNavbar));
