import React from "react";
import "./landingpage.css";

export default function WelcomePage() {
  return (
    <div>
      <nav className="zone top">
        <ul className="main-nav">
          <li className="logo">
            <a href>OneCase</a>
          </li>
        </ul>
      </nav>
      <div class="welcome-line">
        Welcome and thanks for signing up for OneCase's Early Access,{" "}
      </div>
    </div>
  );
}
