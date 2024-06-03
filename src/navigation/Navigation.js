import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//Screens to navigate to
import SplashScreen from "../screens/SplashScreen";
import SelectUserScreen from "../screens/SelectUserScreen";
import MainScreen from "../screens/MainScreen";
import InfoIndicatorScreen from "../screens/InfoIndicatorScreen";
import InstructionsScreen from "../screens/InstructionsScreen";
import AnswerIndicatorScreen from "../screens/AnswerIndicatorScreen";
import RecordsScreen from "../screens/RecordsScreen";
import ChartsScreen from "../screens/ChartsScreen";

const Stack = createNativeStackNavigator();

//Navigation screens
export default function Navigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Start"
        component={SplashScreen}
        options={{ title: "Inicio" }}
      />
      <Stack.Screen name="SelectUser" component={SelectUserScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="InfoIndicator" component={InfoIndicatorScreen} />
      <Stack.Screen name="Instructions" component={InstructionsScreen} />
      <Stack.Screen name="AnswerIndicator" component={AnswerIndicatorScreen} />
      <Stack.Screen
        name="AnswerIndicatorWithProps"
        component={AnswerIndicatorScreen}
      />
      <Stack.Screen name="Records" component={RecordsScreen} />
      <Stack.Screen name="Charts" component={ChartsScreen} />
    </Stack.Navigator>
  );
}
