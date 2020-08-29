import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((props) => ({
  root: {
    display: "block",
    color: "#000000",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 700,
    fontSize: (props) => (props.size === "small" ? "18px" : "24px"),
  },
  name: {
    fontFamily: ["Montserrat", "sans-serif"],
    color: "#000000",
    fontWeight: 800,
    fontSize: (props) => (props.size === "small" ? "24px" : "30px"),
  },
}));

function UsernameButton(props) {
  const classes = useStyles(props);
  return (
    <React.Fragment>
      <Typography className={classes.name}>{props.name}</Typography>
      <Link className={classes.root} href={"/" + props.username}>
        @{props.username}
      </Link>
    </React.Fragment>
  );
}

export default UsernameButton;
