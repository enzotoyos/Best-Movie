import React from "react";
import firebase from "firebase";
import "firebase/firestore";

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
