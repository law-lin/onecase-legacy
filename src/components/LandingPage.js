import React, { useState, useEffect } from "react";

import { ReactComponent as TwitterIcon } from "./icons/twitter.svg";
import { ReactComponent as InstagramIcon } from "./icons/instagram.svg";
import { ReactComponent as LinkedinIcon } from "./icons/linkedin.svg";

import "./landingpage.css";

import LandingPageNavbar from "./LandingPageNavbar";
import background from "../images/background2.png";
import platform from "../images/user-centered-platform.png";
import potential from "../images/untapped-potential.png";
import hub from "../images/creative-and-pro-hub.png";
import lightbulb from "../images/lightbulb.png";
import scrapbook from "../images/scrapbook.png";
import community from "../images/community.png";
import roundedlogo from "../images/roundedlogo.png";

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
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
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
          setEmailError("Please enter a valid email");
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
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!loading) {
    return (
      <div className="main-container">
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
              minWidth: "35%",
              maxWidth: "80%",
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
                fontFamily: "Mukta Mahee",
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
                fontFamily: "Mukta Mahee",
                fontWeight: 300,
                color: "#ffffff",
              }}
            >
              <p style={{ margin: "0 20px 0 20px" }}>
                A Personal Archive + Social Network
              </p>
            </Grid>
            <Grid
              item
              xs={12}
              align="center"
              style={{ margin: "10px 0 20px 0" }}
            >
              <button
                type="button"
                className="button"
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
                  <button
                    disabled={!validateNotEmpty()}
                    className="btn btn-primary log"
                    onClick={handleSignUp}
                    color="primary"
                  >
                    Sign Up
                  </button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
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
            <p className="description">
              We're an
              <span className="one-liner"> online scrapbook </span>
              or portfolio, with
              <span className="one-liner"> friends</span>
            </p>
          </Grid>
          <Grid item xs={12} style={{ margin: "0 10% 0 10%" }}>
            <Grid
              container
              justify="center"
              className="three-icons"
              spacing={3}
            >
              <Grid item xs={12} sm={4} align="center">
                <img
                  className="scrapbook"
                  src={scrapbook}
                  alt="scrapbook icon"
                />
                <div className="three-headers">Your Own Page</div>
                <div className="three-descriptions">
                  Let OneCase serve as your one-stop shop to display all your
                  favorite projects and things
                </div>
              </Grid>
              <Grid item xs={12} sm={4} align="center">
                <img
                  className="lightbulb"
                  src={lightbulb}
                  alt="lightbulb icon"
                />
                <div className="three-headers">Interest Oriented</div>
                <div className="three-descriptions">
                  Uploading content shouldn’t feel too personal and daunting,
                  let your interests speak for themselves
                </div>
              </Grid>
              <Grid item xs={12} sm={4} align="center">
                <img
                  className="community"
                  src={community}
                  alt="community icon"
                />
                <div className="three-headers">Creative Motivation</div>
                <div className="three-descriptions">
                  Get inspo from your friends, collaborate, and get excited to
                  try/learn new things
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={5}
          className="three-images"
          style={{ marginTop: "15vh" }}
        >
          <Grid item xs={12} style={{ margin: "0 5% 0 5%" }}>
            <Grid container alignItems="center" spacing={5}>
              <Grid item xs={12} sm={6} align="center">
                <img
                  style={{ maxWidth: "70%" }}
                  src={platform}
                  alt="User Centered Platform"
                />
              </Grid>
              <Grid item xs={12} sm={6} align="center">
                <div className="three-big-headers">User Centered Platform</div>
                <div className="three-image-descriptions">
                  We’re a social network that revolves around people’s geniune
                  interests and personalities
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ margin: "0 5% 0 5%" }}>
            <Grid container alignItems="center" spacing={5}>
              <Grid item xs={12} sm={6} align="center">
                <div className="three-big-headers">Untapped Potential</div>
                <div className="three-image-descriptions">
                  A lot of the most interesting things we do go unbroadcasted or
                  unrecorded, this is a place to share it with others
                </div>
              </Grid>
              <Grid item xs={12} sm={6} align="center">
                <img
                  style={{ maxWidth: "70%" }}
                  src={potential}
                  alt="Untapped Potential"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ margin: "0 5% 0 5%" }}>
            <Grid container alignItems="center" spacing={5}>
              <Grid item xs={12} sm={6} align="center">
                <img
                  style={{ maxWidth: "70%" }}
                  src={hub}
                  alt="Creative and Professional Hub"
                />
              </Grid>
              <Grid item xs={12} sm={6} align="center">
                <div className="three-big-headers">
                  Creative and Professional Hub
                </div>
                <div className="three-image-descriptions">
                  OneCase gives you a platform to showcase your work and
                  interests, as well as connect with others
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container className="footer">
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} style={{ margin: "0 7% 0 7%" }}>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    align="center"
                    style={{ marginTop: "2%" }}
                  >
                    <img src={roundedlogo} />
                    <span className="footer-logo"> OneCase</span>
                  </Grid>
                  <Grid item xs={12} sm={10}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ margin: "2.5% 7% 2% 7%" }}>
                <Grid container alignItems="center">
                  <Grid container item xs={12} sm={8} align="center">
                    <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
                      <span className="footer-links">About Us</span>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
                      <span className="footer-links">Terms of Service</span>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
                      <span className="footer-links">Privacy Policy </span>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
                      <span className="footer-links">Contact</span>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={2} />
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    align="center"
                    style={{ marginTop: "10px" }}
                  >
                    {/* Icons provided by https://icons8.com */}
                    <a
                      target="_window"
                      href="https://twitter.com/onecaseapp"
                      className="social-media-icons"
                    >
                      <TwitterIcon />
                    </a>
                    <a
                      target="_window"
                      href="https://www.instagram.com/onecaseapp/"
                      className="social-media-icons"
                    >
                      <InstagramIcon />
                    </a>
                    <a
                      target="_window"
                      href="https://www.linkedin.com/company/onecaseapp/"
                      className="social-media-icons"
                    >
                      <LinkedinIcon />
                    </a>
                  </Grid>
                </Grid>
              </Grid>
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
