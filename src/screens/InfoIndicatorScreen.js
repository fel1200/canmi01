import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
//Getting data from context
import useApp from "../hooks/useApp.js";
//Styled font
import MyAppText from "../components/componentStyles/MyAppText.js";
//Colors
import { COLORS } from "../utils/constants.js";
//Icons and images
import BackArrow from "../../assets/backArrow.svg";
import StageComponent from "../components/StageComponent.js";

export default function InfoIndicatorScreen({ navigation }) {
  const { indicatorActiveApp } = useApp();

  //To go screen to answer the indicator
  const gotoAnswerIndicator = () => {
    navigation.navigate("AnswerIndicator", {
      indicatorAnsweredFromProps: undefined,
    });
  };

  //Bigger view to show instructions
  const gotoInstructions = () => {
    navigation.navigate("Instructions", {
      indicatorActiveApp: indicatorActiveApp,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.bg}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <Pressable
            style={styles.backPressable}
            onPress={() => navigation.goBack()}
          >
            <BackArrow />
          </Pressable>
          <View style={styles.titleIndicator}>
            <MyAppText style={styles.titleIndicatorText} typeFont="Regular">
              {`Indicador ${indicatorActiveApp.idIndicator}`}{" "}
            </MyAppText>
          </View>
          <View style={styles.stageContainer}>
            <StageComponent
              stage={indicatorActiveApp.stage}
              size={"medium"}
            ></StageComponent>
          </View>
          <View style={styles.line} />
          <View style={styles.detailIndicator}>
            <View style={styles.detailIndicatorUp}>
              <View style={styles.detailIndicatorLeft}>
                <MyAppText
                  style={styles.textDetailIndicatorLeft}
                  typeFont="Bold"
                >
                  Nombre
                </MyAppText>
              </View>
              <View style={styles.detailIndicatorRight}>
                <MyAppText
                  style={styles.textDetailIndicatorRight}
                  typeFont="Regular"
                  numberOfLines={6}
                >
                  {indicatorActiveApp.name}
                </MyAppText>
              </View>
            </View>
            <View style={styles.detailIndicatorDown}>
              <View style={styles.detailIndicatorDownLeft}>
                <MyAppText
                  style={styles.textDetailIndicatorLeft3}
                  typeFont="Bold"
                >
                  Etapa
                </MyAppText>
              </View>
              <View style={styles.detailIndicatorDownRight}>
                <View style={styles.typeIndicatorView}>
                  <View style={styles.textTypeContainer}>
                    <MyAppText typeFont="Regular">
                      {indicatorActiveApp.stage}
                    </MyAppText>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.containerButtontoStart}>
              <Pressable
                style={styles.buttonInstructions}
                onPress={() => gotoInstructions()}
              >
                <MyAppText
                  style={styles.textButtonInstructions}
                  typeFont="Regular"
                >
                  Ver instrucciones
                </MyAppText>
              </Pressable>
              <Pressable
                style={styles.buttonStart}
                onPress={() => gotoAnswerIndicator()}
              >
                <MyAppText style={styles.textButtonStart} typeFont="Regular">
                  Iniciar
                </MyAppText>
              </Pressable>
            </View>
          </View>
          <View style={styles.line} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 42,
    backgroundColor: COLORS.backgroundApp,
  },
  mainContainer: {
    flex: 1,
    margin: 4,
  },
  backPressable: {
    position: "absolute",
    top: 8,
    left: 8,
    height: 42,
    width: 42,
    zIndex: 1,
  },

  titleIndicator: {
    height: 58,
    alignItems: "center",
  },
  titleIndicatorText: {
    fontSize: 32,
    color: COLORS.secondary2,
  },
  stageContainer: {
    height: 120,
    alignItems: "center",

    paddingTop: 4,
  },
  line: {
    height: 1,
    width: "100%",
    marginTop: 4,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: COLORS.disabled2,
  },
  detailIndicator: {
    height: 350,
    flexDirection: "column",
  },
  detailIndicatorUp: {
    backgroundColor: COLORS.disabled1,
    height: 160,
    width: "100%",
    flexDirection: "row",
  },
  detailIndicatorLeft: {
    flex: 1,
    marginTop: 4,
    marginRight: 4,
    marginBottom: 4,
    marginLeft: 24,
  },
  textDetailIndicatorLeft: {
    marginTop: 4,
    fontSize: 16,
  },
  textDetailIndicatorLeft3: {
    paddingTop: 4,
    fontSize: 16,
  },
  textDetailIndicatorRight: {
    marginTop: 4,
    marginRight: 8,
    fontSize: 14,
  },

  detailIndicatorRight: {
    marginTop: 6,
    marginRight: 8,
    flex: 3,
  },
  detailIndicatorDown: {
    backgroundColor: COLORS.disabled1,
    marginTop: 4,
    width: "100%",
    flexDirection: "row",
  },
  detailIndicatorDownLeft: {
    flex: 1,
    marginTop: 4,
    marginRight: 4,
    marginBottom: 4,
    marginLeft: 24,
  },
  detailIndicatorDownRight: {
    marginRight: 8,
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  typeIndicatorView: {
    flexDirection: "row",
  },
  circle: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  textTypeContainer: {
    marginLeft: 8,
    alignSelf: "center",
  },
  containerButtontoStart: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonInstructions: {
    marginTop: 12,
    width: 250,
    height: 40,
    paddingHorizontal: 30,
    paddingVertical: 8,
    //outlined
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: COLORS.disabled3,
  },
  buttonStart: {
    marginTop: 12,
    width: 250,
    height: 40,
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.secondary2,
  },
  textButtonInstructions: {
    fontSize: 16,
    color: COLORS.secondary2,
    textAlign: "center",
  },
  textButtonStart: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
  },
  showMore: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  textShowMore: {
    fontSize: 16,
    color: COLORS.disabled3,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    margin: 8,
    height: 250,
    paddingBottom: 20,
    backgroundColor: COLORS.disabled1,
  },
  textLongIndicator: {
    paddingTop: 4,
    fontSize: 12,
    paddingBottom: 8,
    color: COLORS.secondary3,
  },
});
