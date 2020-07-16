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
      <div class="error-screen">
        <div class="error-line">
          Oh whoops, there was an
          <span class="red-error"> error </span>
          That was probably out fault.{" "}
        </div>
      </div>
    </div>
  );
}
