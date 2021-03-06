import React, { useState, useEffect } from 'react';

import { ReactComponent as TwitterIcon } from './icons/twitter.svg';
import { ReactComponent as InstagramIcon } from './icons/instagram.svg';
import { ReactComponent as LinkedinIcon } from './icons/linkedin.svg';

import './landingpage.css';

import LandingPageNavbar from './LandingPageNavbar';

import lightbulb from '../images/lightbulb.png';
import scrapbook from '../images/scrapbook.png';
import community from '../images/community.png';

import one from '../images/one.png';
import two from '../images/two.png';
import three from '../images/three.png';
import newbackground from '../images/newbackground.png';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  Container,
  Typography,
  Box,
  Card,
  TextField,
} from '@material-ui/core';

const useStyles = makeStyles({
  button: {
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
    },
    '&:active': {
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(38, 143, 255, 0.5)',
      outline: 'none',
    },
    color: '#FFFFFF',
    display: 'inline-block',
    backgroundColor: '#007bff',
    fontFamily: ['Mukta Mahee', 'san-serif'],
    border: '1px solid transparent',
    borderColor: '#007bff',
    padding: '0.5rem 1rem',
    fontSize: '1.25rem',
    lineHeight: 1.5,
    borderRadius: '15px',
    transition:
      'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    fontWeight: 400,
    textTransform: 'none',
  },
  input: {
    padding: 5,
    fontSize: '24px',
    borderRadius: '5px',
    fontFamily: ['Mukta Mahee', 'sans-serif'],
    fontWeight: 700,
  },
  labelRoot: {
    fontFamily: ['Mukta Mahee', 'sans-serif'],
    fontSize: '24px',
    color: '#9F9F9F',
    left: '10px',
    '&$labelFocused': {
      color: '#3E4E55',
    },
  },
  labelFocused: {},
  heroContainer: {
    minWidth: '1500px',
    minHeight: '530px',
    background: `url(${newbackground}) no-repeat center/cover`,
    '@media (max-width: 750px)': {
      minWidth: '0px',
      background: `url(${newbackground}) no-repeat left center/1000px 500px`,
      maxWidth: '750px',
      overflow: 'hidden',
    },
  },
  heroContent: {
    maxWidth: '475px',
    marginLeft: '250px',
    padding: '125px 5px 0',
    '@media (max-width: 750px)': {
      maxWidth: '320px',
      marginLeft: '165px',
    },
  },
  showcasePassions: {
    color: '#FFFFFF',
    fontSize: '48px',
    textAlign: 'center',
    fontFamily: ['Montserrat', 'sans-serif'],
    fontWeight: 800,
    '@media (max-width: 750px)': {
      fontSize: '32px',
    },
  },
  oneLiner: {
    marginTop: '20px',
    color: '#FFFFFF',
    fontSize: '22px',
    textAlign: 'center',
    fontFamily: ['Montserrat', 'sans-serif'],
    fontWeight: 800,
    '@media (max-width: 750px)': {
      fontSize: '16px',
    },
  },
  joinWaitlist: {
    padding: 10,
    backgroundColor: '#3E4E55',
    fontFamily: ['Mukta Mahee', 'sans-serif'],
    color: '#FFFFFF',
    fontSize: '24px',
    textTransform: 'none',
    margin: '0 0 0 10px',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: '#5E7681',
    },
    '&:focus': {
      outline: 'none',
    },
  },
});
function LandingPage(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');

  const classes = useStyles();

  useEffect(() => {
    props.firebase.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        props.history.push('/feed');
      } else {
        setLoading(false);
      }
    });
  }, [props.firebase.auth, props.history]);

  const validateEmail = (email) => {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  };
  const handleSubmit = () => {
    if (validateEmail(waitlistEmail)) {
      props.firebase
        .checkDuplicateEmail(waitlistEmail)
        .on('value', (snapshot) => {
          if (snapshot.exists()) {
            setError('This email is already signed up!');
          } else {
            setError(null);
            props.firebase.earlyAccess(waitlistEmail);
            props.history.push('welcome');
          }
        });
    } else {
      setError('Please enter a valid email address.');
    }
  };
  if (!loading) {
    return (
      <React.Fragment>
        <CssBaseline />
        <LandingPageNavbar />
        <Container
          component='main'
          className={classes.heroContainer}
          style={{}}
        >
          <Box className={classes.heroContent}>
            <Typography className={classes.showcasePassions}>
              Showcase your passions
            </Typography>
            <Typography className={classes.oneLiner}>
              A Personal Archive + Social Network
            </Typography>
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <TextField
                margin='none'
                style={{
                  padding: 2,
                  borderRadius: 5,
                  backgroundColor: '#FFFFFF',
                  marginBottom: '20px',
                }}
                InputProps={{
                  classes: {
                    input: classes.input,
                  },
                  disableUnderline: true,
                }}
                InputLabelProps={{
                  classes: {
                    root: classes.labelRoot,
                    focused: classes.labelFocused,
                  },
                }}
                label='Email'
                onChange={(e) => setWaitlistEmail(e.target.value)}
                error={error}
                helperText={error}
              />
              <Button
                className={classes.joinWaitlist}
                style={{ backgroundColor: '#00A1E5', fontSize: '20px' }}
                onClick={handleSubmit}
              >
                Join Waitlist
              </Button>
            </div>
          </Box>
        </Container>
        <Container component='main'>
          <Box
            display='flex'
            justifyContent='center'
            style={{ marginTop: '150px' }}
          >
            <Typography
              align='center'
              style={{
                backgroundColor: '#232323',
                padding: '25px 10px',
                borderRadius: 9,
                color: '#7B7B7B',
                fontFamily: ['Montserrat', 'sans-serif'],
                fontWeight: 800,
                width: '75%',
                fontSize: 30,
              }}
            >
              We're an{' '}
              <span style={{ color: '#FFFFFF' }}>online scrapbook</span> or{' '}
              <span style={{ color: '#FFFFFF' }}>portfolio</span>, with{' '}
              <span style={{ color: '#FFFFFF' }}>friends</span>
            </Typography>
          </Box>
          <Grid container style={{ marginTop: '150px' }}>
            <Grid item xs={12} sm={4} align='center'>
              <img
                style={{ width: '100px', height: '100px' }}
                src={scrapbook}
                alt='scrapbook'
              />
              <Card
                style={{
                  backgroundColor: '#3E4E55',
                  borderRadius: 9,
                  width: '90%',
                  minHeight: 150,
                }}
              >
                <Typography
                  style={{
                    fontFamily: ['Montserrat', 'sans-serif'],
                    color: '#FFFFFF',
                    fontWeight: 800,
                    padding: 15,
                    fontSize: 25,
                  }}
                >
                  Your Own Page
                </Typography>
                <Typography
                  style={{
                    fontFamily: ['Mukta Mahee', 'sans-serif'],
                    color: '#FFFFFF',
                    padding: 10,
                    fontSize: 16,
                  }}
                >
                  Let OneCase serve as your one-stop shop to display all your
                  favorite projects and things
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} align='center'>
              <img
                style={{ width: '100px', height: '100px' }}
                src={lightbulb}
                alt='lightbulb'
              />
              <Card
                style={{
                  backgroundColor: '#3E4E55',
                  borderRadius: 9,
                  width: '90%',
                  minHeight: 150,
                }}
              >
                <Typography
                  style={{
                    fontFamily: ['Montserrat', 'sans-serif'],
                    color: '#FFFFFF',
                    fontWeight: 800,
                    padding: 15,
                    fontSize: 25,
                  }}
                >
                  Interest Oriented
                </Typography>
                <Typography
                  style={{
                    fontFamily: ['Mukta Mahee', 'sans-serif'],
                    color: '#FFFFFF',
                    padding: 10,
                    fontSize: 16,
                  }}
                >
                  Upload content based on your interests and explore what other
                  people are into
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} align='center'>
              <img
                style={{ width: '100px', height: '100px' }}
                src={community}
                alt='community'
              />
              <Card
                style={{
                  backgroundColor: '#3E4E55',
                  borderRadius: 9,
                  width: '90%',
                  minHeight: 150,
                }}
              >
                <Typography
                  style={{
                    fontFamily: ['Montserrat', 'sans-serif'],
                    color: '#FFFFFF',
                    fontWeight: 800,
                    padding: 15,
                    fontSize: 25,
                  }}
                >
                  Creative Motivation
                </Typography>
                <Typography
                  style={{
                    fontFamily: ['Mukta Mahee', 'sans-serif'],
                    color: '#FFFFFF',
                    padding: 10,
                    fontSize: 16,
                  }}
                >
                  Get inspo from your friends/strangers, collaborate, and
                  try/learn new things
                </Typography>
              </Card>
            </Grid>
          </Grid>
          <Box
            display='flex'
            justifyContent='center'
            style={{ marginTop: '150px' }}
          >
            <Typography
              align='center'
              style={{
                color: '#232323',
                fontFamily: ['Montserrat', 'sans-serif'],
                fontWeight: 800,
                fontSize: 60,
              }}
            >
              TLDR...
            </Typography>
          </Box>
          <Grid container style={{ marginTop: '150px' }} spacing={3}>
            <Grid item xs={12} sm={4} align='center'>
              <Typography
                style={{
                  color: '#FFFFFF',
                  backgroundColor: '#232323',
                  fontFamily: ['Montserrat', 'sans-serif'],
                  fontWeight: 800,
                  fontSize: 36,
                  borderRadius: 9,
                  width: '80%',
                  padding: 10,
                }}
              >
                Pick A Theme
              </Typography>
              <img
                src={one}
                style={{ width: '100%', maxWidth: '300px', marginTop: '40px' }}
                alt='pick a theme'
              />
            </Grid>
            <Grid item xs={12} sm={4} align='center'>
              <Typography
                style={{
                  color: '#FFFFFF',
                  backgroundColor: '#232323',
                  fontFamily: ['Montserrat', 'sans-serif'],
                  fontWeight: 800,
                  fontSize: 36,
                  borderRadius: 9,
                  width: '80%',
                  padding: 10,
                }}
              >
                Create Cards
              </Typography>
              <img
                src={two}
                style={{ width: '95%', maxWidth: '300px', marginTop: '40px' }}
                alt='create cards'
              />
            </Grid>
            <Grid item xs={12} sm={4} align='center'>
              <Typography
                style={{
                  color: '#FFFFFF',
                  backgroundColor: '#232323',
                  fontFamily: ['Montserrat', 'sans-serif'],
                  fontWeight: 800,
                  fontSize: 36,
                  borderRadius: 9,
                  width: '80%',
                  padding: 10,
                }}
              >
                Display Them
              </Typography>
              <img
                src={three}
                style={{ width: '100%', maxWidth: '300px', marginTop: '40px' }}
                alt='display them'
              />
            </Grid>
          </Grid>
        </Container>
        <div style={{ backgroundColor: '#232323' }}>
          <Container component='footer'>
            <Grid
              container
              style={{
                marginTop: '150px',
                minHeight: '150px',
                color: '#FFFFFF',
                fontSize: 20,
              }}
              spacing={3}
            >
              <Grid item xs={12} style={{ margin: '0 7% 0 7%' }} align='center'>
                <Typography
                  style={{
                    color: '#FFFFFF',
                    fontFamily: ['Montserrat', 'sans-serif'],
                    fontWeight: 800,
                    fontSize: 36,
                    padding: 10,
                  }}
                >
                  How do I try it out?
                </Typography>
                <Typography
                  style={{
                    color: '#FFFFFF',
                    fontFamily: ['Mukta Mahee', 'sans-serif'],
                    fontWeight: 500,
                    fontSize: 24,
                    padding: 10,
                  }}
                >
                  Sign up here to join the waitlist, you won't regret it.
                </Typography>
                <div style={{ marginTop: '10px' }}>
                  <TextField
                    margin='none'
                    style={{
                      padding: 2,
                      borderRadius: 5,
                      backgroundColor: '#FFFFFF',
                      marginBottom: '30px',
                    }}
                    InputProps={{
                      classes: {
                        input: classes.input,
                      },
                      disableUnderline: true,
                    }}
                    InputLabelProps={{
                      classes: {
                        root: classes.labelRoot,
                        focused: classes.labelFocused,
                      },
                    }}
                    label='Email'
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    error={error}
                    helperText={error}
                  />
                  <Button
                    className={classes.joinWaitlist}
                    onClick={handleSubmit}
                  >
                    Join Waitlist
                  </Button>
                </div>
              </Grid>
              <Grid
                container
                item
                xs={12}
                align='center'
                style={{ margin: '2.5% 7% 2% 7%' }}
              >
                <Grid container item xs={12} sm={8} align='center'>
                  {/* <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
                    <span className="footer-links">About Us</span>
                  </Grid>
                  <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
                    <span className="footer-links">Terms of Service</span>
                  </Grid>
                  <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
                    <span className="footer-links">Privacy Policy </span>
                  </Grid>
                  <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
                    <span className="footer-links">Contact</span>
                  </Grid> */}
                </Grid>
                <Grid item xs={12} sm={2} />
                <Grid
                  item
                  xs={12}
                  sm={2}
                  align='center'
                  style={{ marginTop: '10px' }}
                >
                  {/* Icons provided by https://icons8.com */}
                  <a
                    target='_window'
                    href='https://twitter.com/onecaseapp'
                    className='social-media-icons'
                  >
                    <TwitterIcon />
                  </a>
                  <a
                    target='_window'
                    href='https://www.instagram.com/onecaseapp/'
                    className='social-media-icons'
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    target='_window'
                    href='https://www.linkedin.com/company/onecaseapp/'
                    className='social-media-icons'
                  >
                    <LinkedinIcon />
                  </a>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </div>
      </React.Fragment>
    );
  } else {
    return null;
  }
}

export default withFirebase(withRouter(LandingPage));
