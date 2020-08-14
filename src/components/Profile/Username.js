import React from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  display: {
    fontSize: "18px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 600,
  },
});

function Username(props) {
  const classes = useStyles();

  return (
    <Typography className={classes.display} style={{ display: props.display }}>
      @{props.username}
    </Typography>
  );
}

export default Username;
