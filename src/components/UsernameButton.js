import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((props) => ({
  root: {
    display: "block",
    color: "#000000",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 700,
    fontSize: (props) => (props.size === "small" ? "20px" : "32px"),
  },
}));

function UsernameButton(props) {
  const classes = useStyles(props);
  return (
    <Link className={classes.root} href={"/" + props.username}>
      {props.username}
    </Link>
  );
}

export default UsernameButton;
