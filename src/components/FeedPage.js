import React, { useEffect, useState } from "react";

import Navbar from "./Navbar";
import LeftNavbar from "./LeftNavbar";
import BottomNavbar from "./BottomNavbar";

import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import MediaQuery from "react-responsive";
import CategoriesCard from "./CategoriesCard";
import BridgeCard from "./Profile/BridgeCard";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";

import { makeStyles } from "@material-ui/core/styles";

import { withAuthorization } from "./Session";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    margin: "80px auto 0 auto",
    display: "flex",
    justifyContent: "center",
    padding: 0,
  },
  feed: {
    textTransform: "none",
    fontFamily: ["Montserrat", "sans-serif"],
    backgroundColor: "#000000",
    color: "#FFFFFF",
    fontSize: "24px",
    fontWeight: 800,
    borderRadius: "15px",
    alignSelf: "center",
    width: "50%",
    textAlign: "center",
    margin: "10px",
    boxShadow: "none",
  },
  header: {
    textTransform: "none",
    fontFamily: ["Montserrat", "sans-serif"],
    backgroundColor: "#FFFFFF",
    color: "#000000",
    fontSize: "24px",
    fontWeight: 800,
    borderRadius: "15px",
    alignSelf: "center",
    width: "40%",
    textAlign: "center",
    margin: "10px",
    boxShadow: "none",
  },
  headerButton: {
    "&:hover": {
      backgroundColor: "#232323",
    },
    "&:focus": {
      outline: "none",
    },
    textTransform: "none",
    fontFamily: ["Montserrat", "sans-serif"],
    backgroundColor: "#000000",
    color: "white",
    fontSize: "24px",
    fontWeight: 800,
    borderRadius: "15px",
    alignSelf: "center",
    width: "50%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "10px",
  },
  categories: {
    minWidth: "280px",
    backgroundColor: "#232323",
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    borderRadius: "25px",
  },
  card: {
    boxShadow: "none",
    borderWidth: "30px",
    width: "100%",
  },
  name: {
    "&:hover": {
      textDecoration: "none",
      color: "#000000",
    },
    "&:active": {
      outline: "none",
      color: "#adadad",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    fontSize: "24px",
    color: "#000000",
  },
  username: {
    color: "#434343",
    fontSize: "18px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 600,
  },
  date: {
    fontSize: "20px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
  },
  dateUpdated: {
    fontSize: "15px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
  },
  emptyFeed: {
    fontSize: "50px",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 700,
    marginTop: "50px",
  },
  addedTo: {
    display: "inline",
    fontFamily: ["Montserrat", "sans-serif"],
  },
  categoryLink: {
    "&:hover": {
      textDecoration: "none",
      color: "#094153",
    },
    "&:active": {
      outline: "none",
      color: "#adadad",
    },
    "&:focus": {
      outline: "none",
    },
    textDecoration: "none",
    color: "#094153",
    fontWeight: 700,
  },
});

