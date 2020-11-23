import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDoQp0KRim4aWyQcIxGn9GEL8WeixFDFtc',
  authDomain: 'onecase-legacy.firebaseapp.com',
  databaseURL: 'https://onecase-legacy.firebaseio.com',
  projectId: 'onecase-legacy',
  storageBucket: 'onecase-legacy.appspot.com',
  messagingSenderId: '987591255368',
  appId: '1:987591255368:web:2b959e708f1116db08bf7d',
  measurementId: 'G-J7HHC64F6B',
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
    this.auth.signOut().catch((error) => {
      console.log({ error });
    });
  };

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // EARLY ACCESS FUNCTIONS
  earlyAccess = (email) => {
    const key = this.db.ref('emails').push().getKey();
    this.db.ref('emails').update({
      [key]: email,
    });
  };

  checkDuplicateEmail = (email) =>
    this.db.ref('emails').orderByValue().equalTo(email);

  // *** User API ***

  user = (userID) => this.db.ref(`users/${userID}`);

  checkDuplicateUsername = (username) =>
    this.db.ref('usernames').orderByKey().equalTo(username);

  userCards = (userID, cardNumber) =>
    this.db.ref(`users/${userID}/card${cardNumber}`);

  newCards = (userID, cardNumber, cardTitle) => {
    let strCardTitle = cardTitle + '';

    this.db.ref(`cards/${this.auth.currentUser.uid}`).update({
      [strCardTitle]: cardNumber,
    });
  };

  usernames = () => this.db.ref('usernames');

  names = () => this.db.ref('names');

  users = () => this.db.ref('users');

  currentUser = () => this.db.ref(`users/${this.auth.currentUser.uid}`);

  getIDWithUsername = (username) => this.db.ref(`usernames/${username}`);

  // *** Getters ***
  bio = (userID) => this.db.ref(`users/${userID}`);
  cards = (userID, cardNumber) => this.db.ref(`users/${userID}/${cardNumber}`);

  getCardNumberWithCardTitle = (userID, cardTitle) =>
    this.db.ref(`cards/${userID}/${cardTitle}`);

  getCardIDWithCardTitle = (category, userID) => {
    return this.db.ref(category.toLowerCase()).orderByKey().equalTo(userID);
  };

  checkDuplicateCardTitle = (cardTitle) => {
    let strCardTitle = cardTitle + '';
    let formattedCardTitle = strCardTitle.split(' ').join('_');
    return this.db
      .ref(`cards/${this.auth.currentUser.uid}`)
      .orderByKey()
      .equalTo(formattedCardTitle);
  };

  searchUsernames = (queryText) =>
    this.db
      .ref('usernames')
      .orderByKey()
      .startAt(queryText)
      .endAt(queryText + '\uf8ff');
  // this.db.ref(`users/${userID}`).orderByChild("card2").equalTo(cardTitle);

  searchNames = (queryText) =>
    this.db
      .ref('names')
      .orderByKey()
      .startAt(queryText)
      .endAt(queryText + '\uf8ff');

  bridgeCardIDs = (userID, cardNumber, bridgeCardNumber) => {
    return this.db.ref(`users/${userID}/${cardNumber}/${bridgeCardNumber}`);
  };

  bridgeCards = (cardID) => {
    return this.db.ref(`bridgeCards/${cardID}`);
  };
  // *** Edit Profile Functions (Setters) ***

  editUsername = (oldUsername, username) => {
    this.db.ref('usernames').child(oldUsername.toLowerCase()).remove();
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      username,
    });
    let formattedUsername = username.toLowerCase();
    this.db.ref('usernames').update({
      [formattedUsername]: this.auth.currentUser.uid,
    });
  };

  editName = (oldName, name) => {
    this.db.ref('names').child(oldName.toLowerCase()).remove();
    this.db.ref(`users/${this.auth.currentUser.uid}`).update({
      name,
    });
    let formattedName = name.toLowerCase();
    this.db.ref('names').update({
      [formattedName]: this.auth.currentUser.uid,
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
    let strOldCardTitle = oldCardTitle + '';
    let formattedOldCardTitle = strOldCardTitle.split(' ').join('_');

    let strCardTitle = cardTitle + '';
    let formattedCardTitle = strCardTitle.split(' ').join('_');

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

    let strOldCardTitle = oldCardTitle + '';
    let formattedOldCardTitle = strOldCardTitle.split(' ').join('_');

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

  createBridgeCard = (
    name,
    username,
    profilePicture,
    cardNumber,
    bridgeCardNumber,
    bridgeCardTitle,
    category,
    caption,
    description,
    link
  ) => {
    const timestamp = this.database.ServerValue.TIMESTAMP;
    this.db
      .ref(
        `users/${this.auth.currentUser.uid}/${cardNumber}/${bridgeCardNumber}`
      )
      .once('value', (snapshot) => {
        let oldCardID = snapshot.val();

        this.db.ref(`bridgeCards/${oldCardID}`).remove();
        this.db.ref(`${category.toLowerCase()}/${oldCardID}`).remove();

        const cardID = this.db
          .ref(`users/${this.auth.currentUser.uid}/${cardNumber}`)
          .push()
          .getKey();
        this.db.ref(`users/${this.auth.currentUser.uid}/${cardNumber}`).update({
          [bridgeCardNumber]: cardID,
        });

        this.db
          .ref(`users/${this.auth.currentUser.uid}/cardCount`)
          .set(this.database.ServerValue.increment(1));

        this.db.ref(`bridgeCards/${cardID}`).update({
          name,
          username,
          profilePicture,
          timeCreated: timestamp,
          category,
          bridgeCardTitle,
          caption,
          description,
          link,
        });

        this.db.ref(`${category.toLowerCase()}`).update({
          [cardID]: this.auth.currentUser.uid,
        });
        this.db
          .ref(`categories/${category.toLowerCase()}`)
          .set(this.database.ServerValue.increment(1));

        this.db.ref(`feed/${this.auth.currentUser.uid}`).update({
          [cardID]: timestamp,
        });
      });
  };

  editBridgeCard = (cardID, caption, description, link) => {
    this.db.ref(`bridgeCards/${cardID}`).update({
      lastUpdated: this.database.ServerValue.TIMESTAMP,
      caption,
      description,
      link,
    });
  };

  deleteBridgeCard = (
    cardID,
    category,
    userID,
    cardNumber,
    bridgeCardNumber
  ) => {
    this.db.ref(`bridgeCards/${cardID}`).remove();
    this.db.ref(`${category.toLowerCase()}/${cardID}`).remove();
    this.db.ref(`users/${userID}/${cardNumber}/${bridgeCardNumber}`).remove();
    this.db
      .ref(`users/${this.auth.currentUser.uid}/cardCount`)
      .set(this.database.ServerValue.increment(-1));

    this.db
      .ref(`categories/${category.toLowerCase()}`)
      .set(this.database.ServerValue.increment(-1));

    this.db.ref(`feed/${this.auth.currentUser.uid}/${cardID}`).remove();
  };

  getTrendingCategories = () => {
    return this.db.ref(`categories`).orderByValue().limitToLast(6);
  };
  uploadCardImage = (image) =>
    this.storage.ref(`card_images/${image.name}`).put(image);

  uploadCardCoverImage = (image) =>
    this.storage.ref(`cover_card_images/${image.name}`).put(image);

  uploadCardImageURL = (cardNumber, bridgeCardNumber, image) => {
    this.storage
      .ref('card_images')
      .child(image.name)
      .getDownloadURL()
      .then((cardImageURL) => {
        this.db
          .ref(
            `users/${this.auth.currentUser.uid}/${cardNumber}/${bridgeCardNumber}`
          )
          .once('value', (snapshot) => {
            let cardID = snapshot.val();
            this.db.ref(`bridgeCards/${cardID}`).update({
              cardImageURL,
            });
          });
      });
  };

  uploadCardCoverImageURL = (cardNumber, bridgeCardNumber, image) => {
    this.storage
      .ref('cover_card_images')
      .child(image.name)
      .getDownloadURL()
      .then((cardCoverImageURL) => {
        this.db
          .ref(
            `users/${this.auth.currentUser.uid}/${cardNumber}/${bridgeCardNumber}`
          )
          .once('value', (snapshot) => {
            let cardID = snapshot.val();
            this.db.ref(`bridgeCards/${cardID}`).update({
              cardCoverImageURL,
            });
          });
      });
  };

  // *** Profile Pictures ***
  uploadProfilePicture = (image) =>
    this.storage.ref(`profile_pictures/${image.name}`).put(image);

  // checkUsername = (username) => this.db.ref(`usernames/${username}`)
  uploadProfilePictureURL = (image) => {
    this.storage
      .ref('profile_pictures')
      .child(image.name)
      .getDownloadURL()
      .then((profilePicture) => {
        this.db.ref(`users/${this.auth.currentUser.uid}`).update({
          profilePicture,
        });
        window.location.reload();
      });
  };

  getFeed = (userID) => {
    return this.db.ref(`feed/${userID}`);
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

  getCardsInCategory = (category) => {
    return this.db
      .ref(category.toLowerCase())
      .once('value')
      .then((snapshot) => {
        var promises = [];
        snapshot.forEach((snap) => {
          var results = [];
          results.push(
            this.db.ref(`users/${snap.val()}`).once('value'),
            this.db.ref(`bridgeCards/${snap.key}`).once('value')
          );
          promises.push(Promise.all(results));
        });
        return Promise.all(promises);
      });
  };
}

export default Firebase;
