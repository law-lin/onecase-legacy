import React from "react";

import "./landingpage.css";
import Navbar from "./Navbar";
export default function WelcomePage() {
  return (
    <div>
      <Navbar />
      <div className="center-screen">
        <div className="welcome-line">
          Your email is now on the list! Thanks for signing up for
          <span className="website-name"> OneCase's </span>
          Early Access, that was a pretty cool thing to do. We'll be in touch.
        </div>
      </div>
    </div>
  );
}
