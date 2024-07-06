//React imports
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
//Hooks info
import useApp from "../hooks/useApp.js";
//Colors
import { COLORS } from "../utils/constants.js";
//Styled text
import MyAppText from "./componentStyles/MyAppText.js";

//Types:
//1 pregunta abierta númerica
//2 pregunta abierta texto ((not used))
//3 pregunta cerrada opciones múltiples sí, no, etc
//4 pregunta cerrada opciones múltiples  ((not used))
//5 Input para observaciones

export default function AnswerComponent(props) {
  //First getting info from props
  const { item, onChangeValueAnswer } = props;
  //Then from context
  const { indicatorAnswered, setIndicatorAnswered, platform } = useApp();
  //To change color of border depending the value
  const colorBorderYesNo = (value) => {
    if (value === "No") {
      return COLORS.disabled2;
    } else if (value === "Sí") {
      return COLORS.secondary1;
    } else {
      return COLORS.disabled3;
    }
  };

  //Method to define the answer of the button, depending the options
  const widthAnswer = () => {
    const numberFilteredAnswers = item.possibleAnswers.filter(
      (item) => item.value !== "No encontrado" && item.value !== "No aplica"
    ).length;
    let elements = 1;
    numberFilteredAnswers === 0
      ? (elements = 1)
      : (elements = numberFilteredAnswers);
    return 150 / elements;
  };

  //To check if the question has not found or not applicable options
  const haveNotFoundOrNotApplicable = () => {
    return (
      item.possibleAnswers.filter((item) => item.value === "No encontrado")
        .length > 0 ||
      item.possibleAnswers.filter((item) => item.value === "No aplica").length >
        0
    );
  };

  //To define the style of the container of the answers
  const columnStyle = () => {
    foundOptions = haveNotFoundOrNotApplicable();
    return foundOptions ? { flexDirection: "column" } : {};
  };

  //To get the value of the button
  const getPossibleAnswerChecked = (idQuestion, idPossibleAnswer) => {
    const question = indicatorAnswered.questions.filter(
      (item) => item.idQuestion === idQuestion
    );

    if (question.length === undefined) {
      return false;
    } else {
      const possibleAnswer = question[0].possibleAnswers?.filter(
        (item) => item.key === idPossibleAnswer
      );
      if (possibleAnswer === undefined) {
        return false;
      }
      return possibleAnswer[0]?.checked;
    }
  };

  //Style buttons depending if they are checked or not
  const styleButtons = (idQuestion, idPossibleAnswer, valueButton) => {
    const possibleAnswerChecked = getPossibleAnswerChecked(
      idQuestion,
      idPossibleAnswer,
      valueButton
    );
    //To check if the question has not found or not applicable options
    //To style the buttons differently
    const isButtonNotFoundOrNotApplicable =
      valueButton === "No encontrado" || valueButton === "No aplica";
    return isButtonNotFoundOrNotApplicable
      ? {
          marginTop: 4,
          height: 25,
          width: 30,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: COLORS.disabled1,
          backgroundColor: possibleAnswerChecked
            ? COLORS.disabled3
            : COLORS.disabled1,
        }
      : {
          backgroundColor: possibleAnswerChecked
            ? COLORS.secondary3
            : COLORS.white,
        };
  };

  //Styling the text button depending if they are checked and
  //if the question has not found or not applicable options
  const styleTextButton = (idQuestion, idPossibleAnswer, valueButton) => {
    const possibleAnswerChecked = getPossibleAnswerChecked(
      idQuestion,
      idPossibleAnswer,
      valueButton
    );
    const notFoundOrNotApplicable = haveNotFoundOrNotApplicable();
    return notFoundOrNotApplicable
      ? {
          color: possibleAnswerChecked ? COLORS.white : COLORS.disabled3,
        }
      : {
          color: possibleAnswerChecked ? COLORS.white : COLORS.disabled3,
        };
  };
  //A translation method from value to NE or NA to its text value
  const notFoundNotApplicableTranslation = (value) => {
    return value === "No encontrado"
      ? "NE"
      : value == "No aplica"
      ? "NA"
      : value;
  };

  //vars and methods to handle pressed options
  const onPressOption = (idQuestion, idPossibleAnswer, newValue) => {
    if (indicatorAnswered !== undefined) {
      if (indicatorAnswered.idIndicator === 1 && idQuestion === 1) {
        //First check if its a number and then obtain the float value of the answer
        if (idPossibleAnswer === "998") {
          //The answer is 998, so we put answer 998 in the rest of the questions
          //Get the value of checked in the question 1
          const question1 = indicatorAnswered.questions.filter(
            (item) => item.idQuestion === 1
          );
          const possibleAnswers = question1[0].possibleAnswers;
          const checkedFirstQuestion = possibleAnswers.filter(
            (item) => item.key === "998"
          )[0].checked;

          const newStatusAnswers = indicatorAnswered.questions.map((item) => {
            if (item.idQuestion === idQuestion) {
              return {
                ...item,
                answerOption: idPossibleAnswer,
                answerValue: "",
                possibleAnswers: item.possibleAnswers.map((possibleAnswer) => {
                  if (possibleAnswer.key !== idPossibleAnswer) {
                    return {
                      ...possibleAnswer,
                      checked: false,
                    };
                  } else {
                    return {
                      ...possibleAnswer,
                      checked: !possibleAnswer.checked,
                    };
                  }
                }),
              };
            } else if (item.idQuestion > 1 && item.idQuestion < 9) {
              return {
                ...item,
                answerOption: "998",
                possibleAnswers: item.possibleAnswers.map((possibleAnswer) => {
                  if (possibleAnswer.key === "998") {
                    return {
                      ...possibleAnswer,
                      checked: !checkedFirstQuestion,
                    };
                  }
                  return possibleAnswer;
                }),
              };
            } else if (item.idQuestion === 9) {
              return {
                ...item,
                answerValue:
                  checkedFirstQuestion === false
                    ? "No aplica ya que IMC no se encontró"
                    : "",
              };
            }
            return item;
          });
          onChangeValueAnswer(newStatusAnswers);
        }
      } else if (indicatorAnswered.idIndicator === 1 && idQuestion === 4) {
        //questions 5, 6, 7 y 9 enabled
        let valueEnabled = false;
        if (idPossibleAnswer === "1") {
          valueEnabled = true;
        } else {
          valueEnabled = false;
        }
        console.log("Value enabled: ", valueEnabled);
        console.log("idPossibleAnswer", idPossibleAnswer);
        const questionsEnabled = indicatorAnswered.questions.map((question) => {
          if (question.idQuestion === 5) {
            question.enabled = valueEnabled;
          }
          // if (question.idQuestion === 6) {
          //   question.enabled = valueEnabled;
          // }
          if (question.idQuestion === 7) {
            if (valueEnabled === false) {
              question.answerOption = "999";
            }
            question.enabled = valueEnabled;
          }
          if (question.idQuestion === 9) {
            if (valueEnabled === false) {
              question.answerOption = "999";
            }
            question.enabled = valueEnabled;
          }
          return question;
        });

        const newStatusAnswers = indicatorAnswered.questions.map((item) => {
          if (item.idQuestion === idQuestion) {
            return {
              ...item,
              answerOption: idPossibleAnswer,
              answerValue: "",
              possibleAnswers: item.possibleAnswers.map((possibleAnswer) => {
                if (possibleAnswer.key !== idPossibleAnswer) {
                  return {
                    ...possibleAnswer,
                    checked: false,
                  };
                } else {
                  return {
                    ...possibleAnswer,
                    checked: !possibleAnswer.checked,
                  };
                }
              }),
            };
          } else {
            return item;
          }
        });
        setIndicatorAnswered({
          ...indicatorAnswered,
          questions: questionsEnabled,
        });
        onChangeValueAnswer(newStatusAnswers);
      } else {
        const newStatusAnswers = indicatorAnswered.questions.map((item) => {
          if (item.idQuestion === idQuestion) {
            return {
              ...item,
              answerOption: idPossibleAnswer,
              answerValue: "",
              possibleAnswers: item.possibleAnswers.map((possibleAnswer) => {
                if (possibleAnswer.key !== idPossibleAnswer) {
                  return {
                    ...possibleAnswer,
                    checked: false,
                  };
                } else {
                  return {
                    ...possibleAnswer,
                    checked: !possibleAnswer.checked,
                  };
                }
              }),
            };
          } else {
            if (
              indicatorAnswered.idIndicator === 6 &&
              item.idQuestion === 3 &&
              idPossibleAnswer === "998" &&
              idQuestion === 2
            ) {
              return {
                ...item,
                answerOption: "0",
                possibleAnswers: item.possibleAnswers.map((possibleAnswer) => {
                  if (possibleAnswer.key === "0") {
                    return {
                      ...possibleAnswer,
                      checked: true,
                    };
                  } else {
                    return {
                      ...possibleAnswer,
                      checked: false,
                    };
                  }
                }),
              };
            } else {
              return item;
            }
          }
        });
        onChangeValueAnswer(newStatusAnswers);
      }
    }
  };

  //Handle text change on inputs
  const onChangeText = (idQuestion, idPossibleAnswer, newValue) => {
    if (indicatorAnswered !== undefined) {
      if (indicatorAnswered.idIndicator === 1 && idQuestion === 1) {
        console.log("Entró a revisar IMC");
        //First check if its a number and then obtain the float value of the answer
        const valueAnswerQuestion1 = isNaN(newValue) ? 0 : parseFloat(newValue);
        if (valueAnswerQuestion1 >= 27 && valueAnswerQuestion1 < 30) {
          //We enable question 4 in indicatorAnswered
          const questionsEnabled = indicatorAnswered.questions.map(
            (question) => {
              if (question.idQuestion === 4) {
                question.enabled = true;
              }

              if (question.idQuestion === 8) {
                question.enabled = false;
              }
              // if (question.idQuestion === 6) {
              //   question.enabled = true;
              // }
              return question;
            }
          );
          setIndicatorAnswered({
            ...indicatorAnswered,
            questions: questionsEnabled,
          });
        } else if (valueAnswerQuestion1 < 27) {
          //We check if the questions are enabled equal to false, then
          //values are "999"
          const questionsEnabled = indicatorAnswered.questions.map(
            (question) => {
              if (question.idQuestion === 4) {
                question.enabled = false;
                question.answerOption = "999";
              }
              if (question.idQuestion === 5) {
                question.enabled = false;
                question.answerOption = "999";
              }
              if (question.idQuestion === 7) {
                question.enabled = false;
                question.answerOption = "999";
              }
              if (question.idQuestion === 9) {
                question.enabled = false;
                question.answerOption = "999";
              }
              return question;
            }
          );
          setIndicatorAnswered({
            ...indicatorAnswered,
            questions: questionsEnabled,
          });
        } else if (valueAnswerQuestion1 >= 30 && valueAnswerQuestion1 < 40) {
          //We enable question 4, 5 y 6 in indicatorAnswered
          const questionsEnabled = indicatorAnswered.questions.map(
            (question) => {
              if (question.idQuestion === 4) {
                question.enabled = true;
              }
              if (question.idQuestion === 5) {
                question.enabled = true;
              }
              if (question.idQuestion === 7) {
                question.enabled = true;
              }
              if (question.idQuestion === 9) {
                question.enabled = true;
              }

              return question;
            }
          );
          setIndicatorAnswered({
            ...indicatorAnswered,
            questions: questionsEnabled,
          });
        } else if (valueAnswerQuestion1 >= 40) {
          //We enable question 4, 5 y 6 in indicatorAnswered
          const questionsEnabled = indicatorAnswered.questions.map(
            (question) => {
              if (question.idQuestion === 4) {
                question.enabled = false;
                question.answerOption = "999";
              }
              if (question.idQuestion === 5) {
                question.enabled = false;
                question.answerOption = "999";
              }
              if (question.idQuestion === 7) {
                question.enabled = false;
                question.answerOption = "999";
              }
              if (question.idQuestion === 8) {
                question.enabled = true;
                // question.answerOption = "999";
              }
              if (question.idQuestion === 9) {
                question.enabled = false;
                question.answerOption = "999";
              }

              return question;
            }
          );
          setIndicatorAnswered({
            ...indicatorAnswered,
            questions: questionsEnabled,
          });
        } else {
          //We disable question 4, 5 y 6 in indicatorAnswered
          const questionsDisabled = indicatorAnswered.questions.map(
            (question) => {
              if (question.idQuestion === 4) {
                question.enabled = false;
                question.answerOption = "999";
              }
              if (question.idQuestion === 5) {
                question.enabled = false;
                question.answerOption = "999";
              }
              if (question.idQuestion === 7) {
                question.enabled = false;
                question.answerOption = "999";
              }
              if (question.idQuestion === 8) {
                question.enabled = false;
                question.answerOption = "999";
              }
              if (question.idQuestion === 9) {
                question.enabled = false;
                question.answerOption = "999";
              }

              return question;
            }
          );
          setIndicatorAnswered({
            ...indicatorAnswered,
            questions: questionsDisabled,
          });
        }
      }
    }

    //Var to save the new value of answer
    const newStatusAnswers = indicatorAnswered.questions.map((item) => {
      if (item.idQuestion === idQuestion) {
        return {
          ...item,
          answerValue: newValue,
          answerOption: "",
          possibleAnswers: item.possibleAnswers.map((possibleAnswer) => {
            if (possibleAnswer.key !== idPossibleAnswer) {
              return {
                ...possibleAnswer,
                checked: false,
              };
            }
            return possibleAnswer;
          }),
        };
      }
      return item;
    });
    onChangeValueAnswer(newStatusAnswers);
  };

  //Handle text change on inputs
  const onChangeTextSingle = (idQuestion, newValue) => {
    const newStatusAnswers = indicatorAnswered.questions.map((item) => {
      if (item.idQuestion === idQuestion) {
        return {
          ...item,
          answerValue: newValue,
          answerOption: "",
        };
      }
      return item;
    });
    onChangeValueAnswer(newStatusAnswers);
  };

  //vars and methods to disable input and buttons when editing is not allowed
  const isEditingAllowed = () => {
    return indicatorAnswered.editingAllowed;
  };

  return (
    <View>
      {(() => {
        switch (item.typeQuestion) {
          case 1:
            return (
              <View style={[styles.answersContainer, columnStyle()]}>
                <View style={styles.answersContainerUp}>
                  {item.possibleAnswers
                    .filter(
                      (possibleAnswer) => possibleAnswer.value === "value"
                    )
                    .map((possibleAnswer) => (
                      <TextInput
                        key={possibleAnswer.key}
                        editable={isEditingAllowed()}
                        keyboardType="numeric"
                        idQuestion={item.idQuestion}
                        placeholderTextColor={COLORS.disabled3}
                        placeholder={
                          possibleAnswer.placeholder
                            ? possibleAnswer.placeholder
                            : ""
                        }
                        style={[
                          styles.textInputNumeric,
                          {
                            color: isEditingAllowed()
                              ? COLORS.secondary2
                              : COLORS.disabled3,
                          },
                        ]}
                        onChangeText={(text) =>
                          onChangeText(
                            item.idQuestion,
                            possibleAnswer.key,
                            text
                          )
                        }
                        value={
                          item.possibleAnswers
                            .filter(
                              (possibleAnswer) =>
                                possibleAnswer.idQuestion === item.idQuestion
                            )
                            .map((possibleAnswer) => item.answerValue)[0]
                        }
                      ></TextInput>
                    ))}
                </View>
                <View style={styles.answersContainerDown}>
                  <View style={styles.answersContainerDownCenter}>
                    {item.possibleAnswers
                      .filter(
                        (possibleAnswer) => possibleAnswer.value !== "value"
                      )
                      .map((possibleAnswer) => (
                        <Pressable
                          disabled={!isEditingAllowed()}
                          onPress={() =>
                            onPressOption(
                              item.idQuestion,
                              possibleAnswer.key,
                              possibleAnswer.value
                            )
                          }
                          key={possibleAnswer.key}
                          idQuestion={item.idQuestion}
                          style={[
                            styles.answerWithTextInput,
                            styleButtons(
                              // item.possibleAnswers,
                              item.idQuestion,
                              possibleAnswer.key,
                              // possibleAnswer.key,
                              possibleAnswer.value
                            ),
                          ]}
                        >
                          <MyAppText
                            style={[
                              styles.textInputNotFound,
                              styleTextButton(
                                // answers,
                                item.idQuestion,
                                possibleAnswer.key,
                                possibleAnswer.value
                              ),
                            ]}
                            typeFont="Regular"
                          >
                            {notFoundNotApplicableTranslation(
                              possibleAnswer.value
                            )}
                          </MyAppText>
                        </Pressable>
                      ))}
                  </View>
                </View>
              </View>
            );
          case 2:
            return (
              <View>
                <TextInput
                  style={styles.textInputText}
                  idQuestion={item.idQuestion}
                ></TextInput>
              </View>
            );

          case 3: //With yes or no options
            return (
              // <View style={[styles.answersContainer, columnStyle()]}>
              <View style={[styles.answersContainer]}>
                <View style={styles.answersContainerUpMultipleOptions}>
                  {item.possibleAnswers
                    .filter(
                      (possibleAnswer) =>
                        possibleAnswer.value !== "No aplica" &&
                        possibleAnswer.value !== "No encontrado"
                    )
                    .map((possibleAnswer) => (
                      <Pressable
                        disabled={!isEditingAllowed()}
                        onPress={() =>
                          onPressOption(
                            item.idQuestion,
                            possibleAnswer.key,
                            possibleAnswer.value
                          )
                        }
                        idQuestion={item.idQuestion}
                        key={possibleAnswer.key}
                        style={[
                          {
                            borderColor: colorBorderYesNo(item.value),
                            width: widthAnswer(),
                          },
                          styles.answer,
                          styleButtons(
                            // answers,
                            item.idQuestion,
                            possibleAnswer.key,
                            possibleAnswer.value
                          ),
                        ]}
                      >
                        <MyAppText
                          style={[
                            styles.textInputClosedYesNo,
                            {
                              color: colorBorderYesNo(possibleAnswer.value),
                            },
                            styleTextButton(
                              // answers,
                              item.idQuestion,
                              possibleAnswer.key,
                              possibleAnswer.value
                            ),
                          ]}
                          typeFont="Regular"
                        >
                          {possibleAnswer.value}
                        </MyAppText>
                      </Pressable>
                    ))}
                </View>
                <View style={styles.answersContainerDown}>
                  <View style={styles.answersContainerDownCenter}>
                    {item.possibleAnswers
                      .filter(
                        (possibleAnswer) =>
                          possibleAnswer.value === "No aplica" ||
                          possibleAnswer.value === "No encontrado"
                      )
                      .map((possibleAnswer) => (
                        <Pressable
                          disabled={!isEditingAllowed()}
                          onPress={() =>
                            onPressOption(
                              item.idQuestion,
                              possibleAnswer.key,
                              possibleAnswer.value
                            )
                          }
                          idQuestion={item.idQuestion}
                          key={possibleAnswer.key}
                          style={[
                            styles.answerWithTextInput,
                            styleButtons(
                              // item.possibleAnswers,
                              item.idQuestion,
                              possibleAnswer.key,
                              // possibleAnswer.key,
                              possibleAnswer.value
                            ),
                          ]}
                        >
                          <MyAppText
                            style={[
                              styles.textInputNotFound,
                              styleTextButton(
                                // answers,
                                item.idQuestion,
                                possibleAnswer.key,
                                possibleAnswer.value
                              ),
                            ]}
                            typeFont="Regular"
                          >
                            {notFoundNotApplicableTranslation(
                              possibleAnswer.value
                            )}
                          </MyAppText>
                        </Pressable>
                      ))}
                  </View>
                </View>
              </View>
            );
          case 4:
            return (
              <View style={styles.answersContainer}>
                {item.possibleAnswers.map((possibleAnswer) => (
                  <Pressable
                    disabled={!isEditingAllowed()}
                    onPress={() =>
                      onPressOption(item.idQuestion, possibleAnswer.key)
                    }
                    idQuestion={item.idQuestion}
                    key={possibleAnswer.key}
                    style={[
                      styles.answer,
                      {
                        borderColor: colorBorderYesNo(item.value),
                      },
                    ]}
                  >
                    <MyAppText
                      style={[
                        styles.textInputClosedYesNo,
                        {
                          color: colorBorderYesNo(item.value),
                        },
                      ]}
                      typeFont="Regular"
                    >
                      {possibleAnswer.value}
                    </MyAppText>
                  </Pressable>
                ))}
              </View>
            );
          case 5:
            return (
              //create a text input avoiding the keyboard
              <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={47}
                style={{ flex: 1 }}
              >
                <TextInput
                  editable={isEditingAllowed()}
                  style={[
                    styles.textInputTextType5,
                    {
                      color: isEditingAllowed()
                        ? COLORS.secondary2
                        : COLORS.disabled3,
                    },
                  ]}
                  placeholder={item.Question}
                  placeholderTextColor={COLORS.disabled3}
                  onChangeText={(text) =>
                    onChangeTextSingle(item.idQuestion, text)
                  }
                  value={item.answerValue}
                  inputStyle={{ textAlignVertical: "top" }}
                  multiline={true}
                ></TextInput>
              </KeyboardAvoidingView>
            );

          default:
            return null;
        }
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  textInputNumeric: {
    width: 80,
    height: 40,
    borderColor: COLORS.disabled3,
    textAlign: "right",
    paddingRight: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 16,
    fontSize: 14,
  },
  textInputText: {
    width: 100,
    height: 40,
    borderColor: COLORS.disabled3,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 8,
  },

  answersContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginLeft: 4,
    marginRight: 4,
  },

  answersContainerUp: {
    flexDirection: "row",
    justifyContent: "center",
  },
  answersContainerUpMultipleOptions: {
    flexDirection: "row",
    width: "100%",
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: "space-evenly",
  },
  answersContainerDown: {
    height: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  answersContainerDownCenter: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 20,
    width: 80,
  },

  answer: {
    marginTop: 8,
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: "center",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
  },

  answerWithTextInput: {
    marginTop: 0,
    width: 90,
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: "center",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.tertiary1,
  },
  textInputClosedYesNo: {
    fontSize: 14,
  },
  textInputTextType5: {
    marginTop: 8,
    width: "75%",
    height: 60,
    borderColor: COLORS.disabled3,
    color: COLORS.darkGray,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  textInputNotFound: {
    fontSize: 12,
    textAlign: "center",
  },
});
