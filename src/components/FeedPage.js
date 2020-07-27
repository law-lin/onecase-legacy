import React, { Component } from "react";
import Navbar from "./Navbar";
import { withAuthorization } from "./Session";
import LeftNavbar from "./LeftNavbar";

class FeedPage extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <LeftNavbar />
      </div>
    );
  }
}

const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(FeedPage);
