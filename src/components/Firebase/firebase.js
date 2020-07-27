import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB4BhoDKEBGcrWV6hl9DCzIFyes33V6cwY",
  authDomain: "onepage-3bdd8.firebaseapp.com",
  databaseURL: "https://onepage-3bdd8.firebaseio.com",
  projectId: "onepage-3bdd8",
  storageBucket: "onepage-3bdd8.appspot.com",
  messagingSenderId: "798277787212",
  appId: "1:798277787212:web:40c319d820185f9c30dee9",
  measurementId: "G-HQKNY0D3TX",
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    app.analytics();

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

  // EARLY ACCESS FUNCTIONS
  earlyAccess = (email) => {
    const key = this.db.ref("emails").push().getKey();
    this.db.ref("emails").update({
      [key]: email,
    });
  };

  checkDuplicateEmail = (email) =>
    this.db.ref("emails").orderByValue().equalTo(email);

  // *** User API ***

  user = (userID) => this.db.ref(`users/${userID}`);

  checkDuplicateUsername = (username) =>
    this.db.ref("usernames").orderByKey().equalTo(username);

  userCards = (userID, cardNumber) =>
    this.db.ref(`users/${userID}/card${cardNumber}`);

  newCards = (userID, cardNumber, cardTitle) => {
    let strCardTitle = cardTitle + "";

    this.db.ref(`cards/${this.auth.currentUser.uid}`).update({
      [strCardTitle]: cardNumber,
    });
  };

  usernames = () => this.db.ref("usernames");

  users = () => this.db.ref("users");

  currentUser = () => this.db.ref(`users/${this.auth.currentUser.uid}`);

  getIDWithUsername = (username) => this.db.ref(`usernames/${username}`);

  // *** Getters ***
  bio = (userID) => this.db.ref(`users/${userID}`);
  cards = (userID, cardNumber) => this.db.ref(`users/${userID}/${cardNumber}`);

  getCardNumberWithCardTitle = (userID, cardTitle) =>
    this.db.ref(`cards/${userID}/${cardTitle}`);

  // this.db.ref(`users/${userID}`).orderByChild("card2").equalTo(cardTitle);

  bridgeCards = (userID, cardNumber, cardBridgeNumber) =>
    this.db.ref(`users/${userID}/${cardNumber}/${cardBridgeNumber}`);
  // *** Edit Profile Functions (Setters) ***

  editUsername = (oldUsername, username) => {
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      username,
    });
    let formattedUsername = username.toLowerCase();
    this.db.ref("usernames").child(`${oldUsername}`).remove();
    this.db.ref(`usernames`).update({
      [formattedUsername]: this.auth.currentUser.uid,
    });
  };

  editBio = (bio) =>
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      bio,
    });
  editNotes = (cardNumber, notes) => {
    this.db.ref(`users/${this.auth.currentUser.uid}/${cardNumber}`).update({
      notes,
    });
  };

  editCard = (oldCardTitle, cardNumber, cardTitle) => {
    this.db.ref(`users/${this.auth.currentUser.uid}/${cardNumber}`).update({
      cardTitle,
    });
    let strOldCardTitle = oldCardTitle + "";
    let formattedOldCardTitle = strOldCardTitle.split(" ").join("_");

    let strCardTitle = cardTitle + "";
    let formattedCardTitle = strCardTitle.split(" ").join("_");

    this.db
      .ref(`cards/${this.auth.currentUser.uid}`)
      .child(`${formattedOldCardTitle}`)
      .remove();
    this.db.ref(`cards/${this.auth.currentUser.uid}`).update({
      [formattedCardTitle]: cardNumber,
    });
  };

  editBridgeCard = (
    cardNumber,
    bridgeCardNumber,
    bridgeCardTitle,
    yearCreated,
    isProud,
    coworkers,
    whyMake,
    description
  ) =>
    this.db
      .ref(
        `users/${this.auth.currentUser.uid}/${cardNumber}/${bridgeCardNumber}`
      )
      .update({
        bridgeCardTitle,
        yearCreated,
        isProud,
        coworkers,
        whyMake,
        description,
      });

  uploadCardImage = (image) =>
    this.storage.ref(`card_images/${image.name}`).put(image);

  uploadCardImageURL = (cardNumber, bridgeCardNumber, image) => {
    this.storage
      .ref("card_images")
      .child(image.name)
      .getDownloadURL()
      .then((cardImageURL) => {
        this.db
          .ref(
            `users/${this.auth.currentUser.uid}/${cardNumber}/${bridgeCardNumber}`
          )
          .update({
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
