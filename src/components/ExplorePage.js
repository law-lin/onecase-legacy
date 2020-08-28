import React, { useState } from "react";

import MediaQuery from "react-responsive";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Navbar from "./Navbar";
import SearchBar from "material-ui-search-bar";
import CategoriesCard from "./CategoriesCard";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { makeStyles } from "@material-ui/styles";
import LeftNavbar from "./LeftNavbar";
import BottomNavbar from "./BottomNavbar";

const useStyles = makeStyles({
  root: {
    margin: "100px 10px 0 10px",
    backgroundColor: "#3D3D3D",
  },
  container: {
    margin: "80px auto 0 auto",
    display: "flex",
    justifyContent: "center",
    padding: 0,
  },
  input: {
    fontFamily: ["Mukta Mahee", "sans-serif"],
    backgroundColor: "#3D3D3D",
    color: "#D3D3D3",
    borderRadius: "5px",
  },
  button: {
    "&:focus": {
      outline: "none",
    },
    color: "#FFFFFF",
  },
  card: {
    maxWidth: "700px",
  },
});
function ExplorePage() {
  const classes = useStyles();
  const [query, setQuery] = useState("");

  const queryDatabase = (query) => {
    window.location.href = "/search/?username=" + query;
  };
  return (
    <div>
      <Navbar />
      <Container className={classes.container}>
        <LeftNavbar />
        <Box flex={3}>
          <MediaQuery maxWidth={1114}>
            <Container style={{ maxWidth: "700px" }}>
              <SearchBar
                classes={{
                  iconButton: classes.button,
                }}
                className={classes.root}
                inputProps={{ className: classes.input }}
                style={{ marginTop: "100px" }}
                onChange={(query) => setQuery(query)}
                onRequestSearch={() => queryDatabase(query)}
                searchIcon={<IoMdSearch />}
                closeIcon={<IoMdClose />}
              />
            </Container>
          </MediaQuery>
          <Container className={classes.card}>
            <CategoriesCard />
          </Container>
        </Box>
      </Container>
      <BottomNavbar />
    </div>
  );
}

export default ExplorePage;
