import React from "react";

import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#C4C4C4",
    },
    "&:focus": {
      outline: "none",
    },
    backgroundColor: "#ACABAB",
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    color: "#FFFFFF",
    borderRadius: "15px",
    width: "25%",
    height: "25%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "0 auto",
  },
});
const BackButton = () => {
  const classes = useStyles();
  let history = useHistory();
  return (
    <Button className={classes.root} onClick={() => history.goBack()}>
      Back
    </Button>
  );
};

export default BackButton;
