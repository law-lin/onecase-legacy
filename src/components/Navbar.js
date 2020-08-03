import React, { useState } from "react";
import Link from "@material-ui/core/Link";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import SearchBar from "material-ui-search-bar";

import "./landingpage.css";

import { withFirebase } from "./Firebase";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      color: "#aaeef2",
      textDecoration: "none",
      textShadow: "2px 2px transparent",
    },
    fontFamily: ["Mukta Mahee", "sans-serif"],
    color: "#d4f1f3",
    textDecoration: "none",
    textShadow: "2px 2px black",
    fontSize: "48px",
    paddingLeft: "30px",
    fontWeight: 700,
  },
  background: {
    backgroundColor: "#3e4e55",
  },
  search: {
    marginLeft: "15%",
    width: "50%",
  },
});

function Navbar(props) {
  const classes = useStyles();
  let history = useHistory();
  const [query, setQuery] = useState("");

  const queryDatabase = (query) => {
    window.location.href = "/search/?username=" + query;
  };
  return (
    <AppBar className={classes.background}>
      <Toolbar>
        <Link href="/feed" className={classes.root}>
          OneCase
        </Link>
        <SearchBar
          className={classes.search}
          onChange={(query) => setQuery(query)}
          onRequestSearch={() => queryDatabase(query)}
        />
      </Toolbar>
    </AppBar>
    // <nav className="zone top">
    //   <ul className="main-nav">
    //     <li className="logo">
    //       <Link href="/feed" className={classes.root}>
    //         OneCase
    //       </Link>
    //     </li>
    //     <li>
    //       <SearchBar />
    //     </li>
    //   </ul>
    // </nav>
  );
}

export default withFirebase(Navbar);
