import {
  View,
  Image,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

//We use dropdown picker for lists
import DropDownPicker from "react-native-dropdown-picker";
//Global context
import useApp from "../hooks/useApp";
//Constants for the colors
import { COLORS } from "../utils/constants";
//Data from the api
import {
  getStates,
  getMunicipalities,
  getClinics,
  getUsers,
} from "../api/clinicUsers";

//Customized text
import MyAppText from "../components/componentStyles/MyAppText";
//images and icons
// import BackArrow from "../../assets/backArrow.svg";
// import NoWifi from "../../assets/noWifi.svg";

export default function SelectUserScreen({ navigation }) {
  //Getting data from context
  const { setStateApp, setMunicipalityApp, setClinicApp, userApp, setUserApp } =
    useApp();

  //Handling errors in api
  const [errorApi, setErrorApi] = useState(undefined);

  //Var to check if there is internet connection
  const [isConnected, setIsConnected] = useState(false);

  //Check if there is internet connection
  useEffect(() => {
    (async () => {
      const isConnectedCheck = await checkInternetConnection();
      //setIsConnected(isConnectedCheck);
    })();
  }, []);

  //Method to check internet connection
  const checkInternetConnection = async () => {
    try {
      const response = await fetch("https://www.google.com");
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  //Const to get states from API
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);

  // Getting states from API
  useEffect(() => {
    (async () => {
      setLoadingStates(true);
      await loadStates();
      //Check if there is a userApp saved in local storage
      try {
        const userAppFromStorage = await AsyncStorage.getItem("userApp");
        if (userAppFromStorage) {
          const userAppParsed = JSON.parse(userAppFromStorage);
          setUserApp(userAppParsed);

          //Setting in inputs the data of userApp
          setInputLastName2(userAppParsed.lastName2);
          setInputLastName(userAppParsed.lastName);
          setInputName(userAppParsed.name);
        } else {
          //console.log("No userApp from storage");
        }
      } catch (error) {
        console.log("Error to get userApp from storage", error);
      }
    })();
  }, []);

  //To get states from API or local
  const loadStates = async () => {
    try {
      //First we save info in clinicsUsersApi Array and users
      const data = await getStates(isConnected);
      //if isConnected then data.data else data
      const results = isConnected ? data.data : data;
      //Filling the picker with the data
      const statesApi = [];
      results.forEach((state) => {
        statesApi.push({
          label: state.entity_name,
          value: state.entity_key,
        });
      });
      //Defining our states with the data from the api
      setStates(statesApi);
    } catch (error) {
      console.log("Error to get states data from the api", error);
    } finally {
      setLoadingStates(false);
    }
  };

  //Vars and methods for dropwdown picker states
  //First vars
  const [selectedState, setSelectedState] = useState();
  const [selectedStateObj, setSelectedStateObj] = useState();
  const [stateOpen, setStateOpen] = useState(false);
  //Then methods
  //When the dropdown is open
  const onStateOpen = useCallback(() => {
    setMunicipalityOpen(false);
    setClinicOpen(false);
    setUserOpen(false);
  }, []);
  //When the value changes
  const onChangeValueState = (value) => {
    setSelectedState(value);
    //get label from selected state
    const state = states.find((state) => state.value === value);
    setSelectedStateObj(state);
    setSelectedMunicipality(null);
    setSelectedClinic(null);
    setErrorSelectUserClinicApp(undefined);
  };

  //NOW WITH MUNICIPALITIES
  //Vars and methods for dropdown picker municipalities
  const [municipalities, setMunicipalities] = useState([]);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState();
  const [selectedMunicipalityObj, setSelectedMunicipalityObj] = useState();
  const [municipalityOpen, setMunicipalityOpen] = useState(false);
  const onMunicipalityOpen = useCallback(() => {
    setStateOpen(false);
    setClinicOpen(false);
    setUserOpen(false);
  }, []);

  //still municipalities
  //method to get municipalities by state
  useEffect(() => {
    (async () => {
      setLoadingMunicipalities(true);
      await loadMunicipalities();
    })();
  }, [selectedState]);

  const loadMunicipalities = async () => {
    try {
      const data = await getMunicipalities(selectedState, isConnected);
      //When comes from the api is data.data, when comes from the local is data
      const results = isConnected ? data?.data : data;
      const municipalitiesApi = [];
      //Filling the picker with the data
      results.forEach((state) => {
        municipalitiesApi.push({
          label: state.name_municipality,
          value: state.key_municipality,
        });
      });
      setMunicipalities(municipalitiesApi);
    } catch (error) {
      console.log("Error to get municipalities data from the api", error);
    } finally {
      setLoadingMunicipalities(false);
    }
  };

  //methods for dropdown picker municipalities
  const onChangeValueMunicipality = (value) => {
    setSelectedMunicipality(value);
    setSelectedClinic(null);
    //get label from selected municipality
    const municipality = municipalities.find(
      (municipality) => municipality.value === value
    );
    setSelectedMunicipalityObj(municipality);
    setErrorSelectUserClinicApp(undefined);
  };

  //Now with clinics
  //data and values for clinics
  const [clinics, setClinics] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState();
  const [selectedClinicObj, setSelectedClinicObj] = useState();
  const [clinicOpen, setClinicOpen] = useState(false);
  const onClinicOpen = useCallback(() => {
    setStateOpen(false);
    setMunicipalityOpen(false);
    setUserOpen(false);
  }, []);

  //method to get clinics by state
  useEffect(() => {
    (async () => {
      setLoadingClinics(true);
      await loadClinics();
    })();
  }, [selectedState, selectedMunicipality]);

  //Loading clinics from api or locally
  const loadClinics = async () => {
    try {
      const data = await getClinics(
        selectedState,
        selectedMunicipality,
        isConnected
      );
      //When comes from the api is data.data, when comes from the local is data
      const results = isConnected ? data.data : data;
      const clinicsApi = [];
      //Filling the picker with the data
      results.forEach((clinic) => {
        clinicsApi.push({
          label: clinic.name_unit,
          value: clinic.id,
        });
      });
      setClinics(clinicsApi);
      console.log("Clinics del set", clinicsApi);
    } catch (error) {
      console.log("Error to get clinics data from the api", error);
    } finally {
      setLoadingClinics(false);
    }
  };

  //For clinics we don't need a method to handle when
  //the picker is open because this picker is the last one, then
  //we don't need to update the other pickers
  //Method to handle when the value changes
  const onChangeValueClinic = (value) => {
    setSelectedClinic(value);
    //get label from selected clinic
    console.log("Clinic selected", value);
    const clinic = clinics.find((clinic) => clinic.value === value);
    setSelectedClinicObj(clinic);
    setErrorSelectUserClinicApp(undefined);
  };

  //Vars and methods for dropdown picker users
  const [users, setUsers] = useState([]);
  const [usersApi, setUsersApi] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedUserObj, setSelectedUserObj] = useState();
  const [userOpen, setUserOpen] = useState(false);
  const onUserOpen = useCallback(() => {
    setStateOpen(false);
    setMunicipalityOpen(false);
    setClinicOpen(false);
  }, []);

  //method to get user by state, municipality and clinic
  useEffect(() => {
    (async () => {
      setLoadingUsers(true);
      await loadUsers();
    })();
  }, [selectedState, selectedMunicipality, selectedClinic]);

  const loadUsers = async () => {
    try {
      //We get data from local var
      const data = await getUsers(
        selectedState,
        selectedMunicipality,
        selectedClinic
      );
      const results = data;
      setUsersApi(results);
      const userApi = [];
      //Filling the picker with the data
      results.forEach((user) => {
        userApi.push({
          label: user.name,
          value: user.idUser,
        });
      });
      setUsers(userApi);
    } catch (error) {
      console.log("Error to get user data from the api", error);
    } finally {
      setLoadingUsers(false);
    }
  };
  //Method to handle when change the value
  const onChangeValueUser = (value) => {
    setSelectedUser(value);
    //get label from selected clinic
    const user = users.find((user) => user.value === value);
    setSelectedUserObj(user);
    setErrorSelectUserClinicApp(undefined);
  };

  //Vars and methods to handle when user press login

  //Handling buttons press
  //Go to main indicators screen, a "login"
  const goToMainScreen = () => {
    navigation.navigate("Main");
  };

  //Error handling
  const [errorSelectUserClinicApp, setErrorSelectUserClinicApp] = useState("");

  const onPressLogin = () => {
    let userComplete;
    if (selectedUserObj !== undefined) {
      //Getting user complete from usersApi
      userComplete = usersApi.find(
        (user) => user.idUser === selectedUserObj.value
      );
    } else {
      setErrorSelectUserClinicApp("No se ha seleccionado el usuario");
      return;
    }
    //Checking textinputname, lastname and lastname2 are not empty
    if (
      inputName === "" ||
      inputLastName === "" ||
      inputLastName2 === "" ||
      inputName === undefined ||
      inputLastName === undefined ||
      inputLastName2 === undefined
    ) {
      setErrorSelectUserClinicApp("No se han ingresado datos del nombre");
      return;
    }
    //Create object user and save in context
    userComplete = {
      ...userComplete,
      name: inputName,
      lastName: inputLastName,
      lastName2: inputLastName2,
    };
    console.log("userComplete", userComplete);
    //Checking if userComplete is undefined
    if (userComplete === undefined) {
      setErrorSelectUserClinicApp("No se ha seleccionado el usuario");
      return;
    }

    //Now with data of state, municipality, clinic and user
    try {
      selectedStateObj &&
      selectedMunicipalityObj &&
      selectedClinicObj &&
      userComplete
        ? setStateApp(selectedStateObj) |
          setMunicipalityApp(selectedMunicipalityObj) |
          setClinicApp(selectedClinicObj) |
          setUserApp(userComplete)
        : (function () {
            throw "No se ha seleccionado el Estado, Municipio, Centro de Salud o usuario";
          })();
      //Save in local storage userApp
      AsyncStorage.setItem("userApp", JSON.stringify(userComplete));
      setErrorSelectUserClinicApp(undefined);
      //When finishing go to main screen
      goToMainScreen();
    } catch (error) {
      console.log(error);
      setErrorSelectUserClinicApp(
        "No se ha seleccionado el Estado, Municipio, Centro de Salud o usuario"
      );
    }
  };

  //Vars and methods to handle input for username and lastnames
  const [inputName, setInputName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [inputLastName2, setInputLastName2] = useState("");

  const onChangeNameInput = (value) => {
    setInputName(value);
  };
  const onChangeLastNameInput = (value) => {
    setInputLastName(value);
  };
  const onChangeLastNameInput2 = (value) => {
    setInputLastName2(value);
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView>
        <View style={styles.mainContainer}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderRightWidth: 100,
              borderTopWidth: 100,
              borderRightColor: "transparent",
              borderTopColor: COLORS.primary2,
              zIndex: 0,
            }}
          />

          <Pressable
            style={styles.backPressable}
            onPress={() => navigation.goBack(null)}
          >
            {/* <BackArrow /> */}
          </Pressable>
          {!isConnected && (
            <View style={styles.noWifiIcon}>{/* <NoWifi /> */}</View>
          )}
          <View style={styles.headContainer}>
            <Image
              source={require("../../assets/icon.png")}
              style={{ width: 120, height: 120, marginTop: 12 }}
            />
            <MyAppText style={styles.textSubMain} typeFont="Bold">
              CANMI
            </MyAppText>
          </View>
          <View style={styles.selectUserContainer}>
            <MyAppText style={styles.textParagraph} typeFont="Regular">
              Selecciona
            </MyAppText>
            <View>
              {/* States dropdown picker */}
              <DropDownPicker
                listMode={Platform.OS === "ios" ? "SCROLLVIEW" : "MODAL"}
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                style={styles.pickerState}
                zIndex={undefined}
                elevation={undefined}
                dropDownDirection="top"
                open={stateOpen}
                onOpen={onStateOpen}
                value={selectedState}
                items={states}
                setOpen={setStateOpen}
                setValue={setSelectedState}
                setItems={setStates}
                onChangeValue={onChangeValueState}
                loading={loadingStates}
                closeOnBackPressed={true}
                activityIndicatorColor={COLORS.tertiary1}
                activityIndicatorSize={30}
                language="ES"
                textStyle={{
                  fontSize: 14,
                }}
                placeholder="Entidad federativa"
                placeholderStyle={{
                  color: COLORS.secondary1,
                }}
                searchable={true}
                searchPlaceholder="Buscar..."
                searchContainerStyle={{
                  borderColor: COLORS.backgroundApp,
                  borderBottomColor: COLORS.disabled3,
                }}
                containerStyle={[styles.containerPicker, { zIndex: 4 }]}
                autoScroll={true}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                //style of the arrow
                arrowStyle={{
                  width: 20,
                  height: 20,
                  marginRight: 8,
                  color: COLORS.secondary1,
                }}
              />
              {/* Municipalites dropdown picker */}
              <DropDownPicker
                listMode={Platform.OS === "ios" ? "SCROLLVIEW" : "MODAL"}
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                style={styles.pickerState}
                zIndex={undefined}
                elevation={undefined}
                dropDownDirection="top"
                open={municipalityOpen}
                onOpen={onMunicipalityOpen}
                value={selectedMunicipality}
                items={municipalities}
                setOpen={setMunicipalityOpen}
                setValue={setSelectedMunicipality}
                setItems={setMunicipalities}
                onChangeValue={onChangeValueMunicipality}
                loading={loadingMunicipalities}
                closeOnBackPressed={true}
                activityIndicatorColor={COLORS.tertiary1}
                activityIndicatorSize={30}
                language="ES"
                textStyle={{
                  fontSize: 14,
                }}
                placeholder="Municipio"
                placeholderStyle={{
                  color: COLORS.secondary1,
                }}
                searchable={true}
                searchPlaceholder="Buscar..."
                searchContainerStyle={{
                  borderBottomColor: COLORS.disabled3,
                }}
                containerStyle={[styles.containerPicker, { zIndex: 3 }]}
                autoScroll={true}
                dropDownContainerStyle={styles.dropDownContainerStyle}
              />
              {/* Clinics dropdown picker */}
              <DropDownPicker
                listMode={Platform.OS === "ios" ? "SCROLLVIEW" : "MODAL"}
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                style={styles.pickerState}
                zIndex={undefined}
                elevation={undefined}
                dropDownDirection="top"
                open={clinicOpen}
                onOpen={onClinicOpen}
                value={selectedClinic}
                items={clinics}
                setOpen={setClinicOpen}
                setValue={setSelectedClinic}
                setItems={setClinics}
                onChangeValue={onChangeValueClinic}
                loading={loadingClinics}
                closeOnBackPressed={true}
                activityIndicatorColor={COLORS.tertiary1}
                activityIndicatorSize={30}
                language="ES"
                textStyle={{
                  fontSize: 14,
                }}
                placeholder="Centro de salud"
                placeholderStyle={{
                  color: COLORS.secondary1,
                }}
                searchable={true}
                searchPlaceholder="Buscar..."
                searchContainerStyle={{
                  borderBottomColor: COLORS.disabled3,
                }}
                containerStyle={[styles.containerPicker, { zIndex: 2 }]}
                autoScroll={true}
                dropDownContainerStyle={styles.dropDownContainerStyle}
              />
              <DropDownPicker
                listMode={Platform.OS === "ios" ? "SCROLLVIEW" : "MODAL"}
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                style={styles.pickerState}
                zIndex={undefined}
                elevation={undefined}
                dropDownDirection="top"
                open={userOpen}
                onOpen={onUserOpen}
                value={selectedUser}
                items={users}
                setOpen={setUserOpen}
                setValue={setSelectedUser}
                setItems={setUsers}
                onChangeValue={onChangeValueUser}
                loading={loadingUsers}
                closeOnBackPressed={true}
                activityIndicatorColor={COLORS.tertiary1}
                activityIndicatorSize={30}
                language="ES"
                textStyle={{
                  fontSize: 14,
                }}
                placeholder="Usuario"
                placeholderStyle={{
                  color: COLORS.secondary1,
                }}
                searchable={true}
                searchPlaceholder="Buscar..."
                searchContainerStyle={{
                  borderBottomColor: COLORS.disabled3,
                }}
                containerStyle={[styles.containerPicker, { zIndex: 1 }]}
                autoScroll={true}
                dropDownContainerStyle={styles.dropDownContainerStyle}
              />
              {errorApi && (
                <MyAppText style={styles.error} typeFont="Regular">
                  {errorApi}
                </MyAppText>
              )}
              <View style={styles.textView}>
                <TextInput
                  style={[
                    styles.textInputUser,
                    {
                      color: COLORS.secondary2,
                    },
                  ]}
                  editable={true}
                  placeholder="Nombre(s) de usuario"
                  value={inputName}
                  onChangeText={onChangeNameInput}
                  autoCorrect={false}
                ></TextInput>
              </View>
              <View style={styles.textView}>
                <TextInput
                  style={[
                    styles.textInputUser,
                    {
                      color: COLORS.secondary2,
                    },
                  ]}
                  editable={true}
                  placeholder="Apellido 1"
                  value={inputLastName}
                  onChangeText={onChangeLastNameInput}
                  autoCorrect={false}
                ></TextInput>
              </View>
              <View style={styles.textView}>
                <TextInput
                  style={[
                    styles.textInputUser,
                    {
                      color: COLORS.secondary2,
                    },
                  ]}
                  editable={true}
                  placeholder="Apellido 2"
                  value={inputLastName2}
                  onChangeText={onChangeLastNameInput2}
                  autoCorrect={false}
                ></TextInput>
              </View>
              {errorSelectUserClinicApp && (
                <MyAppText style={styles.error} typeFont="Regular">
                  {errorSelectUserClinicApp}
                </MyAppText>
              )}
              <Pressable style={styles.buttonLogin} onPress={onPressLogin}>
                <MyAppText style={styles.textButton} typeFont="Regular">
                  Ingresar
                </MyAppText>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    flex: 1,
    backgroundColor: COLORS.backgroundApp,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  backPressable: {
    position: "absolute",
    marginTop: StatusBar.currentHeight + 106,
    justifyContent: "center",
    alignSelf: "flex-start",
    marginLeft: 12,
  },
  noWifiIcon: {
    position: "absolute",
    top: 60,
    right: 70,
  },
  headContainer: {
    flex: 2,
    marginTop: StatusBar.currentHeight + 86,
    alignItems: "center",
    justifyContent: "center",
  },
  selectUserContainer: {
    flex: 6,
    marginTop: 8,
    alignItems: "center",
  },
  textSubMain: {
    marginTop: 4,
    fontSize: 30,
    color: COLORS.secondary1,
  },

  pickerState: {
    marginTop: 16,
    width: 250,
    borderRadius: 12,
    borderColor: COLORS.backgroundApp,
    // borderWidth: 0.5,
    color: COLORS.white,
    backgroundColor: COLORS.white,
  },
  containerPicker: {
    width: 250,
  },
  dropDownContainerStyle: {
    marginTop: 16,
    backgroundColor: COLORS.white,
    borderWidth: 0,
  },

  error: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.primary2,
    textAlign: "center",
    width: 250,
  },

  textView: {
    marginTop: 16,
    width: 250,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.0,
    borderColor: COLORS.backgroundApp,
    backgroundColor: COLORS.white,
  },

  textInputUser: {
    paddingRight: 8,
    paddingLeft: 8,
    fontSize: 14,
    borderRadius: 12,
    width: "90%",
    height: "90%",
    textAlign: "left",
    backgroundColor: COLORS.white,
  },

  buttonLogin: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    width: 250,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.secondary2,
    marginBottom: 20,
  },

  textButton: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
});
