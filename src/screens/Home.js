import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { discoveryFilms } from "../API/index";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const { movieList, setMovieList } = useState([]);
  const { isDataReturned, setDataIsReturned } = useState(false);

  useEffect(() => {
    getDataMovie();
  }, []);

  // useEffect(() => {
  //   if (movieList && movieList.lenght > 0) {
  //     setDataIsReturned(true);
  //   } else {
  //     setDataIsReturned(false);
  //   }
  // }, [movieList.length]);

  const getDataMovie = async () => {
    const result = await discoveryFilms();
    setMovieList(result.results);
    console.log(movieList);
  };

  const renderCard = async () => {
    if (dataIsReturned === true) {
      return (
        <View style={styles.container}>
          <Swiper
            cards={renderCard()}
            renderCard={() => {
              return (
                <View style={styles.card}>
                  <Image
                    style={styles.image}
                    source={require("../../assets/1.jpg")}
                  />
                </View>
              );
            }}
            onSwiped={(cardIndex) => {
              console.log(cardIndex);
            }}
            onSwipedAll={() => {
              console.log("onSwipedAll");
            }}
            cardIndex={0}
            backgroundColor={"transparent"}
            stackSize={3}
          ></Swiper>
        </View>
      );
    } else {
      return <Text>Loading</Text>;
    }
  };

  return (
    <Layout>
      <Text fontWeight="bold" style={styles.title}>
        Créer votre propre collection pour faire vos tests
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
          {renderCard()}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          height: 100,
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "transparent",
            flex: 0.5,
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <Ionicons
              name="heart-dislike-outline"
              size={60}
              color={isDarkmode ? themeColor.white100 : themeColor.black}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: "transparent",
            flex: 0.5,
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <Ionicons
              name="heart-outline"
              size={60}
              color={isDarkmode ? themeColor.white100 : themeColor.black}
            />
          </TouchableOpacity>
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
  title: {
    textAlign: "center",
  },
});
