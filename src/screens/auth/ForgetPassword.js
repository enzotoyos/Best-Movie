import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const changeTheme = () => {
    isDarkmode ? setTheme("light") : setTheme("dark");
    AsyncStorage.setItem("theme", String(isDarkmode));
  }

  async function forget() {
    setLoading(true);
    if (email.length == 0) {
      Toast.show({
        type: 'info',
        text1: 'Email non renseigné'
      });
      setLoading(false);
      return null;
    }

    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        setLoading(false);
        navigation.navigate("Login");
        Toast.show({
          type: 'success',
          text1: 'Votre mot de passe à été réinitialisé',
          text2: 'Vous allez recevoir voir un Email.'
        });
      })
      .catch(function (error) {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: "Votre Email n'est pas enregistré"
        });
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
              source={require("../../../assets/forget.png")}
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
              size="h3"
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
            >
              Mot de passe oublié ?
            </Text>
            <Text>Email</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Entez votre Email"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />
            <Button
              text={loading ? "Loading" : "Envoyer l'Email"}
              onPress={() => {
                forget();
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
              <Text size="md">Vous avez déjà un compte?</Text>
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
                  {isDarkmode ? "☀️ Mode clair" : "🌑 Mode sombre"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
