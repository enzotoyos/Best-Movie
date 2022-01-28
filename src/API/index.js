import React from "react";
import firebase from "firebase";
import "firebase/firestore";
// Requête pour découvrir les films les plus populaires du moment
export const discoveryFilms = () => {
  return new Promise((resolve, reject) => {
    const url =
      "https://api.themoviedb.org/3/discover/movie?api_key=657047754a636ca6765f2bdce74a5c16&language=fr-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate";

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        //Si réponse OK on passe au then suivant sinon erreur
        if (response.ok) {
          return response;
        } else {
          reject();
          throw response;
        }
      })
      //Parse les données recues
      .then((response) => response.json())
      .then((responseData) => {
        resolve(responseData);
      })
      .catch((error) => console.log("error", error))
      .finally(() => {});
  });
};

//Effectue une requête pour trouver le film avec un ID en paramêtre
export const FindFilm = (id) => {
  return new Promise((resolve, reject) => {
    const url =
      "https://api.themoviedb.org/3/movie/" +
      id +
      "?api_key=657047754a636ca6765f2bdce74a5c16&language=fr-FR";

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        //Si réponse OK on passe au then suivant sinon erreur
        if (response.ok) {
          return response;
        } else {
          reject();
          throw response;
        }
      })
      //Parse les données recues
      .then((response) => response.json())
      .then((responseData) => {
        resolve(responseData);
      })
      .catch((error) => console.log("error", error))
      .finally(() => {});
  });
};
