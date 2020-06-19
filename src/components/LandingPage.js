import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

// MUI Stuff
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import icecube from "../images/icecube.jpg";
import "./landing.css";

import { withFirebase } from "./Firebase";
import * as ROUTES from "../constants/routes";

const LandingPage = () => (
  <div className="bg">
    <div className="header">
      <div className="centerheader">
        <span className="logo">
          <b>OnePage</b>
        </span>
        <div className="loginfield">
          <LogInForm />
        </div>
      </div>
    </div>
    <div className="content">
      <div className="landing-center">
        <div className="left">
          <h2 className="oneliner">Your Page, Your Portfolio, Uniquely You</h2>
          <div className="description">
            <span>OneCase is the perfect icebreaker</span>
            <img className="descimg" alt="icecube" src={icecube}></img>
          </div>
          <div className="description">
            <span>Share who you are with the world</span>
          </div>
          <div className="description">
            <span>Connect with friends</span>
          </div>
          <div className="description">
            <span>Grow personally alongside your board</span>
          </div>
        </div>
        <div className="right">
          <span>
            <b style={{ color: "#B54646", fontSize: "32px" }}>New?</b>
            <b style={{ color: "#93B4F6", fontSize: "32px" }}>
              {" "}
              Make an account
            </b>
          </span>
          <SignUpForm />
        </div>
      </div>
    </div>
  </div>
);

const INITIAL_LOGIN_STATE = {
  email: "",
  password: "",
  error: null,
};

class LogInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_LOGIN_STATE };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_LOGIN_STATE });
        this.props.history.push(ROUTES.PROFILE);
      })
      .catch((error) => {
        this.setState({ error });
      });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <form>
        <TextField
          name="email"
          value={email}
          onChange={this.handleChange}
          type="email"
          label="Email"
          style={{ marginTop: 30, marginRight: 10 }}
          variant="outlined"
        />
        <TextField
          name="password"
          value={password}
          onChange={this.handleChange}
          type="password"
          label="Password"
          style={{ marginTop: 30 }}
          variant="outlined"
        />
        <Button
          disabled={isInvalid}
          onClick={this.handleSubmit}
          type="button"
          style={{
            marginTop: 35,
            marginLeft: 10,
            textTransform: "none",
            lineHeight: "30px",
          }}
          variant="contained"
          color="primary"
        >
          Log In
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const INITIAL_SIGNUP_STATE = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_SIGNUP_STATE };
  }

  handleSubmit = (event) => {
    const { email, username, password } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
        });
      })
      .then(() => {
        this.setState({ ...INITIAL_SIGNUP_STATE });
        this.props.history.push(ROUTES.PROFILE);
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { email, username, password, confirmPassword, error } = this.state;

    const isInvalid =
      email === "" ||
      username === "" ||
      password === "" ||
      password !== confirmPassword;

    return (
      <form>
        <TextField
          name="email"
          value={email}
          onChange={this.handleChange}
          type="email"
          label="Email"
          required
          style={{ marginTop: 20, marginBottom: 8, width: 400 }}
          variant="outlined"
        />
        <TextField
          required
          name="username"
          value={username}
          onChange={this.handleChange}
          type="text"
          label="Username"
          style={{ marginBottom: 8, width: 400 }}
          variant="outlined"
        />
        <TextField
          required
          name="password"
          value={password}
          onChange={this.handleChange}
          type="password"
          label="Password"
          style={{ marginBottom: 8, width: 400 }}
          variant="outlined"
        />
        <TextField
          required
          name="confirmPassword"
          value={confirmPassword}
          onChange={this.handleChange}
          type="password"
          label="Confirm Password"
          style={{ marginBottom: 8, width: 400 }}
          variant="outlined"
        />
        <Button
          disabled={isInvalid}
          onClick={this.handleSubmit}
          type="button"
          style={{ textTransform: "none", marginTop: 15 }}
          variant="contained"
          color="primary"
        >
          {" "}
          Sign Up
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const LogInForm = compose(withRouter, withFirebase)(LogInFormBase);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default LandingPage;
