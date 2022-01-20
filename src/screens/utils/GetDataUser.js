import firebase from "firebase"
import "firebase/firestore"

export async function GetUser() {
  try {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    var docRef = db.collection("users").doc(currentUser.uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log('--------');
        console.log(doc.data());
        return doc.data();
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    })
  } catch (err) {
    console.log(err.message);
  }
}
