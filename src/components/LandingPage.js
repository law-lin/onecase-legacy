import React, { useState, useEffect } from "react";
import "./landingpage.css";

import LandingPageNavbar from "./LandingPageNavbar";
import background from "../images/background3.png";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import DefaultProfilePicture from "../images/default-profile-pic.png";
import { withFirebase } from "./Firebase";
import { withRouter } from "react-router-dom";

function LandingPage(props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    props.firebase.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        props.history.push("/feed");
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, []);

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
        props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            bio: "Edit your bio with the edit button!",
            profilePicture: DefaultProfilePicture,
          })
          .then(() => {
            for (var i = 1; i <= 9; i++) {
              props.firebase.userCards(authUser.user.uid, i).set({
                cardTitle: "Card " + i,
              });
              props.firebase.newCards(
                authUser.user.uid,
                "card" + i,
                "Card_" + i
              );
            }
          });
        let formattedUsername = username.toLowerCase();
        return props.firebase.usernames().update({
          [formattedUsername]: authUser.user.uid,
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

  if (!loading) {
    return (
      <div>
        <LandingPageNavbar />
        <Grid
          container
          alignItems="center"
          justify="center"
          direction="column"
          style={{
            minHeight: "70vh",
            backgroundImage: `url(${background})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Grid
            item
            xs={12}
            style={{
              width: "700px",
              minHeight: "200px",
              backgroundColor: "#3e4e55",
              borderRadius: "15px",
              borderStyle: "solid",
              borderColor: "#ffffff",
            }}
          >
            <Grid
              item
              xs={12}
              style={{
                textAlign: "center",
                fontSize: "50px",
                fontFamily: "Montserrat",
                fontWeight: 700,
                color: "#aaeef2",
                textShadow: "2px 2px black",
              }}
            >
              OneCase
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                textAlign: "center",
                fontSize: "30px",
                fontFamily: "Montserrat",
                fontWeight: 300,
                color: "#ffffff",
              }}
            >
              A Personal Archive + Social Network
            </Grid>
            <Grid
              item
              xs={12}
              align="center"
              style={{ margin: "10px 0 20px 0" }}
            >
              <button
                type="button"
                className="btn btn-primary btn-lg signup"
                onClick={handleClickOpen}
              >
                Sign Up
              </button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>

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
                    id="username"
                    label="Username"
                    type="username"
                    value={username}
                    fullWidth
                    onChange={(e) => setUsername(e.target.value)}
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
                  <TextField
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
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} align="center">
            <div className="twoblocks" />
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "8vh",
            }}
          >
            <img
              className="lightbulb"
              src="https://www.amt-us.com/wp-content/uploads/2018/10/icon-lightbulb-2.png"
              alt="lightbulb icon"
            />
            <p className="description">
              <span className="think">Think </span>
              of us as an
              <span className="scrap"> online scrapbook </span>
              or
              <span className="portfolio"> portfolio, </span>
              with
              <span className="friends"> friends</span>
            </p>
            <img
              className="scrapbook"
              src="https://icons.iconarchive.com/icons/flameia/machemicals/128/scrapbook-icon.png"
              alt="scrapbook icon"
            />
          </Grid>
          <Grid
            container
            align="center"
            justify="center"
            className="three-icons"
            spacing={3}
          >
            <Grid item xs={12} sm={4} align="center">
              <div className="first">Your Own Page</div>
              <div className="first-description">
                Let OneCase serve as your one-stop shop to display all your
                favorite projects and things
              </div>
            </Grid>
            <Grid item xs={12} sm={4} align="center">
              <div className="second">Interest Oriented</div>
              <div className="second-description">
                Uploading content shouldn’t feel too personal and daunting, let
                your interests speak for themselves
              </div>
            </Grid>
            <Grid item xs={12} sm={4} align="center">
              <div className="third">Creative Motivation</div>
              <div className="third-description">
                Get inspo from your friends, collaborate, and get excited to
                try/learn new things
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return null;
  }
}

export default withFirebase(withRouter(LandingPage));
