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
  }
}
