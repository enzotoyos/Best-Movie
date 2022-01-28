import firebase from "firebase";
import "firebase/firestore";

export async function AddUserFirestore(email, name, uid) {
  try {
    const db = firebase.firestore();
    db.collection("users").doc(user.uid).set({
      email: email,
      Name: name,
      CreatedAt: Date.now(),
      Status: "Active",
      ModifiedAt: Date.now(),
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
    console.log("uid", uid);
    var docRef = db.collection("liked_films").doc(uid);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        reject();
      });
  });
}
