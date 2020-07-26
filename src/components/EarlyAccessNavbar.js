import React from "react";
import Link from "@material-ui/core/Link";

import "./landingpage.css";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      color: "#aaeef2",
      textDecoration: "none",
      textShadow: "2px 2px transparent",
    },
    color: "#d4f1f3",
    textDecoration: "none",
    textShadow: "2px 2px black",
  },
});

function EarlyAccessNavbar() {
  const classes = useStyles();
  return (
    <nav className="zone top">
      <ul className="main-nav">
        <li className="logo">
          <Link href="/" className={classes.root}>
            OneCase
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default EarlyAccessNavbar;
