import React from "react";
import "./landingpage.css";
import background from "../images/background3.png";
import TextField from "@material-ui/core/TextField";
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
      {/* <link
        href="//cdn-images.mailchimp.com/embedcode/slim-10_7.css"
        rel="stylesheet"
        type="text/css"
      /> */}
      <nav className="zone top">
        <ul className="main-nav">
          <li className="logo">
            <a href>OneCase</a>
          </li>
          <li className="push">
            <a href>
              <button type="button" className="btn btn-primary log">
                Login
              </button>
            </a>
          </li>
        </ul>
      </nav>
      <div className="center-page">
        <img className="mural-img" src={background} />
        <div className="sign-up-box">
          <div className="onecase-title">OneCase</div>
          <div className="onecase-text">
            A Personal Archive + Social Network
          </div>
          {/* Begin Mailchimp Signup Form */}
          <link
            href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css"
            rel="stylesheet"
            type="text/css"
          />
          <div id="mc_embed_signup">
            <form
              action="https://app.us10.list-manage.com/subscribe/post?u=f85bcb415af912b06fb56e101&id=037f01bf55"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="_blank"
              noValidate
            >
              <div id="mc_embed_signup_scroll">
                <div className="mc-field-group">
                  <input
                    type="email"
                    placeholder="Email address"
                    name="EMAIL"
                    className="required email"
                    id="mce-EMAIL"
                  />
                </div>
                <div id="mce-responses" className="clear">
                  <div
                    className="response"
                    id="mce-error-response"
                    style={{ display: "none" }}
                  />
                  <div
                    className="response"
                    id="mce-success-response"
                    style={{ display: "none" }}
                  />
                </div>
                {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                <div
                  style={{ position: "absolute", left: "-5000px" }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="b_f85bcb415af912b06fb56e101_037f01bf55"
                    tabIndex={-1}
                    defaultValue
                  />
                </div>
                <div className="clear">
                  <input
                    type="submit"
                    defaultValue="Subscribe"
                    name="subscribe"
                    id="mc-embedded-subscribe"
                    className="button"
                  />
                </div>
              </div>
            </form>
          </div>
          {/*End mc_embed_signup*/}
        </div>
      </div>
      <div className="signup-btn">
        <button type="button" className="btn btn-primary btn-lg signup">
          <a href>Sign up</a>
        </button>
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
