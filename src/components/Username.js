import React, { Component } from 'react'

import { withFirebase } from './Firebase';

import './profile.css'

class Username extends Component {
    constructor(props){
        super(props);

        this.state = {
            loading: false,
            username: '',
        }
    }

    componentDidMount(){
        this.setState({ loading: true });
    
        this.props.firebase.username().on('value', snapshot =>{
            const state = snapshot.val();
            this.setState({ 
                username: state.username,
                loading: false
            })
            
        })
        
    }
    render() {
        const { loading, username } = this.state
        return ( 
            <div className>
                {loading && <div>Loading...</div>}
                <h2>{username}</h2>
            </div>
        )
    }
}

export default withFirebase(Username)
