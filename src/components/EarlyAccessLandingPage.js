import React, { Component } from "react";

import { ReactComponent as TwitterIcon } from "./icons/twitter.svg";
import { ReactComponent as InstagramIcon } from "./icons/instagram.svg";
import { ReactComponent as YouTubeIcon } from "./icons/youtube.svg";

import "./landingpage.css";
import background from "../images/background2.png";
import platform from "../images/user-centered-platform.png";
import potential from "../images/untapped-potential.png";
import hub from "../images/creative-and-pro-hub.png";
import lightbulb from "../images/lightbulb.png";
import scrapbook from "../images/scrapbook.png";
import community from "../images/community.png";
import roundedlogo from "../images/roundedlogo.png";

import TextField from "@material-ui/core/TextField";
import EarlyAccessNavbar from "./EarlyAccessNavbar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { withRouter } from "react-router-dom";
import { withFirebase } from "./Firebase";

class EarlyAccessFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      error: null,
    };
  }
  validateEmail = (email) => {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  };

  handleSubmit = (event) => {
    const { email } = this.state;
    event.preventDefault();
    if (this.validateEmail(email)) {
      this.props.firebase.checkDuplicateEmail(email).on("value", (snapshot) => {
        if (snapshot.exists()) {
          this.setState({
            error: "This email is already signed up!",
          });
        } else {
          this.setState({
            error: null,
          });
          this.props.firebase.earlyAccess(this.state.email);
          this.props.history.push("welcome");
        }
      });
    } else {
      this.setState({
        error: "Please enter a valid email address.",
      });
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  render() {
    const { email, error } = this.state;
    const isInvalid = email === "";

    return (
      <form onSubmit={this.handleSubmit} noValidate style={{ display: "flex" }}>
        <TextField
          error={error}
          value={email}
          name="email"
          required
          id="outlined-required"
          label="Email"
          variant="filled"
          style={{
            backgroundColor: "white",
            width: "70%",
            margin: "20px 10px 10px 50px",
          }}
          onChange={this.handleChange}
          helperText={error}
        />
        <button
          className="btn btn-primary log"
          disabled={isInvalid}
          type="submit"
          color="primary"
          style={{
            margin: "20px 50px 10px 5px",
            maxHeight: "60px",
            width: "30%",
          }}
        >
          Early Access
        </button>
      </form>
    );
  }
}
export default function EarlyAccessLandingPage() {
  return (
    <div>
      <EarlyAccessNavbar />
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
            minHeight: "250px",
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
            A Personal Archive + Social Network
          </Grid>
          <Grid item xs={12}>
            <EarlyAccessForm />
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
          <Grid container justify="center" className="three-icons" spacing={3}>
            <Grid item xs={12} sm={4} align="center">
              <img className="scrapbook" src={scrapbook} alt="scrapbook icon" />
              <div className="three-headers">Your Own Page</div>
              <div className="three-descriptions">
                Let OneCase serve as your one-stop shop to display all your
                favorite projects and things
              </div>
            </Grid>
            <Grid item xs={12} sm={4} align="center">
              <img className="lightbulb" src={lightbulb} alt="lightbulb icon" />
              <div className="three-headers">Interest Oriented</div>
              <div className="three-descriptions">
                Uploading content shouldn’t feel too personal and daunting, let
                your interests speak for themselves
              </div>
            </Grid>
            <Grid item xs={12} sm={4} align="center">
              <img className="community" src={community} alt="community icon" />
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
                    href="https://twitter.com/onecaseapp"
                    className="social-media-icons"
                  >
                    <TwitterIcon />
                  </a>
                  <a
                    href="https://www.instagram.com/onecaseapp/"
                    className="social-media-icons"
                  >
                    <InstagramIcon />
                  </a>
                  <a className="social-media-icons">
                    <YouTubeIcon />
                  </a>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

const EarlyAccessForm = withFirebase(withRouter(EarlyAccessFormBase));
