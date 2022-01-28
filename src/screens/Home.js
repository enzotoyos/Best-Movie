import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import firebase from "firebase";
import { Layout, Text, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { discoveryFilms } from "../API/index";
import { pushFilmsOnFirestore } from "../screens/utils/pushFilmsFirestore";
import StarRating from "react-native-star-rating";

export default function ({ navigation }) {
  let idCard;
  let posterPath;
  let title;
  const { isDarkmode, setTheme } = useTheme();
  const [movieList, setMovieList] = useState([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    getDataMovie();
  }, []);

  const getDataMovie = async () => {
    const result = await discoveryFilms();
    setMovieList(result.results);
  };

  const setLoading = (isLoad) => {
    if (!isLoad) {
      return <Text>Loading</Text>;
    }
  };

  const onSwipeRight = async (cardID, posterURL, movieTitle) => {
    const currentUser = firebase.auth().currentUser;
    await pushFilmsOnFirestore(
      currentUser.uid,
      true,
      cardID,
      posterURL,
      movieTitle
    );
  };

  const onSwipeLeft = async (cardID, posterURL, movieTitle) => {
    const currentUser = firebase.auth().currentUser;
    await pushFilmsOnFirestore(
      currentUser.uid,
      false,
      cardID,
      posterURL,
      movieTitle
    );
  };

  return (
    <Layout>
      <Text fontWeight="bold" style={styles.title}>
        Créer votre propre collection
      </Text>
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginBottom: 60,
            backgroundColor: "transparent",
          }}
        >
          <Swiper
            cards={movieList}
            renderCard={(card) => {
              if (!card) {
                return <View style={styles.loading}>{setLoading(true)}</View>;
              } else {
                idCard = card.id;
                posterPath = card.poster_path;
                title = card.original_title;
                setRating(card.vote_average);
                return (
                  <View style={styles.card}>
                    <Text style={styles.originalTtile}>
                      {card.original_title}
                    </Text>
                    <Image
                      style={styles.image}
                      source={{
                        uri:
                          "https://image.tmdb.org/t/p/w500" + card.poster_path,
                      }}
                    />
                  </View>
                );
              }
            }}
            onSwiped={(movieList) => {
              console.log(movieList);
            }}
            onSwipedAll={() => {
              console.log("onSwipedAll");
            }}
            onSwipedLeft={() => onSwipeLeft(idCard, posterPath, title)} // si on swipe à gauche on appelle la fonction et on donne l'id du film swiper
            onSwipedRight={() => onSwipeRight(idCard, posterPath, title)} // idem à droite
            cardIndex={0}
            backgroundColor={"transparent"}
            stackSize={3}
          />
        </View>
      </View>
      <View
        style={{ marginLeft: 100, marginRight: 100, marginTop: 200 }}
      ></View>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "transparent",
    borderColor: "transparent",
    justifyContent: "center",
    marginBottom: "50%",
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
  image: {
    borderRadius: 18,
    width: "100%",
    height: "100%",
  },
  title: {
    marginTop: "5%",
    textAlign: "center",
    fontSize: 20,
  },
  originalTtile: {
    textAlign: "center",
    marginBottom: "1%",
  },
});
