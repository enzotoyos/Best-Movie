import React from "react";
import { themeColor, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default (props) => {
  const { isDarkmode } = useTheme();
  return (
    <Section>
      <SectionImage
        source={{
          uri: "https://image.tmdb.org/t/p/w500/yFwFp5QVHazxTklKGiJ0G59pVab.jpg",
        }}
      />
      <SectionContent>
        <Text>gdphfgpd</Text>
      </SectionContent>
    </Section>
  );
};
