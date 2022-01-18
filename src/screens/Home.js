import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import Swiper from "react-native-dynamic-deck-swiper";
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

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 20,
        }}
      >
        <Section borderRadius={20}>
          <SectionContent>
            <Text fontWeight="bold" style={styles.section}>
              Créer votre propre collection pour faire vos tests
            </Text>
            <View style={styles.container}>
              <Swiper
                getNextCardData={({ first, left, right, previousCards }) => {
                  if (previousCards.length >= 10) {
                    // End of deck
                    return null;
                  } else if (left) {
                    return `You swiped to the left`;
                  } else if (right) {
                    return `You swiped to the right`;
                  }
                }}
              >
                {(card) =>
                  card === null ? (
                    <View style={styles.card}>
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 30,
                        }}
                        source={{
                          uri: "https://image.tmdb.org/t/p/w500/EnDlndEvw6Ptpp8HIwmRcSSNKQ.jpg",
                        }}
                      />
                    </View>
                  ) : (
                    <View style={styles.card}>
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 30,
                        }}
                        source={{
                          uri: "https://image.tmdb.org/t/p/w500/3SyG7dq2q0ollxJ4pSsrqcfRmVj.jpg",
                        }}
                      />
                    </View>
                  )
                }
              </Swiper>
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
          </SectionContent>
        </Section>
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginBottom: 350,
    marginLeft: 1,
    marginRight: "19%",
    borderRadius: 30,
    padding: 10,
  },
  text: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  section: {
    textAlign: "center",
    marginBottom: "6%",
  },
});
