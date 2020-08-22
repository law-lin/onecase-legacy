import React, { Component } from "react";
import Navbar from "./Navbar";
import { withAuthorization } from "./Session";
import LeftNavbar from "./LeftNavbar";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import CategoriesCard from "./CategoriesCard";

import { makeStyles } from "@material-ui/core/styles";
import BottomNavbar from "./BottomNavbar";
import MediaQuery from "react-responsive";

const useStyles = makeStyles({
  root: {
    margin: "80px auto 0 auto",
    minWidth: "1250px",
    maxWidth: "1250px",
    display: "flex",
    padding: 0,
  },
  container: {
    display: "flex",
    maxWidth: "650px",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
  },
  categories: {
    minWidth: "280px",
    backgroundColor: "#232323",
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    borderRadius: "25px",
  },
});

export default function Template() {
  const classes = useStyles();
  return (
    <div>
      <MediaQuery maxWidth={1114}>
        <Navbar />
        <Container className={classes.root}>
          <Box flex={1}>
            <Container className={classes.container}>Feed Stuff</Container>
          </Box>
          <Box flex={1}></Box>
        </Container>
        <BottomNavbar />
      </MediaQuery>
      <MediaQuery minWidth={1115} maxWidth={1399}>
        <Navbar />
        <Container className={classes.root}>
          <Box flex={1}>
            <LeftNavbar noText={true} />
          </Box>
          <Box flex={1}>
            <Container className={classes.container}>Feed Stuff</Container>
          </Box>
          <Box flex={1}></Box>
        </Container>
      </MediaQuery>
      <MediaQuery minWidth={1400}>
        <Navbar />
        <Container className={classes.root}>
          <Box flex={1}>
            <LeftNavbar />
          </Box>
          <Box flex={1}>
            <Container className={classes.container}>Feed Stuff</Container>
          </Box>
          <Box flex={1}>
            <Container className={classes.container}>
              <CategoriesCard />
            </Container>
          </Box>
        </Container>
      </MediaQuery>
    </div>
  );
}
