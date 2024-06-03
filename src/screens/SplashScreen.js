import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
//colors constants
import { COLORS } from "../utils/constants";
//Styled text
import MyAppText from "../components/componentStyles/MyAppText";

export default function StartScreen({ navigation }) {
  //Method to go to the next screen
  const goSelectUserScreen = () => {
    navigation.navigate("SelectUser");
  };

  //Method to style the height of image depending the screen size
  const marginTopDependingScreen = () => {
    //Var to calculate the height of the window
    const windowHeight = Dimensions.get("window").height;
    if (windowHeight > 800) {
      return 140;
    } else if (windowHeight > 700) {
      return 100;
    } else if (windowHeight > 600) {
      return 80;
    } else if (windowHeight > 500) {
      return 70;
    } else {
      return 60;
    }
  };

  return (
    <View style={styles.bg}>
      <Image
        source={require("../../assets/icon.png")}
        style={{
          width: 200,
          height: 200,
          marginTop: marginTopDependingScreen(),
        }}
      />
      <View style={styles.textAndButtonContainer}>
        <MyAppText style={styles.textSubMain} typeFont="Medium">
          CANMI
        </MyAppText>
        <MyAppText style={styles.textSubMainParagraph} typeFont="Medium">
          Calidad de la Atención Nutricional Materno Infantil
        </MyAppText>
        <MyAppText style={styles.textParagraph} typeFont="Regular">
          El asistente que te permite conocer los niveles de calidad de la
          atención en Centros de Salud pertenecientes al primer nivel
        </MyAppText>
        <Pressable style={styles.buttonStart} onPress={goSelectUserScreen}>
          <Text style={styles.textButton}>Iniciar</Text>
        </Pressable>
      </View>
      <View style={styles.logoIbero}>
        <Image
          source={require("../../assets/LOGO-IBERO-CDMX.jpg")}
          style={styles.logoIberoImg}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: COLORS.backgroundApp,
    alignItems: "center",
    justifyContent: "center",
  },
  linearGradient: {
    flex: 1,
  },
  textAndButtonContainer: {
    flex: 5,
    marginTop: 2,
    width: 320,
    alignItems: "center",
  },
  textMain: {
    fontSize: 45,
    fontWeight: "bold",
    color: COLORS.primary1,
  },
  textSubMain: {
    marginTop: 8,
    fontSize: 30,
    color: COLORS.secondary2,
  },
  textSubMainParagraph: {
    marginTop: 4,
    fontSize: 20,
    color: COLORS.secondary1,
    textAlign: "center",
  },
  textParagraph: {
    marginTop: 16,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    color: COLORS.secondary3,
    textAlign: "center",
  },

  buttonStart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 48,
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: COLORS.secondary2,
  },

  textButton: {
    fontSize: 20,
    color: COLORS.brightContrast,
    textAlign: "center",
  },
  logoIbero: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginLeft: 32,
    marginRight: 32,
    borderRadius: 32,
    marginTop: 8,
    marginBottom: 24,
    width: "80%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoIberoImg: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
});
