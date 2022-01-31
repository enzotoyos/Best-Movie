import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Share,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { Layout, Text, themeColor, useTheme, TopNav } from "react-native-rapi-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import firebase from "firebase/app";
import * as WebBrowser from 'expo-web-browser';
import { getLikedFilms, deleteMovie } from "./utils/controllerFirestore";
import {
  Card,
  CardTitle,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";
import { Ionicons } from "@expo/vector-icons";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [likedFilms, setLikedFilms] = useState([]);
  const [result, setResult] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const deleteMovieFirestore = async (movie) => {
    let index = 0;
    likedFilms.forEach((element, i) => {
      if (element.movieID === movie.movieID) {
        index = i;
      }
    })
    await deleteMovie(likedFilms[index]);
    await getFilmsLiked();
  };

  useEffect(() => {
    initializeTheme();
    getFilmsLiked();
  }, []);

  const openMovieOnBrowser = async (movie) => {
    let result = await WebBrowser.openBrowserAsync('https://www.themoviedb.org/movie/' + movie.movieID);
    setResult(result);
  };

  const onShare = async (movie) => {
    try {
      console.log(movie);
      const result = await Share.share({
        message: "Tu devrais regarder ce film ! : " + movie.movieTitle + " " + "https://www.themoviedb.org/movie/" + movie.movieID,
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
    setRefreshing(true);
    const user = firebase.auth().currentUser;
    const collection = await getLikedFilms(user.uid);
    setLikedFilms(collection.movie);
    setRefreshing(false)
  };

  const RenderCard = ({ item, i }) => (
    <View>
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
        <CardTitle subtitle={"Ajouté le : " + new Date(item.addedAt).getDate() + "/" + (new Date(item.addedAt).getMonth() + 1) + "/" + new Date(item.addedAt).getFullYear() + " " + new Date(item.addedAt).getHours() + ":" + new Date(item.addedAt).getMinutes()} />
        <CardAction separator={true} inColumn={false}>
          <CardButton
            onPress={() => onShare(item)}
            title="Partager"
            color="#FEB557"
          />
          <CardButton
            onPress={() => openMovieOnBrowser(item)}
            title="Explorer"
            color="#FEB557"
          />
          <TouchableOpacity style={styles.iconDelete} onPress={() => deleteMovieFirestore(item)}>
            <Ionicons
              name="trash-outline"
              size={25}
              color="#FEB557"
            />
          </TouchableOpacity>
        </CardAction>
      </Card>
    </View>
  );

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
        rightAction={() => getFilmsLiked()}
        middleContent="Votre collection"
      />
      {/* <View>
        <Text style={styles.title}></Text>
      </View> */}
      <SafeAreaView>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getFilmsLiked} />}>
          <FlatList data={likedFilms} renderItem={RenderCard}></FlatList>
        </ScrollView>
      </SafeAreaView>
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  iconDelete: {
    marginLeft: 20
  }
});
