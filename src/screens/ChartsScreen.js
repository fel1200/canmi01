//React imports
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
//Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
//Context
import useApp from "../hooks/useApp";
//Components
import ChartItem from "../components/ChartItem";
//Styled text
import MyAppText from "../components/componentStyles/MyAppText.js";
//Colors
import {
  COLORS,
  colorCirclePercentage,
  textPercentage,
} from "../utils/constants.js";
//Icons
import BackArrow from "../../assets/backArrow.svg";

export default function ChartsScreen({ navigation }) {
  //Context data
  const { stateApp, municipalityApp, clinicApp, userApp } = useApp();

  //Vars to save results
  //In results we save data depending selector
  const [results, setResults] = useState([]);

  //Here we have the results by indicator, stage and subindicator
  const [resultsByIndicator, setResultsByIndicator] = useState([]);
  const [resultsByStage, setResultsByStage] = useState([]);
  const [resultsBySubindicator, setResultsBySubindicator] = useState([]);

  //To handle loading and errors
  const [loadingResults, setLoadingResults] = useState(true);
  const [errorResults, setErrorResults] = useState(null);

  //To save totals
  const [totals, setTotals] = useState({
    counter: 0,
    counterFulfilled: 0,
  });

  //Method to get results by indicator, stage and subindicator from storage
  const getResults = async () => {
    try {
      setLoadingResults(true);
      setErrorResults(null);
      const jsonValue = await AsyncStorage.getItem("@resultsByIndicator0.1");
      const jsonValue2 = await AsyncStorage.getItem("@resultsByStage0.1");
      const jsonValue3 = await AsyncStorage.getItem(
        "@resultsBySubindicator0.1"
      );
      if (jsonValue !== null && jsonValue2 !== null && jsonValue3 !== null) {
        //Filter results considering state, municipality, clinic and user
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

        //Parse, then flatten
        const resultsByIndicatorParsed = JSON.parse(jsonValue).flat();
        const resultsByStageParsed = JSON.parse(jsonValue2).flat();
        const resultsBySubindicatorParsed = JSON.parse(jsonValue3).flat();

        //Filtering results by state, municipality, clinic and user
        const resultsByIndicatorFiltered = resultsByIndicatorParsed.filter(
          (result) => {
            return (
              result.idState === idStateNumber &&
              result.idMunicipality === idMunicipalityNumber &&
              result.idClinic === idClinicNumber &&
              result.idUser === idUserNumber
            );
          }
        );

        const resultsByStageFiltered = resultsByStageParsed.filter((result) => {
          return (
            result.idState === idStateNumber &&
            result.idMunicipality === idMunicipalityNumber &&
            result.idClinic === idClinicNumber &&
            result.idUser === idUserNumber
          );
        });

        const resultsBySubindicatorFiltered =
          resultsBySubindicatorParsed.filter((result) => {
            return (
              result.idState === idStateNumber &&
              result.idMunicipality === idMunicipalityNumber &&
              result.idClinic === idClinicNumber &&
              result.idUser === idUserNumber &&
              //-1 means not applicable
              result.result !== -1
            );
          });

        //Then group resultsByIndicatorFiltered by idIndicator, with a counter, and counterFulfilled
        //Then group resultsByStageFiltered by stage, with a counter, and counterFulfilled
        //Then group resultsBySubindicatorFiltered by idSubindicator, with a counter, and counterFulfilled

        const resultsByIndicatorFilteredGrouped =
          resultsByIndicatorFiltered.reduce((acc, item) => {
            const found = acc.find(
              (element) => element.idIndicator === item.idIndicator
            );
            if (found) {
              found.counter += 1;
              found.counterFulfilled += item.result;
              found.percentage = Math.round(
                (found.counterFulfilled / found.counter) * 100
              );
            } else {
              acc.push({
                idIndicator: item.idIndicator,
                name: item.name,
                counter: 1,
                counterFulfilled: item.result,
                percentage: Math.round(item.result * 100),
              });
            }
            return acc;
          }, []);

        const resultsByStageFilteredGrouped = resultsByStageFiltered.reduce(
          (acc, item) => {
            const found = acc.find((element) => element.stage === item.stage);
            if (found) {
              found.counter += 1;
              found.counterFulfilled += item.result;
              found.percentage = Math.round(
                (found.counterFulfilled / found.counter) * 100
              );
            } else {
              acc.push({
                stage: item.stage,
                counter: 1,
                counterFulfilled: item.result,
                percentage: Math.round(item.result * 100),
              });
            }
            return acc;
          },
          []
        );

        const resultsBySubindicatorFilteredGrouped =
          resultsBySubindicatorFiltered.reduce((acc, item) => {
            const found = acc.find(
              (element) => element.subindicator === item.subindicator
            );
            if (found) {
              found.counter += 1;
              found.counterFulfilled += item.result;
              found.percentage = Math.round(
                (found.counterFulfilled / found.counter) * 100
              );
            } else {
              acc.push({
                subindicator: item.subindicator,
                nameSubindicator: item.nameSubindicator,
                counter: 1,
                counterFulfilled: item.result,
                percentage: Math.round(item.result * 100),
              });
            }
            return acc;
          }, []);

        //Order desc to see last results first
        //Then order desc resultsByIndicatorFilteredGrouped by idIndicator
        //Then order desc resultsByStageFilteredGrouped by stage
        //Then order desc resultsBySubindicatorFilteredGrouped by subindicator

        resultsByIndicatorFilteredGrouped.sort((a, b) =>
          a.idIndicator > b.idIndicator ? 1 : -1
        );
        resultsByStageFilteredGrouped.sort((a, b) =>
          a.stage > b.stage ? 1 : -1
        );
        resultsBySubindicatorFilteredGrouped.sort((a, b) =>
          a.subindicator > b.subindicator ? 1 : -1
        );

        setResultsByIndicator(resultsByIndicatorFilteredGrouped);
        setResultsByStage(resultsByStageFilteredGrouped);
        setResultsBySubindicator(resultsBySubindicatorFilteredGrouped);

        //Calculating totals
        //Sumarize number of records and number of answersYesOrNo in all records and calculate percentage
        const totalFromResults = resultsByIndicatorFiltered.reduce(
          (acc, item) => {
            acc.counter += 1;
            acc.counterFulfilled += item.result;
            acc.percentage = Math.round(
              (acc.counterFulfilled / acc.counter) * 100
            );
            return acc;
          },
          {
            counter: 0,
            counterFulfilled: 0,
            percentage: 0,
          }
        );
        setTotals(totalFromResults);
        //Showing by indicator
        setShowRecordsByIdIndicator(true);
        setResults(resultsByIndicatorFilteredGrouped);
        setShowRecordsByStage(false);
        setShowRecordsBySubindicator(false);
        setTypeOfRecords("idIndicator");

        setLoadingResults(false);
      }
    } catch (e) {
      // error reading value
      console.log(e);
      setErrorResults("No fue posible leer los resultados", e);
    }
  };
  //Method to get results by indicator, stage and subindicator from storage
  useEffect(() => {
    getResults();
  }, []);

  const goToMainScreen = () => {
    //Navigate to previous screen
    navigation.navigate("Main");
  };

  //Vars and methods to create three buttons to show records by idIndicator, by stage and by subindicator
  const [showRecordsByIdIndicator, setShowRecordsByIdIndicator] =
    useState(true);
  const [showRecordsByStage, setShowRecordsByStage] = useState(false);
  const [showRecordsBySubindicator, setShowRecordsBySubindicator] =
    useState(false);
  const [typeOfRecords, setTypeOfRecords] = useState("idIndicator");

  //Show records by idIndicator, by stage and by subindicator
  const showRecords = (type) => {
    switch (type) {
      case "idIndicator":
        setShowRecordsByIdIndicator(true);
        setResults(resultsByIndicator);
        setShowRecordsByStage(false);
        setShowRecordsBySubindicator(false);
        setTypeOfRecords("idIndicator");
        break;
      case "stage":
        setShowRecordsByIdIndicator(false);
        setShowRecordsByStage(true);
        setResults(resultsByStage);
        setShowRecordsBySubindicator(false);
        setTypeOfRecords("stage");
        break;
      case "subindicator":
        setShowRecordsByIdIndicator(false);
        setShowRecordsByStage(false);
        setResults(resultsBySubindicator);
        setShowRecordsBySubindicator(true);
        setTypeOfRecords("subindicator");
        break;
      default:
        setShowRecordsByIdIndicator(false);
        setShowRecordsByStage(false);
        setShowRecordsBySubindicator(false);
        break;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.bg}>
      <View style={styles.mainContainer}>
        <Pressable
          style={styles.backPressable}
          onPress={() => goToMainScreen()}
        >
          <BackArrow />
        </Pressable>
        <View style={styles.titleIndicator}>
          <MyAppText style={styles.title} typeFont="Bold">
            Semáforos
          </MyAppText>
          <MyAppText style={styles.titleGeneral} typeFont="Regular">
            General
          </MyAppText>
          <View style={styles.infoTitle}>
            <View style={styles.infoTitleLeft}>
              <View style={styles.infoTitleText}>
                <View style={styles.infoTitleTextEnveloped}>
                  <MyAppText style={styles.textSumarize} typeFont="Regular">
                    Registros: {totals.counter}
                  </MyAppText>
                </View>
              </View>
              <View style={styles.infoTitleText}>
                <View style={styles.infoTitleTextEnveloped}>
                  <MyAppText style={styles.textSumarize} typeFont="Regular">
                    Cumplimiento: {totals.counterFulfilled}
                  </MyAppText>
                </View>
              </View>
              <View style={styles.infoTitleText}>
                <View style={[styles.infoTitleTextEnveloped, { height: 60 }]}>
                  <MyAppText
                    numberOfLines={3}
                    style={styles.textSumarize}
                    typeFont="Regular"
                  >
                    Porcentaje de cumplimiento: {totals.percentage} %
                  </MyAppText>
                </View>
              </View>
            </View>
            <View style={styles.infoTitleRight}>
              <View style={styles.infoTitleRightText}>
                <MyAppText style={styles.textRight} typeFont="Regular">
                  ICANMI
                </MyAppText>
              </View>
              <View
                style={[
                  styles.infoTitleRightColor,
                  colorCirclePercentage(totals.percentage),
                ]}
              ></View>
              <View style={styles.infoTitleRightText}>
                <MyAppText style={styles.textRight} typeFont="Regular">
                  {textPercentage(totals.percentage)}
                </MyAppText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.selectors}>
          <View
            style={[
              styles.button,
              {
                backgroundColor:
                  showRecordsByIdIndicator === true
                    ? COLORS.disabled3
                    : COLORS.disabled1,
              },
            ]}
          >
            <Pressable onPress={() => showRecords("idIndicator")}>
              <MyAppText
                style={[
                  styles.textButton,
                  {
                    color:
                      showRecordsByIdIndicator === true
                        ? COLORS.white
                        : COLORS.secondary3,
                  },
                ]}
                typeFont="Regular"
              >
                Por indicador
              </MyAppText>
            </Pressable>
          </View>
          <View
            style={[
              styles.button,
              {
                backgroundColor:
                  showRecordsByStage === true
                    ? COLORS.disabled3
                    : COLORS.disabled1,
              },
            ]}
          >
            <Pressable onPress={() => showRecords("stage")}>
              <MyAppText
                style={[
                  styles.textButton,
                  {
                    color:
                      showRecordsByStage === true
                        ? COLORS.white
                        : COLORS.secondary3,
                  },
                ]}
                typeFont="Regular"
              >
                Por etapa
              </MyAppText>
            </Pressable>
          </View>
          <View
            style={[
              styles.button,
              {
                backgroundColor:
                  showRecordsBySubindicator === true
                    ? COLORS.disabled3
                    : COLORS.disabled1,
              },
            ]}
          >
            <Pressable onPress={() => showRecords("subindicator")}>
              <MyAppText
                style={[
                  styles.textButton,
                  {
                    color:
                      showRecordsBySubindicator === true
                        ? COLORS.white
                        : COLORS.secondary3,
                  },
                ]}
                typeFont="Regular"
              >
                Por subindicador
              </MyAppText>
            </Pressable>
          </View>
        </View>
        <View style={styles.records}>
          {loadingResults && (
            <ActivityIndicator size="large" color={COLORS.tertiary1} />
          )}

          {errorResults && (
            <MyAppText style={styles.error} typeFont="Regular">
              {() => errorResults}
            </MyAppText>
          )}
          <ScrollView
            contentContainerStyle={styles.grow}
            style={styles.scrollView}
          >
            {results.map((item) => (
              <ChartItem
                key={
                  typeOfRecords === "idIndicator"
                    ? item.idIndicator
                    : typeOfRecords === "stage"
                    ? item.stage
                    : item.subindicator
                }
                item={item}
                typeOfRecords={typeOfRecords}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  backPressable: {
    position: "absolute",
    top: 4,
    left: 4,
    alignSelf: "flex-start",
    marginLeft: 8,
    zIndex: 999,
  },
  titleIndicator: {
    height: 220,
    width: "100%",
    alignSelf: "center",
    marginTop: 4,
    marginRight: 12,
    alignItems: "center",
    flexDirection: "column",
  },
  title: {
    height: 40,
    fontSize: 28,
    color: COLORS.backgroundApp,
    textAlign: "center",
  },
  titleGeneral: {
    height: 28,
    fontSize: 16,
    color: COLORS.backgroundApp,
  },

  infoTitle: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 0,
  },

  infoTitleLeft: {
    flex: 5,
    flexDirection: "column",
    marginLeft: 8,
    width: "100%",
    padding: 8,
  },
  textSumarize: {
    paddingTop: 4,
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.secondary3,
    textAlign: "left",
  },
  infoTitleText: {
    height: 46,
    width: "95%",
    padding: 0,
  },
  infoTitleTextEnveloped: {
    borderRadius: 8,
    backgroundColor: COLORS.disabled1,
    width: "100%",
    height: 30,
    padding: 0,
  },
  infoTitleRight: {
    flex: 2,
    marginTop: 8,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "90%",
    backgroundColor: COLORS.disabled1,
    borderRadius: 14,
    padding: 8,
  },
  infoTitleRightText: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "90%",
    borderRadius: 14,
  },

  textRight: {
    fontSize: 12,
    color: COLORS.secondary3,
    textAlign: "center",
  },

  infoTitleRightColor: {
    width: 50,
    height: 50,
    borderRadius: 42,
    backgroundColor: COLORS.secondary2,
  },
  selectors: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    padding: 4,
  },
  button: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.disabled1,
    borderRadius: 8,
    margin: 4,
  },
  textButton: {
    fontSize: 11,
    color: COLORS.secondary3,
    textAlign: "center",
  },

  records: {
    flex: 7,
  },
  scrollView: {
    backgroundColor: COLORS.backgroundApp,
    borderRadius: 8,
    margin: 4,
  },
});
