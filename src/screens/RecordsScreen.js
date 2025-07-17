//React imports
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  Modal,
  ActivityIndicator,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
//For storage
import AsyncStorage from "@react-native-async-storage/async-storage";
//SearchBar
import { SearchBar } from "@rneui/themed";
//FileSystem
import * as FileSystem from "expo-file-system";
//API
import { getIndicators, sendIndicator, getToken } from "../api/indicators";
//hooks
import useApp from "../hooks/useApp.js";
//Components
import RecordItem from "../components/RecordItem.js";
//Styled text
import MyAppText from "../components/componentStyles/MyAppText.js";
//Colors
import { COLORS } from "../utils/constants.js";
//For icons
import BackArrow from "../../assets/backArrow.svg";
import DownloadButton from "../../assets/downloadButtonBright.svg";

export default function RecordsScreen({ navigation }) {
  //Context info
  const {
    stateApp,
    municipalityApp,
    clinicApp,
    userApp,
    platform,
    setIndicatorActiveApp,
    setRecordActiveApp,
  } = useApp();

  //Method to go main screen
  const goToMainScreen = () => {
    //Navigate to previous screen
    navigation.navigate("Main");
  };

  //Info from indicators
  const [indicators, setIndicators] = useState([]);
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [errorLoadingIndicators, setErrorLoadingIndicators] =
    useState(undefined);

  //In totalRecords we save all records from storage
  const [totalRecords, setTotalRecords] = useState([]);

  //In totalResultsIndicator we save all results from storage, so we can share through txt file
  const [totalResultsIndicator, setTotalResultsIndicator] = useState([]);

  //In totalResultsStage we save all results from storage, so we can share through txt file
  const [totalResultsStage, setTotalResultsStage] = useState([]);

  //In totalResultsSubindicator we save all results from storage, so we can share through txt file
  const [totalResultsSubindicator, setTotalResultsSubindicator] = useState([]);

  //In records we save records filtered by state, municipality, clinic and user
  const [records, setRecords] = useState([]);

  //In filteredRecords we save records filtered by search
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  //Useeffect to get info from indicators
  useEffect(() => {
    (async () => {
      setLoadingIndicators(true);
      await loadIndicators();
    })();
  }, []);

  //get indicators from api
  const loadIndicators = async () => {
    try {
      const response = await getIndicators();
      setIndicators(response);
    } catch (error) {
      console.log("error", error);
      setErrorLoadingIndicators(error);
    } finally {
      setLoadingIndicators(false);
    }
  };

  //get records of indicators from storage
  const getRecordsStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@answersIndicator0.1");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("error", e);
      return e;
    }
  };

  //get results of indicators, stages and subindicators from storage
  const getResultsStorage = async (itemStorage) => {
    try {
      const jsonValue = await AsyncStorage.getItem(itemStorage);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("error", e);
      return e;
    }
  };

  //useEffect to get records from storage
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      (async () => {
        setLoadingRecords(true);

        //We also obtain results from storage
        const resultsByIndicatorStorage = await getResultsStorage(
          "@resultsByIndicator0.1"
        );
        const resultsByStageStorage = await getResultsStorage(
          "@resultsByStage0.1"
        );
        const resultsBySubindicatorStorage = await getResultsStorage(
          "@resultsBySubindicator0.1"
        );

        //Then save in state var
        setTotalResultsIndicator(resultsByIndicatorStorage);
        setTotalResultsStage(resultsByStageStorage);
        setTotalResultsSubindicator(resultsBySubindicatorStorage);

        const recordsStorage = await getRecordsStorage();
        //flat recordStorage
        const recordsStorageFlat = recordsStorage
          ? recordsStorage.flatMap((item) => item)
          : [];
        setTotalRecords(recordsStorageFlat);
        //Filter by different parameters
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
        const recordsStorageFlatFiltered = recordsStorageFlat.filter(
          (item) =>
            item.idState === idStateNumber &&
            item.idMunicipality === idMunicipalityNumber &&
            item.idClinic === idClinicNumber &&
            item.idUser === idUserNumber
        );
        //Order records by date desc
        recordsStorageFlatFiltered.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        //Setting in records and filteredRecords for search
        setRecords(recordsStorageFlatFiltered);
        setFilteredRecords(recordsStorageFlatFiltered);
        setLoadingRecords(false);
      })();
    });
  }, [navigation]);

  //search functionality
  const [search, setSearch] = useState("");
  const updateSearch = (search) => {
    setSearch(search);
  };

  //filter functionality
  useEffect(() => {
    //Filter records by search in possibleQuestions array and name in records
    const filteredRecords = records.filter((item) => {
      const recordsExp = item.questions.filter(
        (q) =>
          // first transform q.answerValue to string then to lowercase
          q.answerValue
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()) && q.idQuestion === 102 //expediente
      );

      //search status from status value in getStatusText
      const statusText = getStatusText(item.status);
      return (
        item.stage.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase()) ||
        recordsExp.length > 0 ||
        statusText.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredRecords(filteredRecords);
  }, [search, records]);

  //Translate code status to text
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Estatus: Guardado";
      case 1:
        return "Estatus: Enviado";
      case 2:
        return "Estatus: Enviado con errores";
      default:
        return "";
    }
  };

  const gotoRecordItem = (item) => {
    //Change item editingAllow to false to set only view mode
    const itemEditingAllowFalse = { ...item, editingAllowed: false };
    setRecordActiveApp(itemEditingAllowFalse);
    setIndicatorActiveApp(item);
    //Navigate to AnswerIndicator sending item as indicatorAnswered props
    navigation.navigate("AnswerIndicatorWithProps", {
      indicatorAnsweredFromProps: itemEditingAllowFalse,
    });
  };

  //Var and methods to handle checkbox, depending the id of the item, add or remove from array
  const [selectedItems, setSelectedItems] = useState([]);
  //set a var to check if there are items selected
  const [selectedItemsExist, setSelectedItemsExist] = useState(false);

  const onSelectedItemsChange = (selectedItem, newValue) => {
    const index = selectedItems.indexOf(selectedItem);
    //Cleaning the selectedItems array because only one item can be selected
    setSelectedItems([]);
    //Only one element can be selected
    const recordsTemp = records.map((record) => {
      if (record.id === selectedItem.id) {
        return { ...record, selected: !record.selected };
      } else {
        return { ...record, selected: false };
      }
    });

    //get value of record
    const recordToSelect = recordsTemp.find(
      (record) => record.id === selectedItem.id
    );
    //if value is true, add to selectedItems
    if (recordToSelect.selected) {
      setSelectedItems([selectedItem]);
    }

    console.log("record", records);
    setRecords(recordsTemp);
    setFilteredRecords(recordsTemp);

    // if (index === -1) {
    //   setSelectedItems([selectedItem]);
    // }
  };
  //useEffect to check if there are items selected
  useEffect(() => {
    console.log("selectedItems", selectedItems);
    if (selectedItems.length > 0) {
      setSelectedItemsExist(true);
    } else {
      setSelectedItemsExist(false);
    }
  }, [selectedItems]);

  //var to create a loading indicator
  const [loadingIndicatorSend, setLoadingIndicatorSend] = useState(false);

  //modal to show loading indicator while sending records
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  const [statusItems, setStatusItems] = useState([]);

  const [isSending, setIsSending] = useState(false);
  const [sendingError, setSendingError] = useState(false);

  const [statusItemsSend, setStatusItemsSend] = useState([]);

  //To handle in button
  const sendIndicatorsButton = () => {
    //mark in selectedItems status 99 as sending
    const selectedItemsTemp = selectedItems.map((item) => {
      return { ...item, status: 99 };
    });
    //Where we are going to update status
    setStatusItemsSend(selectedItemsTemp);
    setSelectedItems(selectedItemsTemp);
    setModalVisible(true);
    setModalText("Iniciando...");
    setIsSending(true);
    setSendingError("");
    //Modal
  };

  //Use effect to send indicators
  useEffect(() => {
    if (isSending) {
      sendIndicators();
    } else {
      if (
        //Check if statusItemsSend is not empty
        statusItemsSend.length !== 0 &&
        statusItemsSend !== undefined &&
        statusItemsSend !== null
      ) {
        //update status in records
        const recordsTemp = records.map((record) => {
          const itemStatus = statusItemsSend.find(
            (itemSend) => itemSend.id === record.id
          );
          if (itemStatus === undefined) {
            return record;
          } else {
            return { ...record, status: itemStatus.status };
          }
        });
        setRecords(recordsTemp);
        setFilteredRecords(recordsTemp);
        //restore selectedItemsSend to empty
        //Update records in storage
        (async () => {
          try {
            //in storage there are all records
            const recordsStorage = await getRecordsStorage();
            //update status in recordsStorage
            const recordsStorageUpdated = recordsStorage.map((record) => {
              const itemStatus = statusItemsSend.find(
                (itemSend) => itemSend.id === record.id
              );
              if (itemStatus === undefined) {
                return record;
              } else {
                return { ...record, status: itemStatus.status };
              }
            });
            //save recordsStorageUpdated in storage
            await AsyncStorage.setItem(
              "@answersIndicator0.1",
              JSON.stringify(recordsStorageUpdated)
            );
          } catch (e) {
            console.log("error", e);
          }
        })();

        //set statusItemsSend to empty
        setStatusItemsSend([]);
        setModalVisible(false);
      }
    }
  }, [isSending]);

  const sendIndicators = async () => {
    //First getting token to send indicators
    //For testing and show indicator
    let statusItemsTemp = [];
    //Filter selectedItems by status 99 (sending)
    const selectedItemsSending = selectedItems.filter(
      (item) => item.status === 99
    );
    console.log(selectedItemsSending);
    //Going through selectedItems array,
    //and sending each item to api
    for (let i = 0; i < selectedItemsSending.length; i++) {
      try {
        //set modal text to show advance in sending
        setModalText(
          `Enviando cuestionario ${i + 1} de ${selectedItemsSending.length}`
        );
        const item = selectedItems[i];
        //sendItem, until finish last one, we continue
        const response = await sendIndicator(item, userApp);
        //set status to 1 (sent)
        if (response.status === 200) {
          //update status in selectedItemsSend
          statusItemsSend.map((itemSend) => {
            if (itemSend.id === item.id) {
              itemSend.status = 1;
            }
          });
        } else {
          //update status in selectedItemsSend
          statusItemsSend.map((itemSend) => {
            if (itemSend.id === item.id) {
              itemSend.status = 2;
            }
          });
        }
      } catch (error) {
        console.log("Throw error desde recordScreen", error);
        const item = selectedItems[i];

        //Print an axios error
        console.log("error axios", error?.message);
        console.log("id", item.id, "status", 2);
        //update status in selectedItemsSend
        statusItemsSend.map((itemSend) => {
          if (itemSend.id === item.id) {
            itemSend.status = 2;
          }
        });

        setIsSending(false);
        setSendingError(`Error al enviar cuestionarios
          ${error?.message}
          `);
        setModalVisible(false);
        setErrorLoadingIndicators(error);
      }
      //Updating message
      setModalText("Finalizando...");

      setStatusItems(statusItemsTemp);
      setIsSending(false);
    }
  };

  //If indicator traffic lights are needed, activate this method
  const sendResultsByIndicator = async () => {
    try {
      //First getting token to send indicators
      const token = await getToken(userApp);
      // const token = undefined;
      if (token === undefined || token === null) {
        setIsSending(false);
        setSendingError("Error al obtener token");
        return;
      } else {
        //get info from storage @resultsByIndicator0.1, @resultsByStage0.1 and @resultsBySubindicator0.1
        const resultsByIndicator = await AsyncStorage.getItem(
          "@resultsByIndicator0.1"
        );
        const resultsByStage = await AsyncStorage.getItem("@resultsByStage0.1");
        const resultsBySubindicator = await AsyncStorage.getItem(
          "@resultsBySubindicator0.1"
        );
        //Check if results are not null
        if (
          resultsByIndicator !== null &&
          resultsByStage !== null &&
          resultsBySubindicator !== null
        ) {
          //Parse results
          const resultsByIndicatorParsed = JSON.parse(resultsByIndicator);
          const resultsByStageParsed = JSON.parse(resultsByStage);
          const resultsBySubindicatorParsed = JSON.parse(resultsBySubindicator);
          //Send results to api
          const responseByIndicator = await sendResultsByIndicatorApi(
            resultsByIndicatorParsed
          );
          const responseByStage = await sendResultsByStageApi(
            resultsByStageParsed
          );
          const responseBySubindicator = await sendResultsBySubindicatorApi(
            resultsBySubindicatorParsed
          );
          //Check if response is correct
          if (
            responseByIndicator === true &&
            responseByStage === true &&
            responseBySubindicator === true
          ) {
            //update response in resultsByIndicator, resultsByStage and resultsBySubindicator with the infor from api
            const resultsByIndicatorUpdated = resultsByIndicator.map((item) => {
              const itemResponse = responseByIndicator.find(
                (itemResponse) =>
                  itemResponse.id === item.id &&
                  itemResponse.idIndicator === item.idIndicator
              );
              if (itemResponse === undefined) {
                return { ...item, status: 2 };
              }
              if (itemResponse.status === 200) {
                return { ...item, status: 1 };
              }
            });
            const resultsByStageUpdated = resultsByStage.map((item) => {
              const itemResponse = responseByStage.find(
                (itemResponse) =>
                  itemResponse.id === item.id &&
                  itemResponse.idIndicator === item.idIndicator
              );
              if (itemResponse === undefined) {
                //return item with status 2 (error)
                return { ...item, status: 2 };
              }
              if (itemResponse.status === 200) {
                //return item with status 1 (sent)
                return { ...item, status: 1 };
              }
            });
            const resultsBySubindicatorUpdated = resultsBySubindicator.map(
              (item) => {
                const itemResponse = responseBySubindicator.find(
                  (itemResponse) =>
                    itemResponse.id === item.id &&
                    itemResponse.idIndicator === item.idIndicator
                );
                if (itemResponse === undefined) {
                  //return item with status 2 (error)
                  return { ...item, status: 2 };
                }
                if (itemResponse.status === 200) {
                  //return item with status 1 (sent)
                  return { ...item, status: 1 };
                }
              }
            );
            //update resultsByIndicator, resultsByStage and resultsBySubindicator in storage
            await AsyncStorage.setItem(
              "@resultsByIndicator0.1",
              JSON.stringify(resultsByIndicatorUpdated)
            );
            await AsyncStorage.setItem(
              "@resultsByStage0.1",
              JSON.stringify(resultsByStageUpdated)
            );
            await AsyncStorage.setItem(
              "@resultsBySubindicator0.1",
              JSON.stringify(resultsBySubindicatorUpdated)
            );
            //set modal text to show advance in sending
            setModalText("Enviando resultados...");
          } else {
            throw Error("Error al enviar semáforos");
            return;
          }
        } else {
          throw Error("Error al obtener resultados");
          return;
        }
      }
    } catch (error) {
      console.log("error", error);
      setIsSending(false);
      setSendingError("Error al enviar semáforos");
      //update status
      //set status to 2 (sent with errors)
      statusItemsSend.map((itemSend) => {
        itemSend.status = 2;
      });
      return;
    }
  };

  const sendResultsByIndicatorApi = async (resultsByIndicator) => {
    try {
      //Delay to show loading indicator
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = true;
      return response;
    } catch (error) {
      console.log("error", error);
      setSendingError("Error al enviar resultados indicador");
      return;
    }
  };

  const sendResultsByStageApi = async (resultsByStage) => {
    try {
      //Delay to show loading indicator
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = true;
      return response;
    } catch (error) {
      console.log("error", error);
      setSendingError("Error al enviar resultados etapa");
      return;
    }
  };

  const sendResultsBySubindicatorApi = async (resultsBySubindicator) => {
    try {
      //Delay to show loading indicator
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = true;
      return response;
    } catch (error) {
      console.log("error", error);
      setSendingError("Error al enviar resultados subindicador");
      return;
    }
  };

  //Method to show error alert in sending indicators when modal is closed and error exists
  useEffect(() => {
    if (sendingError) {
      console.log("sendingError", sendingError);
      alert(sendingError);
    }
  }, [sendingError]);

  //function to create file when  button is pressed to save records in file and then share
  const createFileAsync = async () => {
    //Create file with records using expo-file-system
    //first get fileUri to save file incluiding date in the name
    const fileUri = FileSystem.documentDirectory + "records.txt";
    //in a same var we save records and results to share through txt
    //first we save records
    const recordsToShare = totalRecords;
    //then we save results
    const resultsByIndicatorToShare = totalResultsIndicator;
    const resultsByStageToShare = totalResultsStage;
    const resultsBySubindicatorToShare = totalResultsSubindicator;

    //then we save all in a same var
    const totalToShare = {
      recordsToShare,
      resultsByIndicatorToShare,
      resultsByStageToShare,
      resultsBySubindicatorToShare,
    };

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(totalToShare));
    // //then get file
    const file = await FileSystem.readAsStringAsync(fileUri);
    //Then share it, hide modal when share is finished
    const shareResponse = await Share.share({
      message: file,
      title: "Cuestionarios",
      url: fileUri,
    });
    setLoadingIndicatorCreateFile(false);
  };
  //Csv file created
  const createFile = () => {
    setModalVisibleCreateFile(true);
    createFileAsync();
  };

  //create Modal to show when createFileAsync is called
  const [loadingIndicatorCreateFile, setLoadingIndicatorCreateFile] =
    useState(false);
  const [modalVisibleCreateFile, setModalVisibleCreateFile] = useState(false);

  console.log("SelectedItemsExist", selectedItemsExist);
  console.log("loadingIndicatorSend", loadingIndicatorSend);

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
            Historial
          </MyAppText>
          <MyAppText style={styles.titleIndicatorText} typeFont="Regular">
            Cuestionarios respondidos
          </MyAppText>
        </View>
        <View style={styles.header}>
          <View style={styles.searcher}>
            <View style={styles.containerSearcher}>
              <SearchBar
                placeholder="Buscar..."
                onChangeText={updateSearch}
                value={search}
                platform={platform ? platform : "android"}
                containerStyle={styles.inputContainerSearcher}
                inputContainerStyle={{ backgroundColor: "white" }}
                inputStyle={{ backgroundColor: "white" }}
                leftIconContainerStyle={{ color: "black" }}
                autoCorrect={false}
              />
            </View>
            {selectedItemsExist && !loadingIndicatorSend && (
              <Pressable
                style={styles.sendPressable}
                // onPress={() => sendRecords()}
                onPress={() => sendIndicatorsButton()}
              >
                <MyAppText style={styles.textSend} typeFont="Regular">
                  {`Enviar`}
                </MyAppText>

                {/* <SendButton /> */}
              </Pressable>
            )}
            {totalRecords.length > 0 && (
              <Pressable
                style={styles.downloadPressable}
                onPress={() => createFile()}
              >
                <DownloadButton />
              </Pressable>
            )}
          </View>
        </View>

        {loadingIndicatorCreateFile && (
          //Modal to show loading indicator while sending records
          <View style={styles.centeredView}>
            <Modal
              animationType="shrink"
              transparent={true}
              visible={modalVisibleCreateFile}
              onRequestClose={() => {
                setModalVisibleCreateFile(!modalVisibleCreateFile);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <ActivityIndicator size="large" color={COLORS.secondary2} />
                  <MyAppText style={styles.modalText} typeFont="Bold">
                    Generando archivo...
                  </MyAppText>
                  <MyAppText style={styles.modalText} typeFont="Regular">
                    Obteniendo registros
                  </MyAppText>
                </View>
              </View>
            </Modal>
          </View>
        )}

        {isSending && (
          //Modal to show loading indicator while sending records
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={true}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <ActivityIndicator size="large" color={COLORS.secondary2} />
                  <MyAppText style={styles.modalText} typeFont="Bold">
                    Enviando cuestionarios...
                  </MyAppText>
                  <MyAppText style={styles.modalText} typeFont="Regular">
                    {modalText}
                  </MyAppText>
                </View>
              </View>
            </Modal>
          </View>
        )}

        <View style={styles.records}>
          {errorLoadingIndicators && (
            <MyAppText style={styles.error} typeFont="Regular">
              {() => errorLoadingIndicators}
            </MyAppText>
          )}

          <ScrollView
            contentContainerStyle={styles.grow}
            style={styles.scrollView}
          >
            {loadingRecords && (
              <ActivityIndicator size="large" color={COLORS.tertiary1} />
            )}

            {filteredRecords.map((item) => (
              <RecordItem
                key={item.id}
                item={item}
                // onPresssInfoIndicatorItem={() => goToInfoIndicator(item)}
                onPressRecordItem={() => gotoRecordItem(item)}
                onSelectedItemsChange={onSelectedItemsChange}
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
    left: 8,
    top: 8,
    alignSelf: "flex-start",
    marginLeft: 8,
    zIndex: 2,
  },
  titleIndicator: {
    flex: 1,
    width: "90%",
    height: 58,
    marginTop: 4,
    marginRight: 12,
    alignItems: "center",
    alignSelf: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.backgroundApp,
    textAlign: "center",
  },
  titleIndicatorText: {
    fontSize: 16,
    color: COLORS.backgroundApp,
  },
  sendPressable: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    marginRight: 8,
  },
  downloadPressable: {
    position: "absolute",
    right: 58,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    marginRight: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 28,
    },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 28,
  },
  modalText: {
    marginBottom: 28,
    textAlign: "center",
  },
  textSend: {
    textAlignVertical: "center",
    color: COLORS.backgroundApp,
    fontSize: 14,
  },
  records: {
    flex: 7,
    width: "98%",
    alignSelf: "center",
    borderRadius: 16,
    marginBottom: 16,
  },
  searcher: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    flexDirection: "row",
  },
  containerSearcher: {
    width: "70%",
    backgroundColor: "rgba(52, 52, 52, 0.0)",
  },
  inputContainerSearcher: {
    width: "80%",
    height: 60,
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 12,
  },
  container: {
    marginTop: 4,
    padding: 2,
  },
  item: {
    backgroundColor: "#f5f520",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  error: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 14,
    color: COLORS.primary2,
    textAlign: "center",
  },

  scrollView: {
    borderRadius: 16,
  },
  grow: {
    flexGrow: 1,
    paddingBottom: 28,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
});
