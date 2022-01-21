import React from "react";
import { View, StyleSheet, Button, Image } from "react-native";
import { Layout, Text, useTheme } from "react-native-rapi-ui";
import { discoveryFilms } from "../API/index";
import Swiper from "react-native-deck-swiper";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginBottom: 60,
          backgroundColor: "transparent",
        }}
      >
        <Text style={styles.title}>Votre collection</Text>
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
  },
});
