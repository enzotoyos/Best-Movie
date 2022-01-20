import firebase from "firebase"
import "firebase/firestore"

export async function GetUser() {
  try {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    var docRef = db.collection("users").doc(currentUser.uid);
    const result = await docRef.get();
    return result.data();
  } catch (err) {
    console.log(err.message);
    return undefined;
  }
}

export async function updateUser(user) {
  try {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    await db.collection("users").doc(currentUser.uid).update(user);
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

export async function updateEmail(email, password, newEmail) {
  console.log(email + " " + password);
  let result = false;

  let res = await signIn(email, password);
  if (res) {
    let user = await GetUser();
    user.email = newEmail;
    updateUser(user);
    const currentUser = firebase.auth().currentUser;
    result = new Promise((resolve, reject) => {
      currentUser.updateEmail(newEmail).then(() => {
        resolve(true);
      }).catch((error) => {
        console.log(error);
        reject(error.message);
      })
    });
  }

  return result;
}

export async function updatePassword(email, password, newPassword) {
  let result = false;

  let res = await signIn(email, password);
  if (res) {
    const currentUser = firebase.auth().currentUser;
    result = new Promise((resolve, reject) => {
      currentUser.updatePassword(newPassword).then(() => {
        resolve(true);
      }).catch((error) => {
        console.log(error);
        reject(error.message);
      })
    });
  }

  return result;
}

export async function signIn(email, password) {
  let result = {};
  result = new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        resolve(true);
      })
      .catch((error) => {
        console.log(error);
        reject(error.message);
      });
  });

  return result;
}

export async function signOut() {
  firebase.auth().signOut();
}