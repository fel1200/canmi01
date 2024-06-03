//React imports
import { View, StyleSheet } from "react-native";
import React from "react";
//Components
import AnswerComponent from "./AnswerComponent.js";
//Colors
import { COLORS } from "../utils/constants.js";
//Styled text
import MyAppText from "./componentStyles/MyAppText.js";

export default function QuestionItem(props) {
  //Values from props, item(question), onChangeValueAnswer, isEditingAllowed
  const { item, onChangeValueAnswer, isEditingAllowed } = props;
  //Render
  return (
    item.enabled && (
      <View style={[styles.question]}>
        <View style={styles.line} />
        {
          //type question 1 to 4 needs left and right part
          item.typeQuestion >= 1 && item.typeQuestion <= 4 && (
            <View style={styles.questionParts}>
              <View style={styles.leftPartQuestion}>
                <MyAppText
                  style={[
                    styles.textQuestion,
                    {
                      color: isEditingAllowed
                        ? COLORS.secondary2
                        : COLORS.disabled3,
                    },
                  ]}
                  numberOfLines={6}
                  typeFont="Regular"
                >
                  {`${item.Question}*`}
                </MyAppText>
              </View>
              <View style={styles.lineSplitter}></View>
              <View style={styles.rightPartQuestion}>
                <AnswerComponent
                  item={item}
                  key={`AnswerComponent ${item.idQuestion}`}
                  onChangeValueAnswer={onChangeValueAnswer}
                />
              </View>
            </View>
          )
        }
        {
          //type question 5 needs only one part
          item.typeQuestion === 5 && (
            <View style={styles.questionPartsType5}>
              <AnswerComponent
                item={item}
                key={item.idQuestion}
                onChangeValueAnswer={onChangeValueAnswer}
              />
            </View>
          )
        }
        <View style={styles.bottom} />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    width: "100%",
    marginTop: 4,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: COLORS.disabled1,
  },

  question: {
    height: 110,
  },
  questionParts: {
    height: 100,
    flexDirection: "row",
  },
  leftPartQuestion: {
    flex: 3,
    height: "100%",
    justifyContent: "center",
  },
  textQuestion: {
    marginLeft: 8,
    marginRight: 16,
    marginTop: 4,
    marginBottom: 4,
    fontSize: 12,
    color: COLORS.darkGray,
  },
  lineSplitter: {
    height: 80,
    width: 1,
    backgroundColor: COLORS.disabled1,
    alignSelf: "center",
  },

  rightPartQuestion: {
    flex: 4,
    height: "100%",
    justifyContent: "center",
  },

  questionPartsType5: {
    height: 100,
    widt: "100%",
    marginLeft: 4,
    marginRight: 4,
  },
  bottom: {
    flex: 1,
    height: 1,
    width: "100%",
    backgroundColor: COLORS.disabled1,
    marginTop: 4,
    marginLeft: 4,
    marginRight: 4,
  },
});
