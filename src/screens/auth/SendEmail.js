import firebase from "firebase"

export default async function SendEmailVerification(){
   await firebase.auth().currentUser.sendEmailVerification()
        .then(() => {
         // Email verification sent!
         // ...
    });
}