import React, { Component } from "react";
import "./landingpage.css";
import background from "../images/background3.png";
import TextField from "@material-ui/core/TextField";

import { withRouter } from "react-router-dom";
import { withFirebase } from "./Firebase";

class EarlyAccessFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
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
      this.setState({
        error: null,
      });
      this.props.firebase.earlyAccess(this.state.email);
      this.props.history.push("welcome");
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
      <div>
        <form onSubmit={this.handleSubmit} noValidate>
          <TextField
            error={error}
            value={email}
            name="email"
            required
            id="outlined-required"
            label="Email"
            variant="filled"
            style={{ backgroundColor: "white", width: 400 }}
            onChange={this.handleChange}
            helperText={error}
          />

          <button
            className="btn btn-primary log"
            disabled={isInvalid}
            type="submit"
            color="primary"
            style={{
              marginTop: 5,
              marginLeft: 10,
            }}
          >
            Early Access
          </button>
        </form>
      </div>
    );
  }
}
export default function LandingPage() {
  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <title>OneCase</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Custom Stylesheet */}
      <link rel="stylesheet" href="landingpage.css" type="text/css" />

      <nav className="zone top">
        <ul className="main-nav">
          <li className="logo">
            <a href>OneCase</a>
          </li>
        </ul>
      </nav>
      <div className="center-page">
        <img className="mural-img" src={background} alt="mural background" />
        <div className="sign-up-box">
          <div className="onecase-title">OneCase</div>
          <div className="onecase-text">
            A Personal Archive + Social Network
          </div>
          <div className="signup-btn">
            <EarlyAccessForm />
          </div>
        </div>
      </div>
      <div className="parentblock">
        <div className="twoblocks" />
      </div>
      <div className="light-scrap">
        <img
          className="lightbulb"
          src="https://www.amt-us.com/wp-content/uploads/2018/10/icon-lightbulb-2.png"
          alt="lightbulb icon"
        />
        <img
          className="scrapbook"
          src="https://icons.iconarchive.com/icons/flameia/machemicals/128/scrapbook-icon.png"
          alt="scrapbook icon"
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

const EarlyAccessForm = withFirebase(withRouter(EarlyAccessFormBase));
