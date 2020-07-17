import React, { useState } from "react";
import "./landingpage.css";

import LandingPageNavbar from "./LandingPageNavbar";
import background from "../images/background3.png";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { withFirebase } from "./Firebase";

function LandingPage(props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const validateSignup = () => {
    return (
      password !== "" &&
      password === confirmPassword &&
      username !== "" &&
      email !== ""
    );
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignup = (event) => {
    event.preventDefault();

    props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        // Create a user in your Firebase realtime database
        props.firebase.user(authUser.user.uid).set({
          username,
          email,
        });
        return props.firebase.usernames().update({
          [username]: authUser.user.uid,
        });
      })
      .then(() => {
        setOpen(false);
        props.history.push(username);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <title>OneCase</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Custom Stylesheet */}
      <link rel="stylesheet" href="landingpage.css" type="text/css" />

      <LandingPageNavbar />

      <div className="center-page">
        <img className="mural-img" src={background} />
        <div className="sign-up-box">
          <div className="onecase-title">OneCase</div>
          <div className="onecase-text">
            A Personal Archive + Social Network
          </div>
          <div className="signup-btn">
            <button
              type="button"
              className="btn btn-primary btn-lg signup"
              onClick={handleClickOpen}
            >
              <a href>Sign up</a>
            </button>
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
                  id="username"
                  label="Username"
                  type="username"
                  value={username}
                  fullWidth
                  onChange={(e) => setUsername(e.target.value)}
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
                <TextField
                  autoFocus
                  margin="dense"
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
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
                <button
                  disabled={!validateSignup()}
                  className="btn btn-primary log"
                  onClick={handleSignup}
                  color="primary"
                >
                  Sign Up
                </button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
      <a href></a>
      <div className="parentblock">
        <div className="twoblocks" />
      </div>
      <div className="light-scrap">
        <img
          className="lightbulb"
          src="https://www.amt-us.com/wp-content/uploads/2018/10/icon-lightbulb-2.png"
        />
        <img
          className="scrapbook"
          src="https://icons.iconarchive.com/icons/flameia/machemicals/128/scrapbook-icon.png"
        />
      </div>
      <div className="one-description">
        <p className="description">
          <span className="think">Think </span>
          of us as an
          <span className="scrap"> online scrapbook </span>
          or
          <span className="portfolio"> portfolio, </span>
          with
          <span className="friends"> friends</span>
        </p>
      </div>
      <div className="three-icons">
        <div className="first">Your Own Page</div>
        <div className="second">Interest Oriented</div>
        <div className="third">Creative Motivation</div>
      </div>
      <div className="icon-descriptions">
        <div className="first-description">
          Let OneCase serve as your one-stop shop to display all your favorite
          projects and things
        </div>
        <div className="second-description">
          Uploading content shouldn’t feel too personal and daunting, let your
          interests speak for themselves
        </div>
        <div className="third-description">
          Get inspo from your friends, collaborate, and get excited to try/learn
          new things
        </div>
      </div>
    </div>
  );
}

export default withFirebase(LandingPage);
