import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import upleft from "../images/up-left.png";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#C4C4C4",
    },
    "&:active": {
      outline: "none",
      backgroundColor: "#9e9e9e",
    },
    backgroundColor: "#ACABAB",
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    textAlign: "center",
    fontSize: "20px",
    color: "#FFFFFF",
    borderRadius: "15px",
    width: "25%",
    height: "30%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "0 auto",
  },
});
const BackButton = (props) => {
  const classes = useStyles();
  let history = useHistory();
  return (
    <div className={classes.root}>
      <Link href={"/" + props.username}>
        <img width="40px" src={upleft} />
      </Link>
    </div>
  );
};

export default BackButton;
