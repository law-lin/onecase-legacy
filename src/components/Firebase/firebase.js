import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4BhoDKEBGcrWV6hl9DCzIFyes33V6cwY",
  authDomain: "onepage-3bdd8.firebaseapp.com",
  databaseURL: "https://onepage-3bdd8.firebaseio.com",
  projectId: "onepage-3bdd8",
  storageBucket: "onepage-3bdd8.appspot.com",
  messagingSenderId: "798277787212",
  appId: "1:798277787212:web:40c319d820185f9c30dee9",
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
  }

  // ** Auth API **

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => {
    this.auth
      .signOut()
      .then(() => {
        console.log("Signout success");
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // *** User API ***

  user = (userID) => this.db.ref(`users/${userID}`);

  usernames = () => this.db.ref("usernames");

  users = () => this.db.ref("users");

  currentUsername = () => this.db.ref(`users/${this.auth.currentUser.uid}`);

  getIDWithUsername = (username) => this.db.ref(`usernames/${username}`);

  // *** Getters ***
  bio = (userID) => this.db.ref(`users/${userID}`);
  cards = (userID, cardNumber) => this.db.ref(`users/${userID}/${cardNumber}`);

  getCardNumberWithCardTitle = (userID, cardTitle) =>
    this.db.ref(`users/${userID}`).orderByChild("card2").equalTo(cardTitle);

  // bridgeCards = (userID, cardBridgeNumber) => this.db.ref(`users/${userID}/${cardNumber}/${cardBridgeNumber}`)
  // *** Edit Profile Functions (Setters) ***

  editUsername = (oldUsername, username) => {
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      username,
    });
    this.db.ref("usernames").child(`${oldUsername}`).remove();
    this.db.ref(`usernames`).update({
      [username]: this.auth.currentUser.uid,
    });
  };

  editBio = (bio) =>
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      bio,
    });

  editCard = (oldCardTitle, cardNumber, cardTitle) => {
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      [cardNumber]: cardTitle,
    });

    this.db.ref("cards").child(`${oldCardTitle}`).remove();
    this.db.ref("cards").update({
      [cardTitle]: cardNumber,
    });
  };

  editBridgeCard = (cardBridgeNumber, cardTitle) =>
    this.db.ref(
      `users/${this.auth.currentUser.uid}`.update({
        [cardBridgeNumber]: cardTitle,
      })
    );

  uploadCardImage = (image) =>
    this.storage.ref(`card_images/${image.name}`).put(image);

  uploadCardImageURL = (cardNumber, image) => {
    this.storage
      .ref("card_images")
      .child(image.name)
      .getDownloadURL()
      .then((cardImageURL) => {
        this.db.ref(`users/${this.auth.currentUser.uid}/${cardNumber}`).update({
          cardImageURL,
        });
      });
  };

  // *** Profile Pictures ***
  uploadProfilePicture = (image) =>
    this.storage.ref(`profile_pictures/${image.name}`).put(image);

  // checkUsername = (username) => this.db.ref(`usernames/${username}`)
  uploadProfilePictureURL = (image) => {
    this.storage
      .ref("profile_pictures")
      .child(image.name)
      .getDownloadURL()
      .then((profilePicture) => {
        this.db.ref(`users/${this.auth.currentUser.uid}`).update({
          profilePicture,
        });
      });
  };
}

export default Firebase;
