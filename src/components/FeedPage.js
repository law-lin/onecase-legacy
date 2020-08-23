import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { withAuthorization } from "./Session";
import LeftNavbar from "./LeftNavbar";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
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
import BottomNavbar from "./BottomNavbar";
import MediaQuery from "react-responsive";

const useStyles = makeStyles({
  root: {
    margin: "80px auto 0 auto",
    minWidth: "1250px",
    maxWidth: "1250px",
    display: "flex",
    padding: 0,
  },
  container: {
    display: "flex",
    minWidth: "650px",
    justifyContent: "center",
    alignItems: "center",
  },
  feed: {
    fontFamily: ["Montserrat", "sans-serif"],
    backgroundColor: "black",
    color: "white",
    fontSize: "30px",
    fontWeight: 800,
    borderRadius: "15px",
    alignSelf: "center",
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  categories: {
    minWidth: "280px",
    backgroundColor: "#232323",
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    borderRadius: "25px",
  },
  card: {
    minWidth: "500px",
    boxShadow: "none",
    borderWidth: "30px",
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
});

function FeedPage(props) {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  useEffect(() => {
    setLoading(true);
    props.firebase
      .getFollowing(props.firebase.auth.currentUser.uid)
      .once("value")
      .then((snapshot) => {
        console.log(snapshot);
        var promises = [];
        snapshot.forEach((snap) => {
          var results = [];
          results.push(
            props.firebase.getFeed(snap.key).once("value"),
            props.firebase.user(snap.key).once("value")
          );
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
          for (var key in snap[0].val()) {
            const date = new Date(snap[0].val()[key]);
            const dateCreated =
              monthNames[date.getMonth()] +
              " " +
              date.getDate() +
              ", " +
              date.getFullYear();

            let card = {
              cardID: key,
              dateCreated: dateCreated,
              timeCreated: snap[0].val()[key],
              name: snap[1].val().name,
              username: snap[1].val().username,
              profilePicture: snap[1].val().profilePicture,
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
        <Container className={classes.root}>
          <Box flex={1}>
            <Container className={classes.container}>Feed Stuff</Container>
          </Box>
          <Box flex={1}></Box>
        </Container>
        <BottomNavbar />
      </MediaQuery>
      <MediaQuery minWidth={1115} maxWidth={1399}>
        <Navbar />
        <Container className={classes.root}>
          <Box flex={1}>
            <LeftNavbar noText={true} />
          </Box>
          <Box flex={1}>
            <Container className={classes.container}>Feed Stuff</Container>
          </Box>
          <Box flex={1}></Box>
        </Container>
      </MediaQuery>
      <MediaQuery minWidth={1400}>
        <Navbar />
        <Container className={classes.root}>
          <Box flex={1}>
            <LeftNavbar />
          </Box>
          <Box flex={1}>
            <Card className={classes.feed}>Feed</Card>
            <Container className={classes.container}>
              {!loading && (
                <React.Fragment>
                  {cards && (
                    <List>
                      {cards.map((card) => {
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
                                      style={{ width: "75px", height: "75px" }}
                                    />
                                  </Link>
                                }
                                title={
                                  <Link
                                    href={"/" + card.username}
                                    className={classes.name}
                                  >
                                    {card.name}
                                  </Link>
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
                                    {card.lastUpdated && (
                                      <Typography
                                        className={classes.dateUpdated}
                                      >
                                        Last Edited: {card.dateUpdated}
                                      </Typography>
                                    )}
                                  </React.Fragment>
                                }
                              />
                              <CardContent
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <BridgeCard cardID={card.cardID}></BridgeCard>
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
          <Box flex={1}>
            <Container>
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
