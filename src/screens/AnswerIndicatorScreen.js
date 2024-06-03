import {
  View,
  StyleSheet,
  StatusBar,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useCallback, useState } from "react";
//To store data
import AsyncStorage from "@react-native-async-storage/async-storage";
//To generate unique id
import uuid from "react-native-uuid";
//To use pickers
import DropDownPicker from "react-native-dropdown-picker";
//Context info
import useApp from "../hooks/useApp.js";
//Get info from API
import { getTypesAge } from "../api/indicators.js";
//Components
import QuestionItem from "../components/QuestionItem.js";
//Colors
import { COLORS } from "../utils/constants.js";
//Styled text
import MyAppText from "../components/componentStyles/MyAppText.js";
//Icons
import BackArrow from "../../assets/backArrow.svg";
import Edit from "../../assets/edit.svg";

export default function AnswerIndicatorScreen({ navigation, route }) {
  //Global context info
  const {
    stateApp,
    municipalityApp,
    clinicApp,
    userApp,
    indicatorActiveApp,
    indicatorAnswered,
    setIndicatorAnswered,
  } = useApp();

  //Getting indicator answered from props, in case it exists
  const { indicatorAnsweredFromProps } = route.params;

  //Method to enable/disable editing when indicator comes from props
  const [editingAllowed, setEditingAllowed] = useState(false);

  const enableEditing = () => {
    //First we assure if indicator status is 0
    if (indicatorAnswered.status !== 1) {
      // only enters when is saved or sent with errors
      //We enable editing
      setEditingAllowed(true);
      indicatorAnswered.editingAllowed = true;
    } else {
      //We show an alert
      Alert.alert(
        "Cuestionario enviado",
        "No puedes editar el cuestionario porque ya fue enviado",
        [
          {
            text: "Aceptar",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );
    }
  };
  useState(true);
  //Loading info from indicator answered
  useEffect(() => {
    (async () => {
      try {
        if (
          indicatorAnsweredFromProps === undefined ||
          indicatorAnsweredFromProps === null
        ) {
          //Check if we have an indicator answered in local storage in same stage as current to get info from  idQuestion 101, 102, 103, 104, 105
          const existingAnswers = await AsyncStorage.getItem(
            "@answersIndicator0.1"
          );
          //if there are answers, we parse them
          let numberMethodVerificationAnswerValue = "";
          let ageAnswerValue = "";
          let typeAgeAnswerValue = "";
          //Getting numbers of state, municipality, clinic and user, to use in several steps
          const idStateNumber = isNaN(stateApp.value)
            ? 0
            : parseInt(stateApp.value);
          const idMunicipalityNumber = isNaN(municipalityApp.value)
            ? 0
            : parseInt(municipalityApp.value);
          const idClinicNumber = isNaN(clinicApp.value)
            ? 0
            : parseInt(clinicApp.value);

          const idUserNumber = isNaN(userApp.idUser)
            ? 0
            : parseInt(userApp.idUser);

          if (existingAnswers !== null && existingAnswers !== undefined) {
            const answersParsed = JSON.parse(existingAnswers);
            //we get the indicator answered in same stage as current
            //Filter only the indicators in same state, municipality, clinic and user
            //Filtering
            const indicatorAnsweredSameStageLast = answersParsed
              .filter(
                (answer) =>
                  answer.stage === indicatorActiveApp.stage &&
                  answer.status === 0 &&
                  answer.idIndicator !== indicatorActiveApp.idIndicator &&
                  answer.idState === idStateNumber &&
                  answer.idMunicipality === idMunicipalityNumber &&
                  answer.idClinic === idClinicNumber &&
                  answer.idUser === idUserNumber
              )
              .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            //Get the last in same stage
            if (indicatorAnsweredSameStageLast !== undefined) {
              const numberMethodVerificationPrevious =
                indicatorAnsweredSameStageLast.questions.find(
                  (question) => question.idQuestion === 102
                );

              if (numberMethodVerificationPrevious !== undefined) {
                numberMethodVerificationAnswerValue =
                  numberMethodVerificationPrevious.answerValue;
              }

              const agePrevious =
                indicatorAnsweredSameStageLast?.questions.find(
                  (question) => question.idQuestion === 104
                );

              if (agePrevious !== undefined) {
                ageAnswerValue = agePrevious.answerValue;
              }

              const typeAgePrevious =
                indicatorAnsweredSameStageLast.questions.find(
                  (question) => question.idQuestion === 105
                );
              if (typeAgePrevious !== undefined) {
                typeAgeAnswerValue = typeAgePrevious.answerValue;
              }
              //   //We set the values of the inputs and dropdowns
            }
            //first check if we colleted data
            if (
              numberMethodVerificationAnswerValue !== "" &&
              ageAnswerValue !== "" &&
              typeAgeAnswerValue !== ""
            ) {
              //We ask the user if he wants to use the data through a modal
              Alert.alert(
                "¿Desea utilizar los datos capturados anteriormente?",
                "Se utilizarán los datos del encabezado del indicador anterior para la etapa",
                [
                  {
                    text: "Cancelar",
                    onPress: () => {
                      //We set the values to ""
                      numberMethodVerificationAnswerValue = "";
                      ageAnswerValue = "";
                      typeAgeAnswerValue = "";
                      if (indicatorAnswered?.questions !== undefined) {
                        setInputMethodVerification("");
                        setInputAge("");
                        setTypeAge("");
                      }
                    },
                    style: "cancel",
                  },
                  {
                    text: "Aceptar",
                    onPress: () => {
                      //Nothing to do, because the values are used below
                    },
                  },
                ],
                { cancelable: false }
              );
            }
          }
          //then status answers
          const questionsArray = [];

          //First we fill with three elements to save
          //method number and age
          //Method number
          questionsArray.push({
            idQuestion: 102, //We define this high number to avoid conflicts with the id of the questions
            question: "Selección de número de método",
            forCalculation: false,
            enabled: true,
            subindicator: 0,
            nameSubindicator: "",
            possibleAnswers: [],
            answerOption: "",
            answerValue: numberMethodVerificationAnswerValue,
          });
          //Age
          questionsArray.push({
            idQuestion: 104, //We define this high number to avoid conflicts with the id of the questions
            question: "Edad",
            forCalculation: false,
            enabled: true,
            subindicator: 0,
            nameSubindicator: "",
            possibleAnswers: [],
            answerOption: "",
            answerValue: ageAnswerValue,
          });
          //type of age
          questionsArray.push({
            idQuestion: 105, //We define this high number to avoid conflicts with the id of the questions
            question: "Tiempo",
            forCalculation: false,
            enabled: true,
            subindicator: 0,
            nameSubindicator: "",
            possibleAnswers: [],
            answerOption: "",
            answerValue: typeAgeAnswerValue,
          });

          //Then we fill with the questions of the indicator template
          indicatorActiveApp.questions.forEach((question) => {
            questionsArray.push({
              idQuestion: question.idQuestion,
              typeQuestion: question.typeQuestion,
              Question: question.Question,
              forCalculation: question.forCalculation,
              enabled: question.enabled,
              subindicator: question.subindicator,
              nameSubindicator: question.nameSubindicator,
              possibleAnswers: question.possibleAnswers.map(
                (possibleAnswer) => {
                  return {
                    idQuestion: question.idQuestion,
                    value: possibleAnswer.value,
                    key: possibleAnswer.key,
                    checked: false,
                    placeholder: possibleAnswer.placeholder,
                  };
                }
              ),
              answerOption: "",
              answerValue: "",
            });
          });

          //We start an indicator answered from zero
          //first general structure
          const idForAnswers = uuid.v4();
          const indicatorAnsweredTemp = {
            id: idForAnswers,
            idState: idStateNumber,
            idMunicipality: idMunicipalityNumber,
            idClinic: idClinicNumber,
            idUser: idUserNumber,
            nameUser: userApp.name,
            lastNameUser: userApp.lastName,
            lastName2User: userApp.lastName2,
            date: new Date(),
            idIndicator: indicatorActiveApp.idIndicator,
            key: indicatorActiveApp.key,
            name: indicatorActiveApp.name,
            target: indicatorActiveApp.target,
            stage: indicatorActiveApp.stage,
            color: indicatorActiveApp.color,
            status: 0, // 0 means saved
            errorInSave: "",
            errorInSend: "",
            editingAllowed: true,
            questions: questionsArray,
          };
          // //save questionsArray into indicatorAnsweredTemp's questions
          setIndicatorAnswered(indicatorAnsweredTemp);
          //if numberMethodVerificationPrevious.answerValue is different from "" we set it
          if (numberMethodVerificationAnswerValue !== "") {
            setInputMethodVerification(numberMethodVerificationAnswerValue);
          }
          //if agePrevious.answerValue is different from "" we set it
          if (ageAnswerValue !== "") {
            setInputAge(ageAnswerValue);
          }
          //if typeAgePrevious.answerValue is different from "" we set it
          if (typeAgeAnswerValue !== "") {
            setTypeAge(typeAgeAnswerValue);
          }
        } else {
          //Functionality to load an indicator answered from the records screen
          //We set the indicator answered from the props
          setIndicatorAnswered(indicatorAnsweredFromProps);
          //To fill the inputs with the values from the indicator answered
          //Method number
          const methodNumber = indicatorAnsweredFromProps.questions.find(
            (question) => question.idQuestion === 102
          );
          if (methodNumber.answerValue !== "") {
            setInputMethodVerification(methodNumber.answerValue);
          }
          //Age
          const age = indicatorAnsweredFromProps.questions.find(
            (question) => question.idQuestion === 104
          );
          if (age.answerValue !== "") {
            setInputAge(age.answerValue);
          }
          //Type of age
          const typeAge = indicatorAnsweredFromProps.questions.find(
            (question) => question.idQuestion === 105
          );
          if (typeAge.answerValue !== "") {
            setTypeAge(typeAge.answerValue);
          }
          //Define the last changes saved as true
          setLastChangesSaved(true);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  //Values for inputs
  const [inputMethodVerification, setInputMethodVerification] = useState("");
  const [inputAge, setInputAge] = useState("");
  //Values for dropdowns
  const [typeAge, setTypeAge] = useState([]);

  //Methods to handle changes in method verification and age
  const onChangeValueMethodVerificationInput = (value) => {
    const statusAnswersNew = indicatorAnswered.questions.map((statusAnswer) => {
      if (statusAnswer.idQuestion === 102) {
        statusAnswer.answerValue = value;
      }
      return statusAnswer;
    });
    setInputMethodVerification(value);
    onChangeValueAnswer(statusAnswersNew);
  };

  //Age input
  const onChangeValueAgeInput = (value) => {
    //Validations
    if (
      isNaN(value) ||
      value === "" ||
      value === undefined ||
      value === null ||
      value < 0
    ) {
      value = "";
    }
    //then check if is idIndicator ===6, if age is greater than 18 not permitted
    if (indicatorActiveApp.idIndicator === 6) {
      if (value > 18) {
        //if it's greater than 18, we set the value to ""
        //show alert
        Alert.alert(
          "Edad no permitida",
          "La edad no puede ser mayor a 18 años",
          [
            {
              text: "Aceptar",
              onPress: () => {
                //Nothing to do, because the values are used below
              },
            },
          ],
          { cancelable: false }
        );

        value = "";
      }
    }
    const statusAnswersNew = indicatorAnswered.questions.map((statusAnswer) => {
      if (statusAnswer.idQuestion === 104) {
        statusAnswer.answerValue = value;
      }
      return statusAnswer;
    });
    setInputAge(value);
    onChangeValueAnswer(statusAnswersNew);
  };

  //Values and methods for the dropdown picker of the type age (days, weeks, months, years)
  const [typesAge, setTypesAge] = useState([]);
  const [typeAgeOpen, setTypeAgeOpen] = useState(false);
  const [loadingTypesAge, setLoadingTypesAge] = useState(false);
  const [errorLoadingTypesAge, setErrorLoadingTypesAge] = useState(undefined);

  //Effect to load the types of age in the dropdown
  useEffect(() => {
    (async () => {
      //clear storage disabled, activate only for development
      //AsyncStorage.clear();
      setLoadingTypesAge(true);
      setErrorLoadingTypesAge(false);
      try {
        const typeAgeApi = await getTypesAge(indicatorActiveApp.idIndicator);
        const typeAgesList = [];
        typeAgeApi.forEach((typeAge) => {
          typeAgesList.push({
            label: typeAge.nameTypeAge,
            value: typeAge.idTypeAge,
          });
        });

        setTypesAge(typeAgesList);
      } catch (error) {
        setErrorLoadingTypesAge(true);
        console.log("Error loading TypeAges", error);
      } finally {
        setLoadingTypesAge(false);
      }
    })();
  }, []);

  //Method to handle changes in answers
  const onChangeValueAnswer = (statusAnswers) => {
    setLastChangesSaved(false);
    setIndicatorAnswered({ ...indicatorAnswered, questions: statusAnswers });
  };

  const onChangeValueTypeAge = (value) => {
    if (value !== null) {
      const statusAnswersNew = indicatorAnswered?.questions?.map(
        (statusAnswer) => {
          if (statusAnswer.idQuestion === 105) {
            statusAnswer.answerValue = value;
          }
          return statusAnswer;
        }
      );
      onChangeValueAnswer(statusAnswersNew);
    }
  };

  const onTypeAgeOpen = useCallback(() => {
    if (indicatorAnswered?.editingAllowed === false) {
    }
  }, []);

  //Methods and vars to handle saving

  //Circle indicator on top to show if there are new changes
  const [lastChangesSaved, setLastChangesSaved] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [loadingSaveAnswers, setLoadingSaveAnswers] = useState(false);
  const [errorSaveAnswers, setErrorSaveAnswers] = useState(undefined);

  //Method to receive press button save
  const saveAnswers = () => {
    //check if all questions are answered
    const allQuestionsAnswered = checkIfAllQuestionsAnswered();
    if (allQuestionsAnswered) {
      //We save indicator answered in local storage
      const response = saveAnswersAsync();
      return response;
    } else {
      //We show an alert
      Alert.alert(
        "Faltan respuestas",
        "Debes responder todas las preguntas para poder guardar el cuestionario",
        [
          {
            text: "Aceptar",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );
      return 0;
    }
  };

  //Method to check if all questions are answered
  const checkIfAllQuestionsAnswered = () => {
    //
    const questionsEnabled = indicatorAnswered.questions.filter(
      (answer) => answer.enabled && answer.typeQuestion !== 5
    );
    //All questions different from observaciones (typeQuestion = 5)
    const allQuestionsAnswered = questionsEnabled.every((statusAnswer) => {
      return (
        statusAnswer.answerOption !== "" || statusAnswer.answerValue !== ""
      );
    });
    return allQuestionsAnswered;
  };

  _storeData = async (indicatorAnswered) => {
    try {
      //First check if there exists an indicatorAnswered with same id in storage
      const existingAnswers = await AsyncStorage.getItem(
        "@answersIndicator0.1"
      );
      indicatorAnswered.status = 0;
      //if there are answers, we parse them
      if (existingAnswers !== null) {
        const answersParsed = JSON.parse(existingAnswers);
        //Check if there exists an indicatorAnswered with same id
        //if it exists, we replace it
        //if it doesn't exist, we add it
        const indexIndicatorAnswered = answersParsed.findIndex(
          (answer) => answer.id === indicatorAnswered.id
        );
        if (indexIndicatorAnswered !== -1) {
          //if it exists, we replace it
          answersParsed[indexIndicatorAnswered] = indicatorAnswered;
        } else {
          //it doesn't exist, we add it
          answersParsed.push(indicatorAnswered);
        }
        //we save the answers
        await AsyncStorage.setItem(
          "@answersIndicator0.1",
          JSON.stringify(answersParsed)
        );
        //Then we calculate if the indicator is fulfilled or not while saving
        calculateFulfilling(indicatorAnswered);
      } else {
        //if there are no answers, we create an array with the new answer
        const answersArray = [];
        answersArray.push(indicatorAnswered);
        //we save the answers
        await AsyncStorage.setItem(
          "@answersIndicator0.1",
          JSON.stringify(answersArray)
        );
        //Then we calculate if the indicator is fulfilled or not while saving
        calculateFulfilling(indicatorAnswered);
      }
    } catch (error) {
      throw error;
    }
  };

  //Method to save if an indicator is fulfilled
  //This info is used in screen with colors of traffic lights
  _storeResults = async (results, type) => {
    try {
      //Check if there exits results with same type: "indicator" "stage" and "subindicator" in storage
      const existingResults = await AsyncStorage.getItem(type);
      //if there are results, we parse them
      if (existingResults !== null) {
        const resultsParsed = JSON.parse(existingResults);
        //we add the new results
        resultsParsed.push(results);
        await AsyncStorage.setItem(type, JSON.stringify(resultsParsed));
      } else {
        //if there are no results, we create an array with the new result
        const resultsArray = [];
        resultsArray.push(results);
        //we save the results
        await AsyncStorage.setItem(type, JSON.stringify(resultsArray));
      }
    } catch (error) {
      throw error;
    }
  };

  //Method to calculate if indicator fulfilled or not
  //then save in local storage with results by indicator, stage and subindicator
  const calculateFulfilling = (indicatorAnswered) => {
    const idIndicator = indicatorAnswered.idIndicator;
    const stage = indicatorAnswered.stage;
    const questions = indicatorAnswered.questions;

    //Transform string to number checking befor if its number
    const idStateNumber = isNaN(stateApp.value) ? 0 : parseInt(stateApp.value);
    const idMunicipalityNumber = isNaN(municipalityApp.value)
      ? 0
      : parseInt(municipalityApp.value);
    const idClinicNumber = isNaN(clinicApp.value)
      ? 0
      : parseInt(clinicApp.value);
    const idUserNumber = isNaN(userApp.idUser) ? 0 : parseInt(userApp.idUser);

    //First we check if the indicator have subindicators in questions and saved the idSubindicator in an array
    let subindicators = [];
    questions.forEach((question) => {
      if (question.subindicator !== 0) {
        subindicators.push({
          id: indicatorAnswered.id,
          subindicator: question.subindicator,
          nameSubindicator: question.nameSubindicator,
          result: 0,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,
          date: new Date(),
          status: 0,
        });
      }
    });
    //Delete repeated subindicators
    subindicators = subindicators.filter(
      (subindicator, index, self) =>
        index ===
        self.findIndex((t) => t.subindicator === subindicator.subindicator)
    );
    //Creating an array to save results by idIndicator, stage and subindicator
    let resultsByIndicator = [];
    let resultsByStage = [];
    let resultsBySubindicator = [];

    //Going through each question to calculate the result if all the questions that have subindicator, that subindicator count as 1
    if (idIndicator === 1) {
      //First we obtain the value of IMC of idQuestion 1
      const imc = questions.find((question) => question.idQuestion === 1);
      const imcValue = isNaN(imc.answerValue) ? 0 : parseFloat(imc.answerValue);
      //then we obtain the answerValue of "dietRecommendation" of idQuestion 2
      const dietRecommendation = questions.find(
        (question) => question.idQuestion === 2
      ).answerOption;
      //then we obtain the answerValue of "exerciseRecommendation" of idQuestion 3
      const exerciseRecommendation = questions.find(
        (question) => question.idQuestion === 3
      ).answerOption;
      //Now comorbilities
      let comorbilities = "0";
      comorbilities = questions.find((question) => question.idQuestion === 4);
      if (comorbilities !== undefined) {
        comorbilities = comorbilities.answerOption;
      }
      //Sucessful treatment
      let sucessful = "0";
      sucessful = questions.find((question) => question.idQuestion === 5);
      if (sucessful !== undefined) {
        sucessful = sucessful.answerOption;
      }
      //Treatment
      let treatment = "0";
      treatment = questions.find((question) => question.idQuestion === 6);
      if (treatment !== undefined) {
        treatment = treatment.answerOption;
      }
      //Recomendations
      const recomendationsMedic = questions.find(
        (question) => question.idQuestion === 7
      ).answerOption;
      //Recomendations surgical
      const recomendationsSurgical = questions.find(
        (question) => question.idQuestion === 8
      ).answerOption;

      //Set results in default values
      let isFulfilledIndicator = 0;
      let isFulfilledsubIndicator1_1 = 0;
      let isFulfilledsubIndicator1_2 = 0;
      let isFulfilledsubIndicator1_3 = 0;
      let isFulfilledsubIndicator1_4 = 0;

      if (dietRecommendation === "1") {
        isFulfilledsubIndicator1_1 = 1;
      }
      if (exerciseRecommendation === "1") {
        isFulfilledsubIndicator1_2 = 1;
      }

      if (imcValue > 0 && imcValue < 25) {
        //con este IMC, si dan otras recomendaciones, entonces no se cumple ni 1.1 ni 1.2
        if (recomendationsMedic === "1" || recomendationsSurgical === "1") {
          isFulfilledsubIndicator1_1 = 0;
          isFulfilledsubIndicator1_2 = 0;
        }
        //El indicador se cumple si 1_1 y 1_2 son 1
        if (
          isFulfilledsubIndicator1_1 === 1 &&
          isFulfilledsubIndicator1_2 === 1
        ) {
          isFulfilledIndicator = 1;
        }
        //No aplicables
        isFulfilledsubIndicator1_3 = -1;
        isFulfilledsubIndicator1_4 = -1;
      } else if (imcValue >= 27 && imcValue < 30) {
        if (comorbilities === "0" && sucessful === "0") {
          if (recomendationsMedic === "1") {
            isFulfilledsubIndicator1_3 = 1;
          }
        }
        isFulfilledsubIndicator1_4 = -1;
      } else if (imcValue >= 30 && imcValue < 35) {
        if (sucessful === "1" && comorbilities === "1" && treatment === "0") {
          isFulfilledsubIndicator1_4 = -1;
        }
      } else if (imcValue >= 35 && imcValue < 40) {
        if (comorbilities === "0" && sucessful === "0" && treatment === "1") {
          if (recomendationsMedic === "1") {
            isFulfilledsubIndicator1_3 = 1;
          }
          if (recomendationsSurgical === "1") {
            isFulfilledsubIndicator1_4 = 1;
          }
        }
      } else if (imcValue >= 40) {
        if (sucessful === "0" && treatment === "0") {
          if (recomendationsMedic === "1") {
            isFulfilledsubIndicator1_3 = 1;
          }

          if (recomendationsSurgical === "1") {
            isFulfilledsubIndicator1_4 = 1;
          }
        }
      }

      //Check if all subindicators are 1 to set the indicator as fulfilled
      isFulfilledIndicator =
        isFulfilledsubIndicator1_1 === 1 &&
        isFulfilledsubIndicator1_2 === 1 &&
        (isFulfilledsubIndicator1_3 === 1 ||
          isFulfilledsubIndicator1_3 === -1) &&
        (isFulfilledsubIndicator1_4 === 1 || isFulfilledsubIndicator1_4 === -1)
          ? 1
          : 0;

      //add the result to the arrays, by indicator, stage and subindicator
      resultsByIndicator.push({
        id: indicatorAnswered.id,
        name: indicatorAnswered.name,

        idIndicator: idIndicator,
        stage: stage,
        //Value 1 if all isFullFilled subindicators are 1
        result: isFulfilledIndicator,
        idState: idStateNumber,
        idMunicipality: idMunicipalityNumber,
        idClinic: idClinicNumber,
        idUser: idUserNumber,
        nameUser: userApp.name,
        lastNameUser: userApp.lastName,
        lastName2User: userApp.lastName2,
        status: 0, //saved
      });
      resultsByStage.push({
        id: indicatorAnswered.id,
        stage: stage,
        idState: idStateNumber,
        idMunicipality: idMunicipalityNumber,
        idClinic: idClinicNumber,
        idUser: idUserNumber,
        nameUser: userApp.name,
        lastNameUser: userApp.lastName,
        lastName2User: userApp.lastName2,

        result: isFulfilledIndicator,
        status: 0, //saved
      });
      resultsBySubindicator.push({
        id: indicatorAnswered.id,
        idIndicator: idIndicator,
        stage: stage,
        subindicator: 1.1,
        nameSubindicator: subindicators.find(
          (subindicator) => subindicator.subindicator === 1.1
        ).nameSubindicator,
        idState: idStateNumber,
        idMunicipality: idMunicipalityNumber,
        idClinic: idClinicNumber,
        idUser: idUserNumber,
        nameUser: userApp.name,
        lastNameUser: userApp.lastName,
        lastName2User: userApp.lastName2,

        result: isFulfilledsubIndicator1_1,
        status: 0, //saved
      });

      resultsBySubindicator.push({
        id: indicatorAnswered.id,
        idIndicator: idIndicator,
        stage: stage,
        subindicator: 1.2,
        nameSubindicator: subindicators.find(
          (subindicator) => subindicator.subindicator === 1.2
        ).nameSubindicator,
        idState: idStateNumber,
        idMunicipality: idMunicipalityNumber,
        idClinic: idClinicNumber,
        idUser: idUserNumber,
        nameUser: userApp.name,
        lastNameUser: userApp.lastName,
        lastName2User: userApp.lastName2,

        result: isFulfilledsubIndicator1_2,
        status: 0, //saved
      });

      resultsBySubindicator.push({
        id: indicatorAnswered.id,
        idIndicator: idIndicator,
        stage: stage,
        subindicator: 1.3,
        nameSubindicator: subindicators.find(
          (subindicator) => subindicator.subindicator === 1.3
        ).nameSubindicator,
        idState: idStateNumber,
        idMunicipality: idMunicipalityNumber,
        idClinic: idClinicNumber,
        idUser: idUserNumber,
        nameUser: userApp.name,
        lastNameUser: userApp.lastName,
        lastName2User: userApp.lastName2,

        result: isFulfilledsubIndicator1_3,
        status: 0, //saved
      });

      resultsBySubindicator.push({
        id: indicatorAnswered.id,
        idIndicator: idIndicator,
        stage: stage,
        subindicator: 1.4,
        nameSubindicator: subindicators.find(
          (subindicator) => subindicator.subindicator === 1.4
        ).nameSubindicator,
        idState: idStateNumber,
        idMunicipality: idMunicipalityNumber,
        idClinic: idClinicNumber,
        idUser: idUserNumber,
        nameUser: userApp.name,
        lastNameUser: userApp.lastName,
        lastName2User: userApp.lastName2,

        result: isFulfilledsubIndicator1_4,
        status: 0, //saved
      });
      //Then we save the results in local storage
    } else if (
      idIndicator === 2 ||
      idIndicator === 3 ||
      idIndicator === 6 ||
      idIndicator === 7 ||
      idIndicator === 8 ||
      idIndicator === 10 ||
      idIndicator === 11 ||
      idIndicator === 12 ||
      idIndicator === 13 ||
      idIndicator === 15 ||
      idIndicator === 16
    ) {
      if (subindicators.length > 0) {
        //go through each subindicator and check if in indicatorAnswered there is a question with that subindicator
        //if it exists, we save in subindicators array the value of the answer
        subindicators.forEach((subindicator) => {
          const questions = indicatorAnswered.questions.filter(
            (question) => question.subindicator === subindicator.subindicator
          );
          //Check if all questions of that subindicator have 1 in answerOption
          let isFulfilledSubindicator = 0;
          if (questions.length > 0) {
            isFulfilledSubindicator = questions.every(
              (question) => question.answerOption === "1"
            )
              ? 1
              : 0;
          }
          //add the result in result in subindicators array
          subindicator.result = isFulfilledSubindicator;
        });

        //Then we check if all subindicators have 1 in result
        let isFulfilledIndicator = 0;
        if (subindicators.length > 0) {
          isFulfilledIndicator = subindicators.every(
            (subindicator) => subindicator.result === 1
          )
            ? 1
            : 0;
        }

        //add the result to the arrays
        resultsByIndicator.push({
          id: indicatorAnswered.id,
          name: indicatorAnswered.name,
          idIndicator: idIndicator,
          stage: stage,
          //Value 1 if all isFullFilled subindicators are 1
          result: isFulfilledIndicator,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,
          status: 0, //saved
        });
        resultsByStage.push({
          id: indicatorAnswered.id,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,
          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsBySubindicator = subindicators;
      } else {
        //If there are no subindicators, we check if all questions have 1 in answerOption
        let isFulfilledIndicator = 0;
        if (questions.length > 0) {
          //is fulfilled if all questions have 1 in answerOption that are enabled and forCalculation = true
          //questions enabled and are for calculation
          const questionsEnabledForCalculation = questions.filter(
            (question) => question.enabled && question.forCalculation
          );
          isFulfilledIndicator = questionsEnabledForCalculation.every(
            (question) => question.answerOption === "1"
          )
            ? 1
            : 0;
        }

        //add the result to the arrays
        resultsByIndicator.push({
          id: indicatorAnswered.id,
          name: indicatorAnswered.name,
          idIndicator: idIndicator,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,

          //Value 1 if all isFullFilled subindicators are 1
          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsByStage.push({
          id: indicatorAnswered.id,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,

          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsBySubindicator = [];
      }
    } else if (idIndicator === 4) {
      if (subindicators.length > 0) {
        //go through each subindicator and check if in indicatorAnswered there is a question with that subindicator
        //if it exists, we save in subindicators array the value of the answer
        subindicators.forEach((subindicator) => {
          const questions = indicatorAnswered.questions.filter(
            (question) => question.subindicator === subindicator.subindicator
          );
          //Check if all questions of that subindicator have 1 in answerOption
          let isFulfilledSubindicator = 0;
          if (questions.length > 0) {
            isFulfilledSubindicator = questions.every(
              (question) => question.answerOption === "1"
            )
              ? 1
              : 0;
          }

          //get the value of the question 1
          const question1 = indicatorAnswered.questions.find(
            (question) => question.idQuestion === 1
          );
          if (subindicator.subindicator === 4.2) {
            //Check if it's a number then parse it
            let question1Value = 0;
            if (!isNaN(question1.answerValue)) {
              question1Value = parseFloat(question1.answerValue);
            }
            if (question1Value < 27) {
              //When the value is less than 27, then the subindicator is not applicable
              isFulfilledSubindicator = -1;
            }
          }

          //add the result in result in subindicators array
          subindicator.result = isFulfilledSubindicator;
        });

        //Then we check if all subindicators have 1 in result
        let isFulfilledIndicator = 0;
        if (subindicators.length > 0) {
          //Check if isFulfilled filtering result !== -1
          const subindicatorsFulfilled = subindicators.filter(
            (subindicator) => subindicator.result !== -1
          );
          isFulfilledIndicator = subindicatorsFulfilled.every(
            (subindicator) => subindicator.result === 1
          )
            ? 1
            : 0;
        }

        //add the result to the arrays
        resultsByIndicator.push({
          id: indicatorAnswered.id,
          name: indicatorAnswered.name,

          idIndicator: idIndicator,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,

          //Value 1 if all isFullFilled subindicators are 1
          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsByStage.push({
          id: indicatorAnswered.id,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,

          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsBySubindicator = subindicators;
      }
    } else if (idIndicator === 5) {
      if (subindicators.length > 0) {
        //go through each subindicator and check if in indicatorAnswered there is a question with that subindicator
        //if it exists, we save in subindicators array the value of the answer
        subindicators.forEach((subindicator) => {
          const questions = indicatorAnswered.questions.filter(
            (question) => question.subindicator === subindicator.subindicator
          );
          //Check if all questions of that subindicator have 1 in answerOption
          let isFulfilledSubindicator = 0;
          if (questions.length > 0) {
            isFulfilledSubindicator = questions.every(
              (question) => question.answerOption === "1"
            )
              ? 1
              : 0;
          }

          if (subindicator.subindicator === 5.1) {
            //get the value of the question of number of weeks
            const questionWeeks = indicatorAnswered.questions.find(
              (question) => question.idQuestion === 1
            );
            let questionWeeksValue = 0;
            if (!isNaN(questionWeeks.answerValue)) {
              questionWeeksValue = parseFloat(questionWeeks.answerValue);
            }
            //get the value of the question of previous
            const questionPrevious = indicatorAnswered.questions.find(
              (question) => question.idQuestion === 3
            );
            //get the value of the question of risk pregnant
            const questionRisk = indicatorAnswered.questions.find(
              (question) => question.idQuestion === 4
            );
            //Check if it's a number then parse it
            //get the number of the idQuestion 5
            const questionNumberConsults = indicatorAnswered.questions.find(
              (question) => question.idQuestion === 5
            );
            let questionNumberConsultsValue = 0;
            //Check first if it's a number
            if (!isNaN(questionNumberConsults.answerValue)) {
              questionNumberConsultsValue = parseFloat(
                questionNumberConsults.answerValue
              );
            }
            //Checking fulfillment depeding on the number of weeks
            if (questionWeeksValue < 6) {
              //When the value is less than 6, then the subindicator is not applicable
              isFulfilledSubindicator = -1;
            } else if (
              questionWeeksValue >= 6 &&
              questionWeeksValue <= 8 &&
              questionNumberConsultsValue >= 1
            ) {
              isFulfilledSubindicator = 1;
            } else if (
              questionWeeksValue >= 10 &&
              questionWeeksValue <= 16 &&
              questionNumberConsultsValue >= 2
            ) {
              isFulfilledSubindicator = 1;
            } else if (
              questionWeeksValue >= 16 &&
              questionWeeksValue <= 18 &&
              questionNumberConsultsValue >= 3
            ) {
              isFulfilledSubindicator = 1;
            } else if (
              questionWeeksValue >= 22 &&
              questionWeeksValue < 28 &&
              questionNumberConsultsValue >= 4
            ) {
              isFulfilledSubindicator = 1;
            } else if (
              questionWeeksValue >= 28 &&
              questionWeeksValue < 32 &&
              questionNumberConsultsValue >= 5
            ) {
              isFulfilledSubindicator = 1;
            } else if (
              questionWeeksValue >= 32 &&
              questionWeeksValue < 36 &&
              questionNumberConsultsValue >= 6
            ) {
              isFulfilledSubindicator = 1;
            } else if (
              questionWeeksValue >= 36 &&
              questionWeeksValue < 38 &&
              questionNumberConsultsValue >= 7
            ) {
              isFulfilledSubindicator = 1;
            } else if (questionWeeksValue >= 38 && questionWeeksValue < 41) {
              if (
                questionPrevious.answerOption === "0" &&
                questionRisk.answerOption === "0"
              ) {
                if (questionNumberConsultsValue >= 7) {
                  isFulfilledSubindicator = 1;
                } else {
                  isFulfilledSubindicator = 0;
                }
              } else {
                if (
                  questionPrevious.answerOption === "1" ||
                  questionRisk.answerOption === "1"
                ) {
                  if (questionNumberConsultsValue >= 8) {
                    isFulfilledSubindicator = 1;
                  } else {
                    isFulfilledSubindicator = 0;
                  }
                } else {
                  if (questionNumberConsultsValue >= 8) {
                    isFulfilledSubindicator = 1;
                  } else {
                    isFulfilledSubindicator = 0;
                  }
                }
              }
            } else {
              if (questionNumberConsultsValue >= 8) {
                isFulfilledSubindicator = 1;
              } else {
                isFulfilledSubindicator = 0;
              }
            }
          }

          //add the result in result in subindicators array
          subindicator.result = isFulfilledSubindicator;
        });

        //Then we check if all subindicators have 1 in result
        let isFulfilledIndicator = 0;
        if (subindicators.length > 0) {
          //Check if isFulfilled filtering result !== -1
          const subindicatorsFulfilled = subindicators.filter(
            (subindicator) => subindicator.result !== -1
          );
          isFulfilledIndicator = subindicatorsFulfilled.every(
            (subindicator) => subindicator.result === 1
          )
            ? 1
            : 0;
        }

        //add the result to the arrays
        resultsByIndicator.push({
          id: indicatorAnswered.id,
          name: indicatorAnswered.name,
          idIndicator: idIndicator,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,

          //Value 1 if all isFullFilled subindicators are 1
          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsByStage.push({
          id: indicatorAnswered.id,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,

          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsBySubindicator = subindicators;
      }
    } else if (idIndicator === 9) {
      if (subindicators.length > 0) {
        //go through each subindicator and check if in indicatorAnswered there is a question with that subindicator
        //if it exists, we save in subindicators array the value of the answer
        subindicators.forEach((subindicator) => {
          const questions = indicatorAnswered.questions.filter(
            (question) => question.subindicator === subindicator.subindicator
          );
          //Check if all questions of that subindicator have 1 in answerOption
          let isFulfilledSubindicator = 0;
          if (questions.length > 0) {
            isFulfilledSubindicator = questions.every(
              (question) => question.answerOption === "1"
            )
              ? 1
              : 0;
          }

          if (subindicator.subindicator === 9.1) {
            //get the value of the question 1 to get if it has consults earlier than 6 months
            const question1 = indicatorAnswered.questions.find(
              (question) => question.idQuestion === 1
            );
            //When it doesn't have consults earlier than 6 months, then the subindicator is not applicable
            if (question1.answerOption === "0") {
              isFulfilledSubindicator = -1;
            }
          }

          //add the result in result in subindicators array
          subindicator.result = isFulfilledSubindicator;
        });

        //Then we check if all subindicators have 1 in result
        let isFulfilledIndicator = 0;
        if (subindicators.length > 0) {
          //Check if isFulfilled filtering result !== -1
          const subindicatorsFulfilled = subindicators.filter(
            (subindicator) => subindicator.result !== -1
          );
          isFulfilledIndicator = subindicatorsFulfilled.every(
            (subindicator) => subindicator.result === 1
          )
            ? 1
            : 0;
        }

        //add the result to the arrays
        resultsByIndicator.push({
          id: indicatorAnswered.id,
          name: indicatorAnswered.name,
          idIndicator: idIndicator,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,

          //Value 1 if all isFullFilled subindicators are 1
          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsByStage.push({
          id: indicatorAnswered.id,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,

          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsBySubindicator = subindicators;
      }
    } else if (idIndicator === 14) {
      if (subindicators.length > 0) {
        //go through each subindicator and check if in indicatorAnswered there is a question with that subindicator
        //if it exists, we save in subindicators array the value of the answer
        subindicators.forEach((subindicator) => {
          const questions = indicatorAnswered.questions.filter(
            (question) => question.subindicator === subindicator.subindicator
          );
          //Check if at least one question of that subindicator have 1 in answerOption
          let isFulfilledSubindicator = 0;
          if (questions.length > 0) {
            isFulfilledSubindicator = questions.some(
              (question) => question.answerOption === "1"
            )
              ? 1
              : 0;
          }

          //add the result in result in subindicators array
          subindicator.result = isFulfilledSubindicator;
        });

        //Then we check if all subindicators have 1 in result
        let isFulfilledIndicator = 0;
        if (subindicators.length > 0) {
          //Check if isFulfilled filtering result !== -1
          const subindicatorsFulfilled = subindicators.filter(
            (subindicator) => subindicator.result !== -1
          );
          isFulfilledIndicator = subindicatorsFulfilled.every(
            (subindicator) => subindicator.result === 1
          )
            ? 1
            : 0;
        }

        //add the result to the arrays
        resultsByIndicator.push({
          id: indicatorAnswered.id,
          name: indicatorAnswered.name,
          idIndicator: idIndicator,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,

          //Value 1 if all isFullFilled subindicators are 1
          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsByStage.push({
          id: indicatorAnswered.id,
          stage: stage,
          idState: idStateNumber,
          idMunicipality: idMunicipalityNumber,
          idClinic: idClinicNumber,
          idUser: idUserNumber,
          nameUser: userApp.name,
          lastNameUser: userApp.lastName,
          lastName2User: userApp.lastName2,

          result: isFulfilledIndicator,
          status: 0, //saved
        });
        resultsBySubindicator = subindicators;
      }
    }

    try {
      _storeResults(resultsByIndicator, "@resultsByIndicator0.1");
      _storeResults(resultsByStage, "@resultsByStage0.1");
      _storeResults(resultsBySubindicator, "@resultsBySubindicator0.1");
    } catch (error) {
      console.log("Error saving results", error);
    }
  };

  //Method async to save answers
  const saveAnswersAsync = async () => {
    try {
      setLoadingSaveAnswers(true);
      setErrorSaveAnswers(false);
      const response = await _storeData(indicatorAnswered);
      setLoadingSaveAnswers(false);
      setModalVisible(true);
      setLastChangesSaved(true);
      //Then send the answers to the server
      //Response if sucessful saved
      return 1;
    } catch (error) {
      console.error(error);
      setErrorSaveAnswers(true);
      Alert.alert(
        "Error",
        "Error al guardar las respuestas, por favor intenta de nuevo",
        [
          {
            text: "Aceptar",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );
      //Response if error
      return 0;
    }
  };

  //Once the answers are saved, we show a modal
  function hideModalAndGoRecordsSecreen() {
    setModalVisible(false);
    navigation.navigate("Records");
  }

  return (
    <View style={styles.bg}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Pressable
            style={styles.backPressable}
            onPress={() => navigation.goBack(null)}
          >
            <BackArrow />
          </Pressable>
          {indicatorAnswered?.editingAllowed === false ? (
            <Pressable
              style={styles.editPressable}
              onPress={() => enableEditing()}
            >
              <Edit />
            </Pressable>
          ) : null}

          <View style={styles.titleIndicator}>
            <MyAppText style={styles.title} typeFont="Regular">
              Cuestionario
            </MyAppText>
            <MyAppText style={styles.titleIndicatorText} typeFont="Regular">
              {`Indicador ${indicatorActiveApp.idIndicator}`}
            </MyAppText>
            {!lastChangesSaved && (
              <View style={styles.viewCircleNewChanges}></View>
            ) &&
            indicatorAnswered.editingAllowed === false ? (
              <MyAppText style={styles.onlyReading} typeFont="Regular">
                {"(Solo lectura)"}
              </MyAppText>
            ) : null}
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.methodVerificationContainer}>
          <View style={styles.methodVerificationContainerUp}>
            <TextInput
              style={[
                styles.textInputMethodVerification,
                {
                  color: indicatorAnswered?.editingAllowed
                    ? COLORS.secondary1
                    : COLORS.disabled3,

                  backgroundColor: indicatorAnswered?.editingAllowed
                    ? COLORS.disabled1
                    : COLORS.disabled2,
                },
              ]}
              editable={indicatorAnswered?.editingAllowed}
              placeholder="No. de expediente"
              value={inputMethodVerification}
              onChangeText={onChangeValueMethodVerificationInput}
              autoCorrect={false}
            ></TextInput>
            <View style={styles.methodVerificationContainerDownRight}>
              <TextInput
                style={[
                  styles.textInputAge,
                  {
                    color: indicatorAnswered?.editingAllowed
                      ? COLORS.secondary1
                      : COLORS.disabled3,

                    backgroundColor: indicatorAnswered?.editingAllowed
                      ? COLORS.disabled1
                      : COLORS.disabled2,
                  },
                ]}
                editable={indicatorAnswered?.editingAllowed}
                keyboardType="numeric"
                placeholder="Edad"
                value={inputAge}
                onChangeText={onChangeValueAgeInput}
                autoCorrect={false}
              ></TextInput>

              <View>
                <DropDownPicker
                  style={[
                    styles.pickerAge,
                    {
                      zIndex: 98,
                      backgroundColor: indicatorAnswered?.editingAllowed
                        ? COLORS.disabled1
                        : COLORS.disabled2,
                    },
                  ]}
                  listMode="SCROLLVIEW"
                  open={typeAgeOpen}
                  onOpen={onTypeAgeOpen}
                  value={typeAge}
                  items={typesAge}
                  setOpen={setTypeAgeOpen}
                  setValue={setTypeAge}
                  setItems={setTypeAge}
                  onChangeValue={onChangeValueTypeAge}
                  zIndex={undefined}
                  elevation={undefined}
                  dropDownDirection="top"
                  closeOnBackPressed={true}
                  activityIndicatorColor={COLORS.tertiary1}
                  activityIndicatorSize={30}
                  language="ES"
                  textStyle={{
                    fontSize: 14,
                    color: indicatorAnswered?.editingAllowed
                      ? COLORS.secondary1
                      : COLORS.disabled3,
                  }}
                  placeholder="Tiempo"
                  placeholderStyle={{
                    color: COLORS.secondary2,
                  }}
                  searchable={false}
                  containerStyle={[styles.containerPickerAge, { zIndex: 98 }]}
                  autoScroll={true}
                  dropDownContainerStyle={[
                    styles.dropDownContainerStyle,
                    {
                      zIndex: 98,
                    },
                  ]}
                />
              </View>

              {errorLoadingTypesAge && (
                <MyAppText style={styles.textError} typeFont="Regular">
                  Error cargar tipo de edad
                </MyAppText>
              )}
            </View>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.indicatorContainer}>
          <View style={styles.indicatorContainerUp}>
            <MyAppText style={styles.textTitleQuestions} typeFont="Regular">
              Preguntas
            </MyAppText>
            <View style={styles.line} />
          </View>
          <View style={styles.indicatorContainerDown}>
            <MyAppText style={styles.textInstructions} typeFont="Regular">
              NE = No encontrado, NA = No aplica, * = Requerido
            </MyAppText>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={hideModalAndGoRecordsSecreen}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <MyAppText style={styles.modalText} typeFont="Regular">
                    Guardado exitoso
                  </MyAppText>
                  <Pressable
                    style={[styles.modalButton, styles.modalButtonClose]}
                    onPress={hideModalAndGoRecordsSecreen}
                  >
                    <MyAppText style={styles.textStyle} typeFont="Bold">
                      Aceptar
                    </MyAppText>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <ScrollView
              contentContainerStyle={styles.grow}
              style={styles.scrollView}
              automaticallyAdjustKeyboardInsets={true}
            >
              <View style={styles.questionContainer}>
                {
                  //filter questions with idQuestion different
                  //from 101, 102, 103, 104 and 105
                  //because they are already rendered
                  indicatorAnswered?.questions
                    ?.filter(
                      (item) =>
                        item.idQuestion !== 101 &&
                        item.idQuestion !== 102 &&
                        item.idQuestion !== 103 &&
                        item.idQuestion !== 104 &&
                        item.idQuestion !== 105
                    )
                    ?.map((item) => (
                      <QuestionItem
                        onChangeValueAnswer={onChangeValueAnswer}
                        key={
                          //Concate idQuestion in string and question to generate a unique key
                          item.idQuestion.toString() + item.question
                        }
                        item={item}
                        isEditingAllowed={indicatorAnswered?.editingAllowed}
                      />
                    ))
                }
              </View>
              <View style={styles.buttonsEndContainer}>
                {indicatorAnswered?.editingAllowed && (
                  <Pressable
                    style={styles.buttonSave}
                    onPress={() => {
                      saveAnswers();
                    }}
                  >
                    <MyAppText style={styles.textButtonSave} typeFont="Bold">
                      Guardar
                    </MyAppText>
                  </Pressable>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 42,
    backgroundColor: COLORS.secondary3,
  },
  mainContainer: {
    flex: 1,
    margin: 4,
  },
  header: {
    flexDirection: "row",
  },
  backPressable: {
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  editPressable: {
    alignSelf: "flex-end",
  },
  titleIndicator: {
    flex: 1,
    height: 68,
    marginTop: 12,
    marginRight: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.secondary2,
    textAlign: "center",
    color: COLORS.backgroundApp,
  },
  titleIndicatorText: {
    fontSize: 14,
    color: COLORS.backgroundApp,
  },
  onlyReading: {
    position: "absolute",
    right: 0,
    top: 54,
    fontSize: 12,
    color: COLORS.disabled3,
  },
  viewCircleNewChanges: {
    position: "absolute",
    top: 46,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: COLORS.disabled3,
  },
  line: {
    height: 1,
    width: "100%",
    marginTop: 4,
    marginLeft: 4,
    marginRight: 4,
    zIndex: 1,
  },
  methodVerificationContainer: {
    height: 60,
    width: "100%",
    borderRadius: 8,
    zIndex: 98,
  },
  methodVerificationContainerUp: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    zIndex: 99,
  },
  pickerMethodVerification: {
    width: 150,
    borderRadius: 12,
    borderWidth: 0,
    marginTop: 4,
    marginLeft: 8,
    color: COLORS.white,
  },
  containerPicker: {
    width: 150,
  },
  containerPickerAge: {
    width: 120,
  },
  pickerAge: {
    width: 120,
    borderRadius: 12,
    borderWidth: 0,
    marginTop: 4,
    marginLeft: 2,
    color: COLORS.white,
  },
  dropDownContainerStyle: {
    marginTop: 4,
    marginLeft: 8,
    backgroundColor: COLORS.disabled1,
    borderWidth: 0,
  },
  textError: {
    marginTop: 4,
    marginLeft: 8,
    fontSize: 12,
    color: COLORS.primary2,
    textAlign: "center",
    width: 150,
  },
  textInputMethodVerification: {
    marginTop: 4,
    marginLeft: 16,
    paddingRight: 16,
    fontSize: 14,
    borderRadius: 12,
    width: 150,
    height: 50,
    textAlign: "right",
  },

  textInputAge: {
    marginTop: 4,
    marginLeft: 12,
    paddingRight: 8,
    fontSize: 14,
    borderRadius: 12,
    width: 50,
    height: 50,
    textAlign: "right",
  },
  methodVerificationContainerDown: {
    flex: 1,
    flexDirection: "row",
    zIndex: 98,
  },
  methodVerificationContainerDownLeft: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-evenly",
    zIndex: 98,
    marginLeft: 6,
  },
  methodVerificationContainerDownRight: {
    flex: 2,
    flexDirection: "row",
    paddingLeft: 10,
    zIndex: 98,
  },

  indicatorContainer: {
    flex: 3,
    backgroundColor: COLORS.white,
    zIndex: 94,
  },
  indicatorContainerUp: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: COLORS.backgroundApp,
    backgroundColor: COLORS.secondary3,
  },
  textTitleQuestions: {
    margin: 4,
    fontSize: 14,
    color: COLORS.backgroundApp,
    borderRadius: 8,
  },
  textInstructions: {
    margin: 4,
    fontSize: 12,
    color: COLORS.secondary3,
    borderRadius: 8,
    alignSelf: "center",
  },
  indicatorContainerDown: {
    flex: 14,
    width: "100%",
    backgroundColor: COLORS.backgroundApp,
  },

  scrollQuestions: {
    width: "100%",
    backgroundColor: COLORS.white,
    zIndex: 96,
  },
  scrollView: { width: "100%", backgroundColor: COLORS.white },
  grow: { flexGrow: 1, backgroundColor: COLORS.white },

  buttonsEndContainer: {
    marginTop: 2,
    marginBottom: 20,
    flex: 1,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: COLORS.white,
    zIndex: 97,
  },
  buttonSave: {
    width: 150,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.brightContrast,
    borderColor: COLORS.secondary2,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  buttonSend: {
    width: 150,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.secondary2,
    justifyContent: "center",
    alignItems: "center",
  },
  textButtonSave: {
    fontSize: 14,
    color: COLORS.secondary2,
  },
  textButtonSend: {
    fontSize: 14,
    color: COLORS.white,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 100,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.brightContrast,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: COLORS.secondary2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,

    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: COLORS.secondary2,
  },
  modalButton: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    backgroundColor: COLORS.secondary2,
  },
  modalButtonClose: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginTop: 16,
    backgroundColor: COLORS.secondary2,
  },
  textStyle: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTextTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.secondary2,
  },
  modalTextMessage: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
    color: COLORS.secondary2,
  },
  modalTextButton: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
    color: COLORS.secondary2,
  },
  modalTextButtonClose: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
    color: COLORS.secondary2,
  },
});
