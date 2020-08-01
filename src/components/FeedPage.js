import React, { Component } from "react";
import Navbar from "./Navbar";
import { withAuthorization } from "./Session";
import LeftNavbar from "./LeftNavbar";
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    margin: "0 auto",
    minWidth: "1224px",
    maxWidth: "1800px",
  },
});

function FeedPage() {
  const classes = useStyles();

  return (
    <div>
      <Navbar />
      <Grid container className={classes.root}>
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