function FeedPage(props) {
  const classes = useStyles();

  const [showTrending, setShowTrending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  useEffect(() => {
    setLoading(true);
    props.firebase
      .getFollowing(props.firebase.auth.currentUser.uid)
      .once("value")
      .then((snapshot) => {
        var promises = [];
        snapshot.forEach((snap) => {
          promises.push(props.firebase.getFeed(snap.key).once("value"));
        });
        return Promise.all(promises);
      })
      .then((snapshot) => {
        var promises = [];
        snapshot.forEach((snap) => {
          var results = [];
          results.push(props.firebase.user(snap.key).once("value"));
          for (var key in snap.val()) {
            results.push(props.firebase.bridgeCards(key).once("value"));
          }
          promises.push(Promise.all(results));
        });
        return Promise.all(promises);
      })
      .then((snapshot) => {
        var posts = [];
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        snapshot.forEach((snap) => {
          for (let i = 1; i < snap.length; i++) {
            let bridgeCard = snap[i];
            const date = new Date(bridgeCard.val().timeCreated);
            const dateCreated =
              monthNames[date.getMonth()] +
              " " +
              date.getDate() +
              ", " +
              date.getFullYear();

            let card = {
              cardID: bridgeCard.key,
              category: bridgeCard.val().category,
              dateCreated: dateCreated,
              timeCreated: bridgeCard.val().timeCreated,
              name: snap[0].val().name,
              username: snap[0].val().username,
              profilePicture: snap[0].val().profilePicture,
            };
            posts.push(card);
          }
        });
        posts = posts.sort((a, b) => {
          return b["timeCreated"] - a["timeCreated"];
        });
        setCards(posts);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <MediaQuery maxWidth={1114}>
        <Navbar />
        <Container className={classes.root} style={{ margin: "80px 0" }}>
          <Box style={{ width: "100%" }}>
            <Box display="flex" justifyContent="flex-end">
              <Card className={classes.header}>Feed</Card>
              <Button
                className={classes.headerButton}
                onClick={() => setShowTrending(!showTrending)}
              >
                {!showTrending ? (
                  <span>
                    Trending <IoMdArrowDropright />
                  </span>
                ) : (
                  <span>
                    <IoMdArrowDropleft /> Feed
                  </span>
                )}
              </Button>
            </Box>
            <Box>
              {!showTrending && (
                <Container className={classes.container}>
                  {!loading && (
                    <React.Fragment>
                      {cards && (
                        <List style={{ width: "100%" }}>
                          {cards.map((card) => {
                            console.log(card.name);
                            return (
                              <ListItem>
                                <Card
                                  classes={{ root: classes.card }}
                                  key={card.cardID}
                                >
                                  <CardHeader
                                    avatar={
                                      <Link href={"/" + card.username}>
                                        <Avatar
                                          src={card.profilePicture}
                                          style={{
                                            width: "75px",
                                            height: "75px",
                                          }}
                                        />
                                      </Link>
                                    }
                                    title={
                                      <React.Fragment>
                                        <Link
                                          href={"/" + card.username}
                                          className={classes.name}
                                          style={{ fontSize: "20px" }}
                                        >
                                          {card.name}
                                        </Link>
                                        <Typography className={classes.addedTo}>
                                          {" "}
                                          added a card to{" "}
                                        </Typography>
                                        <Link
                                          href={"/categories/" + card.category}
                                          className={classes.categoryLink}
                                        >
                                          {card.category.replace(/_/g, " ")}
                                        </Link>
                                      </React.Fragment>
                                    }
                                    subheader={
                                      <Typography
                                        className={classes.username}
                                        style={{ fontSize: "16px" }}
                                      >
                                        @{card.username}
                                      </Typography>
                                    }
                                    action={
                                      <React.Fragment>
                                        <Typography
                                          className={classes.date}
                                          style={{ fontSize: "16px" }}
                                        >
                                          {card.dateCreated}
                                        </Typography>
                                      </React.Fragment>
                                    }
                                  />
                                  <CardContent
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <BridgeCard
                                      size={"200px"}
                                      cardID={card.cardID}
                                      name={card.name}
                                      username={card.username}
                                      profilePicture={card.profilePicture}
                                      timeCreated={card.dateCreated}
                                      lastUpdated={card.dateUpdated}
                                    ></BridgeCard>
                                  </CardContent>
                                </Card>
                              </ListItem>
                            );
                          })}
                        </List>
                      )}
                      {cards.length === 0 && (
                        <Typography className={classes.emptyFeed}>
                          Your feed is empty. Try following someone!
                        </Typography>
                      )}
                    </React.Fragment>
                  )}
                </Container>
              )}
              {showTrending && (
                <Container>
                  <CategoriesCard />
                </Container>
              )}
            </Box>
          </Box>
        </Container>
        <BottomNavbar />
      </MediaQuery>
      <MediaQuery minWidth={1115}>
        <Navbar />
        <Container className={classes.root}>
          <LeftNavbar />
          <Box flex={1}>
            <Box display="flex" justifyContent="center">
              <Card className={classes.feed}>Feed</Card>
            </Box>
            <Box>
              <Container
                className={classes.container}
                style={{ minWidth: "650px" }}
              >
                {!loading && (
                  <React.Fragment>
                    {cards && (
                      <List style={{ width: "100%" }}>
                        {cards.map((card) => {
                          console.log(card.name);
                          return (
                            <ListItem>
                              <Card
                                classes={{ root: classes.card }}
                                key={card.cardID}
                              >
                                <CardHeader
                                  avatar={
                                    <Link href={"/" + card.username}>
                                      <Avatar
                                        src={card.profilePicture}
                                        style={{
                                          width: "75px",
                                          height: "75px",
                                        }}
                                      />
                                    </Link>
                                  }
                                  title={
                                    <React.Fragment>
                                      <Link
                                        href={"/" + card.username}
                                        className={classes.name}
                                      >
                                        {card.name}
                                      </Link>
                                      <Typography className={classes.addedTo}>
                                        {" "}
                                        added a card to{" "}
                                      </Typography>
                                      <Link
                                        href={"/categories/" + card.category}
                                        className={classes.categoryLink}
                                      >
                                        {card.category.replace(/_/g, " ")}
                                      </Link>
                                    </React.Fragment>
                                  }
                                  subheader={
                                    <Typography className={classes.username}>
                                      @{card.username}
                                    </Typography>
                                  }
                                  action={
                                    <React.Fragment>
                                      <Typography className={classes.date}>
                                        {card.dateCreated}
                                      </Typography>
                                    </React.Fragment>
                                  }
                                />
                                <CardContent
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <BridgeCard
                                    size={"200px"}
                                    cardID={card.cardID}
                                    name={card.name}
                                    username={card.username}
                                    profilePicture={card.profilePicture}
                                    timeCreated={card.dateCreated}
                                    lastUpdated={card.dateUpdated}
                                  ></BridgeCard>
                                </CardContent>
                              </Card>
                            </ListItem>
                          );
                        })}
                      </List>
                    )}
                    {cards.length === 0 && (
                      <Typography className={classes.emptyFeed}>
                        Your feed is empty. Try following someone!
                      </Typography>
                    )}
                  </React.Fragment>
                )}
              </Container>
            </Box>
          </Box>
          <Box flex={1}>
            <Container style={{ minWidth: "360px" }}>
              <CategoriesCard />
            </Container>
          </Box>
        </Container>
      </MediaQuery>
    </div>
  );
}

const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(FeedPage);
