import React from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  display: {
    display: "inline-block",
    fontSize: "26px",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
  },
});
function Name(props) {
  const classes = useStyles();

  return <Typography className={classes.display}>{props.name}</Typography>;
}

export default Name;
