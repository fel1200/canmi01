import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  Pressable,
  ScrollView,
} from "react-native";
import MyAppText from "../components/componentStyles/MyAppText.js";
//Colors
import { COLORS } from "../utils/constants.js";
//Icons and images
import BackArrow from "../../assets/backArrow.svg";

export default function InstructionsScreen({ navigation, route }) {
  //indicatorActiveApp from route
  const { indicatorActiveApp } = route.params;

  return (
    <KeyboardAvoidingView style={styles.bg}>
      <View style={styles.mainContainer}>
        <Pressable
          style={styles.backPressable}
          onPress={() => navigation.goBack()}
        >
          <BackArrow />
        </Pressable>

        <View style={styles.titleIndicator}>
          <MyAppText style={styles.titleIndicatorText} typeFont="Regular">
            {`Instrucciones indicador ${indicatorActiveApp.idIndicator}`}{" "}
          </MyAppText>
        </View>
        <View style={styles.line} />
      </View>
      <ScrollView style={styles.scrollView}>
        <MyAppText style={styles.textLongIndicator} typeFont="Regular">
          {indicatorActiveApp.evaluation}
        </MyAppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 42,
  },
  mainContainer: {
    flexDirection: "column",
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
    width: "100%",
    height: 58,
    alignItems: "center",
    marginTop: 16,
    marginLeft: 8,
    backgroundColor: COLORS.disabled1,
  },
  titleIndicatorText: {
    fontSize: 20,

    color: COLORS.secondary2,
  },
  line: {
    height: 1,
    width: "100%",
    marginTop: 4,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: COLORS.disabled2,
  },

  scrollView: {
    marginTop: 0,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: COLORS.disabled1,
  },
  textLongIndicator: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: COLORS.secondary3,
  },
});
