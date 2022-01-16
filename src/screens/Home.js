import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Animated,
  PanResponder,
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
} from "react-native-rapi-ui";

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
        <Section>
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
                      <Text style={styles.text}>
                        This is the end of the deck, pal.
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.card}>
                      <Text style={styles.text}>{card}</Text>
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
              <View style={{ backgroundColor: "blue", flex: 0.5 }} />
              <View style={{ backgroundColor: "red", flex: 0.5 }} />
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
    borderRadius: 1,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "turquoise",
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
