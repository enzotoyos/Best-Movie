import firebase from "firebase"
import "firebase/firestore"

export async function GetNameUser() {
  try {
    const currentUser = await firebase.auth().currentUser
    const db = await firebase.firestore()

    var docRef = db.collection("users").doc(currentUser.uid)

    docRef.get().then((doc) => {
        if (doc.exists) {
            return doc.data().Name
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error)
    })
  } catch (err) {
    console.log(err.message)
  }
}

export async function GetEmailUser() {
    try {
      const currentUser = await firebase.auth().currentUser
      const db = await firebase.firestore()
  
      var docRef = db.collection("users").doc(currentUser.uid);
  
      docRef.get().then((doc) => {
          if (doc.exists) {
              return doc.data().email
          } else {
              console.log("No such document!");
          }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
    } catch (err) {
      console.log(err.message)
    }
  }
