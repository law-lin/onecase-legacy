import React, { Component } from "react";
import Navbar from "./Navbar";
import { withAuthorization } from "./Session";
import LeftNavbar from "./LeftNavbar";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    margin: "80px auto 0 auto",
    minWidth: "1250px",
    maxWidth: "1250px",
  },
  container: {
    display: "flex",
    width: "700px",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
  },
});

function FeedPage() {
  const classes = useStyles();

  return (
    <div>
      <Navbar />
      <Box display="flex" className={classes.root}>
        <Box flex={1}>
          <LeftNavbar />
        </Box>
        <Box flex={1}>
          <Container className={classes.container}>Feed Stuff</Container>
        </Box>
        <Box flex={1}></Box>
      </Box>
    </div>
  );
}

const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(FeedPage);
