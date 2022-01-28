import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Share,
} from "react-native";
import { Layout, Text, themeColor, useTheme } from "react-native-rapi-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { discoveryFilms } from "../API/index";
import { ScrollView } from "react-native";
import firebase from "firebase/app";
import * as WebBrowser from 'expo-web-browser';
import { getLikedFilms } from "./utils/controllerFirestore";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";
import "firebase/firestore";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [likedFilms, setLikedFilms] = useState([]);
  const [result, setResult] = useState(null);

  const initializeTheme = async () => {
    try {
      const value = await AsyncStorage.getItem('theme');
      if (value !== null && value !== undefined) {
        (value === 'true') ? setTheme("light") : setTheme("dark");
      } else {
        AsyncStorage.setItem("theme", String(isDarkmode));
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    initializeTheme();
  }, []);
  
  const openMovieOnBrowser = async (movie) => {
    let result = await WebBrowser.openBrowserAsync('https://www.themoviedb.org/movie/' + movie.movieID);
    setResult(result);
  };

  const onShare = async (movie) => {
    try {
      const result = await Share.share({
        message: "Tu devrais regarder ce film ! ",
        url: "https://image.tmdb.org/t/p/w500/" + movie.posterPath,
        title: movie.movieTitle,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getFilmsLiked = async () => {
    const user = firebase.auth().currentUser;
    const collection = await getLikedFilms(user.uid);
    setLikedFilms(collection.movie);
  };

  useEffect(() => {
    getFilmsLiked();
  }, []);

  const RenderCard = ({ item, i }) => (
    <Card
      style={{
        borderRadius: 7,
        marginLeft: 15,
        marginRight: 15,
      }}
    >
      <CardImage
        source={{
          uri: "https://image.tmdb.org/t/p/w500/" + item.posterPath,
        }}
        title={item.movieTitle}
        style={{ borderRadius: 7 }}
      />
      <CardTitle subtitle={"Ajouté le: " + item.addedAt} />
      <CardAction separator={true} inColumn={false}>
        <CardButton
          onPress={() => onShare(item)}
          title="Partager"
          color="#FEB557"
        />
        <CardButton onPress={() => { 
          openMovieOnBrowser(item);
        }} title="Explorer" color="#FEB557" />
      </CardAction>
    </Card>
  );

  return (
    <Layout>
      <View>
        <Text style={styles.title}>Votre collection</Text>
      </View>
      <View>
        <ScrollView>
          <FlatList data={likedFilms} renderItem={RenderCard}></FlatList>
        </ScrollView>
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
    fontSize: 20,
    marginTop: "5%",
    marginBottom: "2%",
  },
});
