import React, { Component } from "react";
import "./landingpage.css";

import LandingPageNavbar from "./LandingPageNavbar";
import background from "../images/background3.png";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import { withFirebase } from "./Firebase";

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

      <LandingPageNavbar />

      <div className="center-page">
        <img className="mural-img" src={background} />
        <div className="sign-up-box">
          <div className="onecase-title">OneCase</div>
          <div className="onecase-text">
            A Personal Archive + Social Network
          </div>
          <div className="signup-btn">
            <button type="button" className="btn btn-primary btn-lg signup">
              <a href>Sign up</a>
            </button>
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
