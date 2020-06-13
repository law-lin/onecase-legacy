import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB4BhoDKEBGcrWV6hl9DCzIFyes33V6cwY",
    authDomain: "onepage-3bdd8.firebaseapp.com",
    databaseURL: "https://onepage-3bdd8.firebaseio.com",
    projectId: "onepage-3bdd8",
    storageBucket: "onepage-3bdd8.appspot.com",
    messagingSenderId: "798277787212",
    appId: "1:798277787212:web:40c319d820185f9c30dee9"
  };

  class Firebase {
    constructor() {
      app.initializeApp(firebaseConfig);
   
      this.auth = app.auth();
      this.db = app.database()
    }

    // ** Auth API **

    doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => {
      this.auth.signOut()
        .then(() => {
          console.log("Signout success")
        })
        .catch((error) => {
          console.log( { error })
        })
      }

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);

       // *** User API ***
 
    user = uid => this.db.ref(`users/${uid}`);
  
    users = () => this.db.ref('users');
    
    bio = () => this.db.ref(`bios/${this.auth.currentUser.uid}`);
    
    username = uid => this.db.ref(`users/${this.auth.currentUser.uid}`)
    
    editUsername = username => this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      username
    })

    editBio = bio => this.db.ref(`bios/${this.auth.currentUser.uid}`).update({
      bio
    })

    card = cardNumber => this.db.ref(`users/${this.auth.currentUser.uid}/${cardNumber}`)
    
    editCard = (cardInfo, cardNumber) => this.db.ref(`users/${this.auth.currentUser.uid}/${cardNumber}`).update({
      cardInfo
    })
    

};

   
  export default Firebase;