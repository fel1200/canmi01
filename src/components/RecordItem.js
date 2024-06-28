//React imports
import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
//Checkbox
import Checkbox from "expo-checkbox";
//Components
import StageComponent from "./StageComponent.js";
//Styled text
import MyAppText from "./componentStyles/MyAppText.js";
//Colors
import { COLORS } from "../utils/constants.js";
//API methods

export default function RecordItem(props) {
  const { item, onPressRecordItem, onSelectedItemsChange } = props;
  //Getting age from questions
  const getAgeFromQuestions = () => {
    const questionAge = item.questions.find((q) => q.idQuestion === 104);
    const questionAgeText = `Edad: ${
      questionAge ? questionAge.answerValue : ""
    } años`;
    return questionAgeText;
  };

  //Getting number of expedient
  const getMethodVerification = () => {
    const questionNumberMethod = item.questions.find(
      (q) => q.idQuestion === 102
    );
    const methodVerificationText = `Expediente ${questionNumberMethod.answerValue}`;
    return methodVerificationText;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Guardado";
      case 1:
        return "Enviado";
      case 2:
        return "Error al enviar";
      case 99:
        return "Enviando...";
      default:
        return "";
    }
  };

  //Checkbox
  //const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const onPressCheckBox = (newValue) => {
    //setToggleCheckBox(newValue);
    onSelectedItemsChange(item, newValue);
  };

  //render
  return (
    <View style={styles.containerItem}>
      <View style={styles.line} />
      <View style={styles.containerDetail}>
        <View style={styles.circleStage}>
          <View style={styles.stage}>
            <StageComponent stage={item.stage} size="small"></StageComponent>
          </View>
          <View style={styles.check}>
            {/* Only if status is 0 (saved) or 2 (error) can send again */}
            {item.status === 0 || item.status === 2 ? (
              <Checkbox
                disabled={false}
                value={item?.selected}
                onValueChange={(newValue) => onPressCheckBox(newValue)}
                ColorValue={COLORS.secondary1}
              />
            ) : null}
          </View>
        </View>
        <View style={styles.lineSplitter}></View>
        <TouchableOpacity
          onPress={onPressRecordItem}
          style={styles.detailItemContainer}
        >
          <View style={styles.detailItemContainerTexts}>
            <MyAppText style={styles.titleTextIndicator} typeFont="Bold">
              {getMethodVerification()}
            </MyAppText>
            <View style={styles.containerDetailTextIndicator}>
              <MyAppText
                style={styles.detailTextIndicator}
                typeFont="Regular"
                numberOfLines={1}
              >
                {getAgeFromQuestions()}
              </MyAppText>
              <MyAppText
                style={styles.detailTextIndicatorSecondary}
                typeFont="Regular"
                numberOfLines={1}
              >
                {item.stage}
              </MyAppText>
              <MyAppText
                style={styles.detailTextIndicatorSecondary}
                typeFont="Regular"
                numberOfLines={1}
              >
                {`Cuestionario indicador ${item.idIndicator}`}
              </MyAppText>
              <View
                style={[
                  styles.detailViewIndicatorStatus,
                  {
                    backgroundColor:
                      item.status === 0 //saved
                        ? COLORS.disabled2
                        : item.status === 1 //sent
                        ? COLORS.tertiary1
                        : item.status === 2 //error
                        ? COLORS.primary3
                        : COLORS.disabled3, //sending
                  },
                ]}
              >
                <MyAppText
                  style={styles.detailTextIndicatorSecondary}
                  typeFont="Regular"
                  numberOfLines={1}
                >
                  {getStatusText(item.status)}
                </MyAppText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerItem: {
    height: 140,
    width: "100%",
    paddingTop: 4,
  },
  line: {
    height: 0.3,
    width: "100%",
    paddingTop: 2,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: COLORS.disabled1,
  },
  containerDetail: {
    height: "100%",
    width: "100%",
    marginTop: 4,
    flex: 0,
    flexDirection: "row",
  },
  circleStage: {
    height: "100%",
    flex: 1,
    justifyContent: "center",
  },
  stage: {
    height: 30,
    width: 30,
    justifyContent: "center",
    alignSelf: "center",
  },
  check: {
    position: "absolute",
    right: 8,
    top: 90,

    height: "30%",
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  lineSplitter: {
    height: "100%",
    width: 1,
    backgroundColor: COLORS.tertiary1,
    backgroundColor: COLORS.disabled1,
  },
  detailItemContainer: {
    height: "100%",
    flex: 6,
    paddingLeft: 16,
    flexDirection: "row",
  },
  detailItemContainerTexts: {
    flex: 4,
  },
  titleTextIndicator: {
    marginTop: 8,
    fontSize: 16,
    flex: 1,
  },
  containerDetailTextIndicator: {
    flex: 4,
    marginTop: 4,

    flexDirection: "column",
  },
  detailTextIndicator: {
    fontSize: 13,
  },
  detailTextIndicatorSecondary: {
    fontSize: 12,
    color: COLORS.secondary3,
  },
  detailViewIndicatorStatus: {
    height: 20,
    width: 130,
    borderRadius: 8,
    marginTop: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  detailItemContainerButtons: {
    flex: 2,
    flexDirection: "row",
  },
});
