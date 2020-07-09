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

  usernames = () => this.db.ref(`usernames/`);

  users = () => this.db.ref("users");

  getIDWithUsername = (username) =>
    this.db.ref("usernames").child(`${username}`);

  // getUsername = (username) => this.db.ref(`usernames/${username}`);
  // getProfilePicture = (image) =>
  //   (uploadProfilePicture = (image) =>
  //     this.storage.ref(`profile_pictures/${image.name}`).put(image));

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

  bio = (userID) => this.db.ref(`users/${userID}/bio`);

  updateUsername = (username) =>
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      username,
    });

  currentUsername = () => this.db.ref(`users/${this.auth.currentUser.uid}`);

  editUsername = (userID, username) => {
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      username,
    });
    this.db.ref(`usernames}`).update({
      [username]: userID,
    });
  };
  // this.db.ref(`users/${username}`).update({
  //   username,
  // });

  editBio = (bio) =>
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      bio,
    });

  card = (username, cardNumber) =>
    this.db.ref(`users/${username}/${cardNumber}`);

  editCard = (cardInfo, cardNumber) =>
    this.db.ref(`users/${this.auth.currentUser.uid}/${cardNumber}`).update({
      cardInfo,
    });

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
}

export default Firebase;
