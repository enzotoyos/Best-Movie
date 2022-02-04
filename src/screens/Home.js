import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import firebase from "firebase";
import {
  Layout,
  Text,
  useTheme,
  TopNav,
  themeColor,
  Section,
  SectionContent,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { discoveryFilms } from "../API/index";
import { pushFilmsOnFirestore } from "./utils/controllerFirestore";
import { updateCurrentPage } from "./utils/GetDataUser";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [movieList, setMovieList] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    getDataMovie();
    renderMovie();
  }, []);

  const getDataMovie = async () => {
    const currentPage = await AsyncStorage.getItem("currentPage");
    const result = await discoveryFilms(currentPage);
    setMovieList(result.results);
  };

  const refreshList = async () => {
    let currentPage = await updateCurrentPage();
    const result = await discoveryFilms(currentPage);
    console.log("----------------------------------");
    setCardIndex(0);
    setMovieList(result.results);
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

  const renderMovie = (item, index) => {
    if (!item) {
      return <View style={styles.loading}>{setLoading(true)}</View>;
    } else {
      setRating(item.vote_average);
      return (
        <View style={styles.card}>
          <Section>
            <SectionContent>
              <Text style={styles.titleMovie}>{item.original_title}</Text>
              <Image
                style={styles.image}
                source={{
                  uri: "https://image.tmdb.org/t/p/w500" + item.poster_path,
                }}
              />
            </SectionContent>
          </Section>
        </View>
      );
    }
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
        middleContent="Best-Movie"
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
            infinite={true}
            renderCard={renderMovie}
            onSwiped={(cardIndex) => {
              console.log("onSwiped", cardIndex);
            }}
            onSwipedLeft={(cardIndex) => onSwipeLeft(cardIndex)}
            onSwipedRight={(cardIndex) => {
              onSwipeRight(cardIndex);
            }} // idem à droite
            cardIndex={cardIndex}
            backgroundColor={"transparent"}
            stackSize={2}
            showSecondCard={true}
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
    paddingBottom: 10,
  },
  titleMovie: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
