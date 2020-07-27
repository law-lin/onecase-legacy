import React, { Component } from "react";
import Navbar from "./Navbar";
import { withAuthorization } from "./Session";
import LeftNavbar from "./LeftNavbar";
import Grid from "@material-ui/core/Grid";

function FeedPage() {
  return (
    <div>
      <Navbar />
      <Grid container>
        <Grid item sm={2}>
          <LeftNavbar />
        </Grid>
        <Grid item sm={10}>
          Feed Stuff
        </Grid>
      </Grid>
    </div>
  );
}

const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(FeedPage);
