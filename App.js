import React, { useCallback } from "react";
//For navigation
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/Navigation";
//For the font loading
import { useFonts } from "expo-font";
//For context and get general data independent of the screen
import { AppProvider } from "./src/context/AppContext";

export default function App() {
  //Fonts popins loading
  const [fontsLoaded] = useFonts({
    "Poppins-regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-italic": require("./assets/fonts/Poppins-Italic.ttf"),
    "Poppins-bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-semibold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-light": require("./assets/fonts/Poppins-Light.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    console.log("Not fonts loaded");
    return null;
  }

  return (
    <NavigationContainer>
      <AppProvider>
        <Navigation />
      </AppProvider>
    </NavigationContainer>
  );
}
