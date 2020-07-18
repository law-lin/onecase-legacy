import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withFirebase } from "./Firebase";
import { withRouter } from "react-router-dom";
import "./landingpage.css";

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
          setOpen(false);
          props.history.push(snapshot.val().username);
        });
      })
      .catch((error) => {
        setError(error);
      });
  };
  return (
    <nav className="zone top">
      <ul className="main-nav">
        <li className="logo">
          <a href="/">OneCase</a>
        </li>
        <li className="push">
          <a href>
            <button
              type="button"
              className="btn btn-primary log"
              onClick={handleClickOpen}
            >
              Login
            </button>
          </a>
        </li>
      </ul>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Login</DialogTitle>

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
            autoFocus
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
