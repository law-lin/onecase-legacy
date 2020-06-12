import React, { Component } from 'react'

import './profile.css'
import SignOutButton from './SignOut';
import Navbar from './Navbar';
import souljason from '../images/souljason.png'

import GridItem from './GridItem'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import QueryCard from './QueryCard';
import Biography from './Biography';
import Username from './Username';
import EditBio from './EditBio'
import EditUsername from './EditUsername'
import { withAuthorization } from './Session'

class ProfilePage extends Component {
    render() {
        return ( 
            <div className="bg">
                <Navbar/>
                <div className="profile-page">
                    <div className="center">
                        <div className="profileleft">
                            <Biography/>
                            <EditBio/>
                            <EditUsername/>
                            <div className="profile">
                                <Username/>
                                <img src={souljason} className="profile-img"></img>
                                <SignOutButton/>    
                            </div>
                            <div className="content">
                                <Grid container spacing={3}>
                                    <Grid justify="center" container item xs={12}spacing={3}>
                                        <GridItem />
                                    </Grid>
                                    <Grid justify="center" container item xs={12} spacing={3}>
                                        <GridItem />
                                    </Grid>
                                    <Grid justify="center" container item xs={12} spacing={3}>
                                        <GridItem />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                        <div className="profileright">
                            <QueryCard/>
                        </div>
                    </div>
                
                </div>
            </div>
          )
    }
}
const condition = authenticated  => !!authenticated;

export default withAuthorization(condition)(ProfilePage);
