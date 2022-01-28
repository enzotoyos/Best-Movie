import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image
} from "react-native";
import firebase from "firebase";

import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { AddUserFirestore } from "../auth/AddUserFirestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const changeTheme = () => {
    isDarkmode ? setTheme("light") : setTheme("dark");
    AsyncStorage.setItem("theme", String(isDarkmode));
  }

  async function SendEmailVerification() {
    await firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        Toast.show({
          type: 'info',
          text1: 'Email de vérification envoyé'
        });
        navigation.navigate('login');
      });
  }

  var userID;
  let user;
  async function register() {
    setLoading(true);
    if (email.length == 0) {
      Toast.show({
        type: 'info',
        text1: 'Email non renseignéé'
      });
      setLoading(false);
      return null;
    } else if (password.length == 0) {
      Toast.show({
        type: 'info',
        text1: 'Mot de passe non renseigné'
      });
      setLoading(false);
      return null;
    } else if (name.lenght == 0) {
      Toast.show({
        type: 'info',
        text1: 'Pseudo non renseigné'
      });
      setLoading(false);
      return null;
    }
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        user = userCredential.user;
        userID = user.uid;
        console.log(userID);
        AddUserFirestore(email, name, userID);
        if (user.emailVerified == false) {
          SendEmailVerification();
        }
        setLoading(false);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        setLoading(false);
        alert(errorMessage);
      });
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../../assets/register.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="bold"
              size="h3"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
            >
              Enregistrez-vous
            </Text>
            <Text>Email</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Entrez votre Email"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <Text style={{ marginTop: 15 }}>Pseudo</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Entrez votre pseudo"
              value={name}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              onChangeText={(text) => setName(text)}
            />

            <Text style={{ marginTop: 15 }}>Mot de Passe</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Entrez votre Mot de passe"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Button
              text={loading ? "en cours" : "Creez votre compte"}
              onPress={() => {
                register();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Vous avez déjà un compte ?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Connectez-vous
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  changeTheme();
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? "☀️ Mode clair" : "🌑 Mode sombre "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
