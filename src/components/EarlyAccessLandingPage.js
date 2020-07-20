import React, { Component } from "react";
import "./landingpage.css";
import background from "../images/background3.png";
import TextField from "@material-ui/core/TextField";
import Navbar from "./Navbar";
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
        console.log(snapshot);
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
      <Navbar />
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
          <Grid item xs={12}>
            <EarlyAccessForm />
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
}

const EarlyAccessForm = withFirebase(withRouter(EarlyAccessFormBase));
