import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import SearchBar from "material-ui-search-bar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SignOutButton from "./Profile/SignOutButton";
import Button from "@material-ui/core/Button";
import MediaQuery from "react-responsive";
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
    fontWeight: 700,
  },
  background: {
    backgroundColor: "#3e4e55",
  },
  search: {
    flexGrow: 1,
    margin: "0 10%",
    width: "50%",
  },
  menu: {
    "&:focus": {
      outline: "none",
    },
    marginLeft: "5%",
    color: "#FFFFFF",
    backgroundColor: "#3D3D3D",
    borderRadius: "15px",
    maxWidth: "50px",
  },
});

function Navbar(props) {
  const classes = useStyles();
  let history = useHistory();

  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);

    props.firebase.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        props.firebase.currentUser().once("value", (snapshot) => {
          if (snapshot) {
            setCurrentUser(true);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
      }
    });
  }, []);

  const queryDatabase = (query) => {
    window.location.href = "/search/?username=" + query;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar className={classes.background}>
      <Toolbar>
        <Link href="/feed" className={classes.root}>
          OneCase
        </Link>
        <MediaQuery minWidth={1115}>
          <SearchBar
            className={classes.search}
            onChange={(query) => setQuery(query)}
            onRequestSearch={() => queryDatabase(query)}
          />
        </MediaQuery>
        <MediaQuery maxWidth={1114}>
          <div className={classes.search} />
        </MediaQuery>
        {currentUser && (
          <React.Fragment>
            <Button className={classes.menu} onClick={handleClick}>
              Menu
            </Button>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem>
                <SignOutButton />
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
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
