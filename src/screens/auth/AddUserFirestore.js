import firebase from "firebase"
import "firebase/firestore"

export async function AddUserFirestore(email, name, uid) {
  try {
    const db = firebase.firestore();
    db.collection("users")
      .doc(uid)
      .set({
        email: email,
        Name: name,
        CreatedAt: Date.now(),
        Status: "Active",
        ModifiedAt: Date.now()
      });
  } catch (err) {
    console.log(err.message)
  }
}

