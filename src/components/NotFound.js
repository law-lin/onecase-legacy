import React from "react";
import LeftNavbar from "./LeftNavbar";
import Navbar from "./Navbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavbar from "./BottomNavbar";
import { Container } from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    margin: "80px auto 0 auto",
    display: "flex",
    justifyContent: "center",
    padding: 0,
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
  },
  text: {
    width: "700px",
    fontSize: "3vh",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    fontWeight: "bolder",
    color: "red",
  },
});
function NotFound() {
  const classes = useStyles();

  return (
    <div className="bg">
      <Navbar />
      <Container className={classes.container}>
        <LeftNavbar />
        <Box className={classes.center} flex={3}>
          <Typography className={classes.text}>
            Oops, there was an
            <span className={classes.error}> error</span>. This page doesn't
            exist!
          </Typography>
        </Box>
      </Container>

      <BottomNavbar />
    </div>
  );
}

export default NotFound;
