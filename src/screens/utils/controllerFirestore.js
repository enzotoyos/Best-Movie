import firebase from "firebase";
import "firebase/firestore";
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function AddUserFirestore(email, name, uid) {
  try {
    const db = firebase.firestore();
    await AsyncStorage.setItem("currentPage", String("1"));
    db.collection("users").doc(uid).set({
      email: email,
      Name: name,
      CreatedAt: Date.now(),
      Status: "Active",
      ModifiedAt: Date.now(),
      currentPage: 1
    });
    db.collection("liked_films").doc(uid).set({ movie: [] });
    db.collection("unliked_films").doc(uid).set({ movie: [] });
  } catch (err) {
    console.log(err.message);
  }
}

export async function getLikedFilms(uid) {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var docRef = db.collection("liked_films").doc(uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        resolve(doc.data());
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
      reject();
    });
  });
}

export const pushFilmsOnFirestore = async (
  userID,
  likedOrNo,
  movieID,
  posterURL,
  movieTitle
) => {
  const db = firebase.firestore();
  var docData = {
    movieTitle: movieTitle,
    movieID: movieID,
    addedAt: Date.now(),
    posterPath: posterURL,
  };

  if (likedOrNo == true) {
    let data = db.collection("liked_films").doc(userID);

    data.update({ movie: firebase.firestore.FieldValue.arrayUnion(docData) });
  } else if (likedOrNo == false) {
    let data = db.collection("unliked_films").doc(userID);

    data.update({ movie: firebase.firestore.FieldValue.arrayUnion(docData) });
  }
};

export const SendEmailVerification = async () => {
  await firebase.auth().currentUser.sendEmailVerification().then(() => {
    Toast.show({
      type: 'info',
      text1: 'Email de vérification envoyé'
    });
  });
}

export const createUserWithEmailAndPassword = async (email, pseudo, password) => {
  await firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
    const user = userCredential.user;
    const userID = user.uid;
    AddUserFirestore(email, pseudo, userID);
    if (user.emailVerified == false) {
      SendEmailVerification();
    }
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    Toast.show({
      type: 'error',
      text1: 'Une erreur est survenue durant la création',
      text2: error.message
    });
  });
}

export const sendPasswordResetEmail = async (email) => {
  await firebase.auth().sendPasswordResetEmail(email)
    .then(function () {
      Toast.show({
        type: 'success',
        text1: 'Votre mot de passe à été réinitialisé',
        text2: 'Vous allez recevoir voir un Email.'
      });
    })
    .catch(function (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: "Votre Email n'est pas enregistré"
      });
    });
}

export const signInWithEmailAndPassword = async (email, password) => {
  await firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
    const user = userCredential.user;
    AsyncStorage.setItem("uid", String(user.uid));

    if (user.emailVerified == false) {
      Toast.show({
        type: 'info',
        text1: 'Vous devez vérifier votre Email pour vous connecter'
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Vous êtes connecté'
      });
    }
  }).catch(function (error) {
    var errorCode = error.code;
    Toast.show({
      type: 'error',
      text1: 'Adresse mail ou mot de passe incorrect',
      text2: error.message
    });
  });
}

export const deleteMovie = async (movie) => {
  const uid = await AsyncStorage.getItem("uid");
  const db = firebase.firestore();
  var docRef = db.collection("liked_films").doc(uid);
  await docRef.update({ movie: firebase.firestore.FieldValue.arrayRemove(movie) }).then(() => {
    Toast.show({
      type: 'success',
      text1: 'Le film a été retiré de votre liste',
      text2: 'Titre : ' + movie.movieTitle
    });
  }).catch((error) => {
    Toast.show({
      type: 'error',
      text1: 'Une erreur est survenue durant la suppression',
      text2: error.message
    });
  });
}