import React from "react";
import LeftNavbar from "./LeftNavbar";
import Navbar from "./Navbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    margin: "80px auto 0 auto",
    minWidth: "1250px",
    maxWidth: "1250px",
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
      <Box display="flex" className={classes.container}>
        <Box>
          <LeftNavbar />
        </Box>
        <Box className={classes.center}>
          <Typography className={classes.text}>
            Oops, there was an
            <span className={classes.error}> error</span>. This page doesn't
            exist!
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default NotFound;
