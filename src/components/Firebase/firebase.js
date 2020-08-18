import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBBeFFUunRUU-Fop4wXbEcR9BQUJ7uhBkY",
  authDomain: "onecase-app.firebaseapp.com",
  databaseURL: "https://onecase-app.firebaseio.com",
  projectId: "onecase-app",
  storageBucket: "onecase-app.appspot.com",
  messagingSenderId: "56673846186",
  appId: "1:56673846186:web:48c8a223804732c38861d3",
  measurementId: "G-FLYJGB2ZHX",
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    app.analytics();

    this.auth = app.auth();
    this.database = app.database;
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

  checkDuplicateCardTitle = (cardTitle) => {
    let strCardTitle = cardTitle + "";
    let formattedCardTitle = strCardTitle.split(" ").join("_");
    return this.db
      .ref(`cards/${this.auth.currentUser.uid}`)
      .orderByKey()
      .equalTo(formattedCardTitle);
  };

  searchUsernames = (queryText) =>
    this.db
      .ref("usernames")
      .orderByKey()
      .startAt(queryText)
      .endAt(queryText + "\uf8ff");
  // this.db.ref(`users/${userID}`).orderByChild("card2").equalTo(cardTitle);

  bridgeCards = (userID, cardNumber, cardBridgeNumber) =>
    this.db.ref(`users/${userID}/${cardNumber}/${cardBridgeNumber}`);
  // *** Edit Profile Functions (Setters) ***

  editUsername = (oldUsername, username) => {
    this.db.ref("usernames").child(`${oldUsername.toLowerCase()}`).remove();

    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      username,
    });
    let formattedUsername = username.toLowerCase();

    this.db.ref(`usernames`).update({
      [formattedUsername]: this.auth.currentUser.uid,
    });
  };

  editName = (name) =>
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      name,
    });

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

  deleteCard = (oldCardTitle, cardNumber) => {
    this.db.ref(`users/${this.auth.currentUser.uid}/${cardNumber}`).remove();

    let strOldCardTitle = oldCardTitle + "";
    let formattedOldCardTitle = strOldCardTitle.split(" ").join("_");

    this.db
      .ref(`cards/${this.auth.currentUser.uid}`)
      .child(`${formattedOldCardTitle}`)
      .remove();
  };
  editLinkCard = (linkCardNumber, linkTitle, linkURL) => {
    this.db.ref(`users/${this.auth.currentUser.uid}/${linkCardNumber}`).update({
      linkTitle,
      linkURL,
    });
  };
  editBridgeCard = (
    cardNumber,
    bridgeCardNumber,
    bridgeCardTitle,
    caption,
    description
  ) =>
    this.db
      .ref(
        `users/${this.auth.currentUser.uid}/${cardNumber}/${bridgeCardNumber}`
      )
      .update({
        bridgeCardTitle,
        caption,
        description,
      });

  uploadCardImage = (image) =>
    this.storage.ref(`card_images/${image.name}`).put(image);

  uploadCardCoverImage = (image) =>
    this.storage.ref(`cover_card_images/${image.name}`).put(image);

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

  uploadCardCoverImageURL = (cardNumber, bridgeCardNumber, image) => {
    this.storage
      .ref("cover_card_images")
      .child(image.name)
      .getDownloadURL()
      .then((cardCoverImageURL) => {
        this.db
          .ref(
            `users/${this.auth.currentUser.uid}/${cardNumber}/${bridgeCardNumber}`
          )
          .update({
            cardCoverImageURL,
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
        window.location.reload();
      });
  };

  follow = (followerID, followedID) => {
    this.db.ref(`followers/${followedID}`).update({ [followerID]: true });
    this.db.ref(`following/${followerID}`).update({ [followedID]: true });
    this.db
      .ref(`users/${followedID}/followerCount`)
      .set(this.database.ServerValue.increment(1));
    this.db
      .ref(`users/${followerID}/followingCount`)
      .set(this.database.ServerValue.increment(1));
  };

  unfollow = (followerID, followedID) => {
    this.db.ref(`followers/${followedID}/${followerID}`).remove();
    this.db.ref(`following/${followerID}/${followedID}`).remove();
    this.db
      .ref(`users/${followedID}/followerCount`)
      .set(this.database.ServerValue.increment(-1));
    this.db
      .ref(`users/${followerID}/followingCount`)
      .set(this.database.ServerValue.increment(-1));
  };

  getFollowers = (userID) => {
    return this.db.ref(`followers/${userID}`);
  };

  getFollowing = (userID) => {
    return this.db.ref(`following/${userID}`);
  };

  checkFollowing = (followerID, followedID) => {
    return this.db.ref(`following/${followerID}/${followedID}`);
  };
}

export default Firebase;
