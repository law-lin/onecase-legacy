import React from "react";
import "./landingpage.css";

export default function WelcomePage() {
  return (
    <div>
      <nav className="zone top">
        <ul className="main-nav">
          <li className="welcome-logo">
            <a href="">OneCase</a>
            {/* ^^^ this should link back to homepage/landingpage */}
          </li>
        </ul>
      </nav>
      <div class="center-screen">
        <div class="welcome-line">
          Welcome and thanks for signing up for
          <span class="website-name"> OneCase's </span>
          Early Access, that was a pretty cool thing to do.{" "}
        </div>
      </div>
    </div>
  );
}
