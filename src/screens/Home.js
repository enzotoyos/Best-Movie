import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import firebase from "firebase";
import {
  Layout,
  Text,
  useTheme,
  TopNav,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { discoveryFilms } from "../API/index";
import { pushFilmsOnFirestore } from "./utils/controllerFirestore";

export default function ({ navigation }) {
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

  const refreshList = async () => {
    console.log('refreshList');
  };

  const setLoading = (isLoad) => {
    if (!isLoad) {
      return <Text>Loading</Text>;
    }
  };

  const onSwipeRight = async (cardIndex) => {
    const currentUser = firebase.auth().currentUser;
    const movie = movieList[cardIndex];
    await pushFilmsOnFirestore(
      currentUser.uid,
      true,
      movie.id,
      movie.poster_path,
      movie.title
    );
  };

  const onSwipeLeft = async (cardIndex) => {
    const currentUser = firebase.auth().currentUser;
    const movie = movieList[cardIndex];
    await pushFilmsOnFirestore(
      currentUser.uid,
      false,
      movie.id,
      movie.poster_path,
      movie.title
    );
  };

  return (
    <Layout>
      <TopNav
        rightContent={
          <Ionicons
            name="refresh-circle-outline"
            size={30}
            color={isDarkmode ? themeColor.white100 : themeColor.black}
          />
        }
        rightAction={() => refreshList()}
        middleContent="Settings"
      />
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
            onSwiped={(cardIndex) => {
              // console.log(cardIndex);
            }}
            onSwipedAll={() => {
              console.log("onSwipedAll");
            }}
            onSwipedLeft={(cardIndex) => onSwipeLeft(cardIndex)}
            onSwipedRight={(cardIndex) => {
              onSwipeRight(cardIndex);
            }} // idem à droite
            cardIndex={0}
            backgroundColor={"transparent"}
            stackSize={3}
          />
        </View>
      </View>
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
  originalTtile: {
    textAlign: "center",
    marginBottom: "1%",
  },
});
