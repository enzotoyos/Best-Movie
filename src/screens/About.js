import React, { Component } from "react";
import { View, StyleSheet, Button, Image } from "react-native";
import {
  Layout,
  Text,
  useTheme,
  Section,
  SectionContent,
  SectionImage,
} from "react-native-rapi-ui";
import { discoveryFilms } from "../API/index";
import { ScrollView } from "react-native";
import { getLikedFilms } from "../screens/auth/AddUserFirestore";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();

  const renderLikedFilms = async () => {
    const value = await getLikedFilms();
  };

  //renderLikedFilms();

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginBottom: 1,
          backgroundColor: "transparent",
        }}
      >
        <Text style={styles.title}>Votre collection</Text>
        <ScrollView>
          <Card>
            <CardImage
              source={{ uri: "http://bit.ly/2GfzooV" }}
              title="Top 10 South African beaches"
            />
            <CardTitle subtitle="Number 6" />
            <CardContent text="Clifton, Western Cape" />
            <CardAction separator={true} inColumn={false}>
              <CardButton onPress={() => {}} title="Share" color="#FEB557" />
              <CardButton onPress={() => {}} title="Explore" color="#FEB557" />
            </CardAction>
          </Card>
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
