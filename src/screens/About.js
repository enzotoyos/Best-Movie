import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Share,
  Modal,
  Pressable,
  RefreshControl,
} from "react-native";
import { Layout, Text, themeColor, useTheme } from "react-native-rapi-ui";
import { discoveryFilms } from "../API/index";
import { ScrollView } from "react-native";
import firebase from "firebase/app";
import { getLikedFilms } from "../screens/auth/AddUserFirestore";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";
import "firebase/firestore";
import color from "color";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [likedFilms, setLikedFilms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const onShare = async (movie) => {
    try {
      console.log(movie);
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

  const getFilmsLiked = () => {
    var db = firebase.firestore();
    const user = firebase.auth().currentUser;
    var docRef = db.collection("liked_films").doc(user.uid);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          let value = doc.data();
          setLikedFilms(value.movie);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
    console.log(likedFilms);
  };

  useEffect(() => {
    getFilmsLiked();
  }, []);

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
        <CardTitle subtitle={"Ajouté le: " + item.addedAt} />
        <CardAction separator={true} inColumn={false}>
          <CardButton
            onPress={() => onShare(item.movieTitle)}
            title="Partager"
            color="#FEB557"
          />
          <CardButton
            onPress={() => setModalVisible(true)}
            title="Explorer"
            color="#FEB557"
          />
        </CardAction>
      </Card>
    </View>
  );

  return (
    <Layout>
      <View>
        <Text style={styles.title}>Votre collection</Text>
      </View>
      <View>
        <ScrollView
          refreshControl={<RefreshControl onRefresh={getFilmsLiked} />}
        >
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
});
