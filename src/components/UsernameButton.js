import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((props) => ({
  root: {
    fontFamily: ["Montserrat", "sans-serif"],
    color: "#000000",
    fontWeight: 800,
    fontSize: (props) => (props.size === "small" ? "24px" : "30px"),
  },
  username: {
    display: "block",
    color: "#000000",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 700,
    fontSize: (props) => (props.size === "small" ? "18px" : "24px"),
  },
}));

function UsernameButton(props) {
  const classes = useStyles(props);
  return (
    <React.Fragment>
      <Link className={classes.root} href={"/" + props.username}>
        {props.name}
      </Link>
      <Typography className={classes.username}>@{props.username}</Typography>
    </React.Fragment>
  );
}

export default UsernameButton;
