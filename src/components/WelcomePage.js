import React from "react";
import "./landingpage.css";

export default function WelcomePage() {
  return (
    <div>
      <nav className="zone top">
        <ul className="main-nav">
          <li className="logo">
            <a href="/">OneCase</a>
          </li>
        </ul>
      </nav>
      <div className="center-screen">
        <div className="welcome-line">
          Welcome and thanks for signing up for
          <span className="website-name"> OneCase's </span>
          Early Access, that was a pretty cool thing to do.
        </div>
      </div>
    </div>
  );
}
