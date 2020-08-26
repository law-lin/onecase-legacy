import React, { useState, useEffect } from "react";
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
import Button from "@material-ui/core/Button";

import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";

import BridgeCardContent from "./Profile/BridgeCardContent";
import { Route } from "react-router-dom";

import * as ROUTES from "../constants/routes";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavbar from "./BottomNavbar";
import MediaQuery from "react-responsive";
import { useParams } from "react-router-dom";
import { withFirebase } from "./Firebase";

import NotFound from "./NotFound";

const useStyles = makeStyles({
  root: {
    margin: "80px auto 0 auto",
    display: "flex",
    justifyContent: "center",
    padding: 0,
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
    width: "50%",
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
  category: {
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
});

function CategoriesPage(props) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [showTrending, setShowTrending] = useState(false);

  const classes = useStyles();

  const category = useParams().category.toLowerCase();
  const categoryDisplay = category
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

  useEffect(() => {
    if (ROUTES.CATEGORIES.includes(category)) {
      setValid(true);
    }
    setCards(
      props.firebase.getCardsInCategory(category).then((results) => {
        var cards = [];
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
        results.forEach((result) => {
          const dateC = new Date(result[1].val().timeCreated);
          const dateU = new Date(result[1].val().lastUpdated);
          const dateCreated =
            monthNames[dateC.getMonth()] +
            " " +
            dateC.getDate() +
            ", " +
            dateC.getFullYear();
          const dateUpdated =
            monthNames[dateU.getMonth()] +
            " " +
            dateU.getDate() +
            ", " +
            dateU.getFullYear();

          let card = {
            userID: result[0].key,
            name: result[0].val().name,
            username: result[0].val().username,
            profilePicture: result[0].val().profilePicture,
            cardID: result[1].key,
            bridgeCardTitle: result[1].val().bridgeCardTitle,
            caption: result[1].val().caption,
            description: result[1].val().description,
            timeCreated: result[1].val().timeCreated,
            lastUpdated: result[1].val().lastUpdated,
            dateCreated: dateCreated,
            dateUpdated: dateUpdated,
          };
          cards.push(card);
        });
        cards = cards.sort((a, b) => {
          return a - b;
        });
        setCards(cards);
        setLoading(false);
      })
    );
  }, [props.firebase, category]);

  return (
    <div>
      {!loading && (
        <React.Fragment>
          {valid && (
            <React.Fragment>
              <MediaQuery maxWidth={1114}>
                <Navbar />
                <Container
                  className={classes.root}
                  style={{ margin: "80px 0" }}
                >
                  <Box style={{ width: "100%" }}>
                    <Box display="flex" justifyContent="flex-end">
                      <Card className={classes.header}>{categoryDisplay}</Card>
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
                            <IoMdArrowDropleft /> {categoryDisplay}
                          </span>
                        )}
                      </Button>
                    </Box>
                    <Box>
                      {!showTrending && (
                        <List style={{ width: "100%" }}>
                          {!loading &&
                            cards.map((card) => {
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
                                        <Link
                                          href={"/" + card.username}
                                          className={classes.name}
                                        >
                                          {card.name}
                                        </Link>
                                      }
                                      subheader={
                                        <Typography
                                          className={classes.username}
                                        >
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
                      {showTrending && (
                        <Container>
                          <CategoriesCard />
                        </Container>
                      )}
                    </Box>
                  </Box>
                  <Box></Box>
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
                    <Container
                      className={classes.container}
                      style={{ minWidth: "650px" }}
                    >
                      <Card className={classes.category}>
                        {categoryDisplay}
                      </Card>
                      <List style={{ width: "100%" }}>
                        {!loading &&
                          cards.map((card) => {
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
                    </Container>
                  </Box>
                  <Box flex={1}>
                    <Container>
                      <CategoriesCard />
                    </Container>
                  </Box>
                </Container>
              </MediaQuery>
              <MediaQuery minWidth={1400}>
                <Navbar />
                <Container className={classes.root}>
                  <Box flex={1}>
                    <LeftNavbar />
                  </Box>
                  <Box flex={1}>
                    <Box display="flex" justifyContent="center">
                      <Card className={classes.category}>
                        {categoryDisplay}
                      </Card>
                    </Box>
                    <Box>
                      <Container
                        className={classes.container}
                        style={{ minWidth: "650px" }}
                      >
                        <List style={{ width: "100%" }}>
                          {!loading &&
                            cards.map((card) => {
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
                                        <Link
                                          href={"/" + card.username}
                                          className={classes.name}
                                        >
                                          {card.name}
                                        </Link>
                                      }
                                      subheader={
                                        <Typography
                                          className={classes.username}
                                        >
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
                      </Container>
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Container>
                      <CategoriesCard />
                    </Container>
                  </Box>
                </Container>
              </MediaQuery>
            </React.Fragment>
          )}
          {!valid && <NotFound />}
        </React.Fragment>
      )}
    </div>
  );
}

const condition = (authenticated) => !!authenticated;

export default withFirebase(withAuthorization(condition)(CategoriesPage));
