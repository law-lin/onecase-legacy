import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  display: {
    paddingTop: "10px",
    height: "70px",
    fontSize: "16px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    whiteSpace: "pre-line",
  },
});

function Biography(props) {
  const classes = useStyles();

  return (
    <Typography
      className={classes.display}
      style={{ marginLeft: props.margin }}
    >
      {props.bio}
    </Typography>
  );
}

export default Biography;
