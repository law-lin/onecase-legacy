import React, { Component } from "react";
import Navbar from "./Navbar";
import { withAuthorization } from "./Session";

class FeedPage extends Component {
  render() {
    return (
      <div>
        <Navbar />
        FeedPage
      </div>
    );
  }
}

const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(FeedPage);
