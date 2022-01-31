import firebase from "firebase";
import "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function updateCurrentPage() {
  try {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    let currentPage = await AsyncStorage.getItem("currentPage");
    currentPage = parseInt(currentPage) + 1;
    await db.collection("users").doc(currentUser.uid).update({ currentPage: currentPage });
    var docRef = db.collection("users").doc(currentUser.uid);
    const result = await docRef.get();
    await AsyncStorage.setItem("currentPage", String(result.data().currentPage));

    return result.data().currentPage;
  } catch (err) {
    console.log(err.message);
    return undefined;
  }
}

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

export async function uploadImage(uri, ext) {
  let result = {};
  // Create a root reference
  var metadata = {
    contentType: 'image/jpeg',
  };
  console.log(uri);


  try {
    const currentUser = firebase.auth().currentUser;

    var uploadTask = firebase.storage().ref('avatar/' + currentUser.uid + '.' + ext).putString(uri, 'base64', { contentType: 'image/jpg' });

    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  } catch (error) {
    console.log(error);
  }

  return result;
}

export async function signOut() {
  await AsyncStorage.setItem("currentPage", String(0));
  await AsyncStorage.setItem("uid", "");
  firebase.auth().signOut();
}