import { Text } from "react-native";
import React, { useEffect, useState } from "react";
import * as Font from "expo-font";

//Component to use custom fonts in this case we are using Poppins
export default function MyAppText(props) {
  //For the font loading
  const [fontLoaded, setFontLoaded] = useState(false);
  //Props to style the text
  const { style, typeFont, numberOfLines, ...otherProps } = props;

  //Method to select the font
  const fontSelect = (type) => {
    //Depending the type, is the font returned
    return type === "Regular"
      ? "Poppins-regular"
      : type === "Bold"
      ? "Poppins-bold"
      : type === "Medium"
      ? "Poppins-regular"
      : type === "SemiBold"
      ? "Poppins-regular"
      : type === "Light"
      ? "Poppins-light"
      : type === "regular";
  };

  //UseEffect to load the font
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        "Poppins-regular": require("../../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-bold": require("../../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-medium": require("../../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-semibold": require("../../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-light": require("../../../assets/fonts/Poppins-Light.ttf"),
      });
      setFontLoaded(true);
    })();
  }, []);

  return (
    <Text
      style={[style, { fontFamily: fontSelect(typeFont) }]}
      {...otherProps}
      numberOfLines={numberOfLines}
    >
      {props.children}
    </Text>
  );
}
