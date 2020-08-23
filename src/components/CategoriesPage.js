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
});

function CategoriesPage(props) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
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
    setLoading(true);
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
      {valid && (
        <React.Fragment>
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
                <Card className={classes.category}>{categoryDisplay}</Card>
                <Container className={classes.container}>
                  <List>
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
                </Container>
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
    </div>
  );
}

export default withFirebase(CategoriesPage);
