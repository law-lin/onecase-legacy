import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import { TiArrowBack } from "react-icons/ti";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#C4C4C4",
      color: "#000000",
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
    color: "#000000",
    borderRadius: "15px",
    width: "25%",
    height: "30%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
});
const BackButton = (props) => {
  const classes = useStyles();
  let history = useHistory();
  return (
    <Link className={classes.root} href={"/" + props.username}>
      <TiArrowBack style={{ width: "40px", height: "40px" }} />
    </Link>
  );
};

export default BackButton;
