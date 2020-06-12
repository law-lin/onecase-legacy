import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles({
  root: {
    width: 350,
    height: 160,
    backgroundColor: '#49de93',
    
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function ProfileCard() {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <h1>Card Content</h1>
      </CardContent>
      <CardActions>
        <Button size="small">Edit Card</Button>
      </CardActions>
    </Card>
  );
}