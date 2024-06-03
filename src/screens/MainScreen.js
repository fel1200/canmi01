import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
//Components RN Elements visual
import { SearchBar } from "@rneui/themed";
//Colors
import { COLORS } from "../utils/constants.js";
//Styled font
import MyAppText from "../components/componentStyles/MyAppText";
//Hooks
import useApp from "../hooks/useApp";
//API
import { getIndicators } from "../api/indicators";
//Components
import IndicatorItem from "../components/IndicatorItem";

//Icons and images
import BackArrow from "../../assets/backArrow.svg";
import SVGHistory from "../../assets/iconHistoryBright.svg";
import SVGTrafficLight from "../../assets/trafficLightBright.svg";

export default function MainScreen({ navigation }) {
  //Context global vars
  const {
    userApp,
    platform,
    setStateApp,
    setMunicipalityApp,
    setClinicApp,
    setUserApp,
    setIndicatorActiveApp,
  } = useApp();

  //Vars and methods to get info from indicators
  const [indicators, setIndicators] = useState([]);
  const [filteredIndicators, setFilteredIndicators] = useState([]);
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [errorLoadingIndicators, setErrorLoadingIndicators] =
    useState(undefined);

  //Useeffect to get info from indicators
  useEffect(() => {
    (async () => {
      setLoadingIndicators(true);
      await loadIndicators();
    })();
  }, []);

  //Function to get indicators
  const loadIndicators = async () => {
    try {
      const indicatorsData = await getIndicators();
      setIndicators(indicatorsData);
      setFilteredIndicators(indicatorsData);
    } catch (error) {
      console.log("error");
      setErrorLoadingIndicators("Error al obtener los indicadores");
    } finally {
      setLoadingIndicators(false);
    }
  };
  //search functionality
  const [search, setSearch] = useState("");
  const updateSearch = (search) => {
    setSearch(search);
  };

  //search functionality
  useEffect(() => {
    const filteredIndicators = indicators.filter(
      (indicator) =>
        indicator.name.toLowerCase().includes(search.toLowerCase()) ||
        indicator.target.toLowerCase().includes(search.toLowerCase()) ||
        indicator.stage.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredIndicators(filteredIndicators);
  }, [search, indicators]);

  //Methods for header buttons
  //When back button or logged out is pressed
  const goToSelectUserScreen = () => {
    setStateApp(undefined);
    setMunicipalityApp(undefined);
    setClinicApp(undefined);
    setUserApp(undefined);
    //Navigate to previous screen
    navigation.navigate("SelectUser");
  };

  //function to to to info indicator
  const goToInfoIndicator = (item) => {
    setIndicatorActiveApp(item);
    navigation.navigate("InfoIndicator");
  };
  //Function to go to answer indicator, with an empty answer
  const gotoAnswerIndicator = (item) => {
    setIndicatorActiveApp(item);
    navigation.navigate("AnswerIndicator", {
      indicatorAnsweredFromProps: undefined,
    });
  };

  const goToRecordsScreen = () => {
    //Navigate to record screen
    navigation.navigate("Records");
  };

  const goToChartsScreen = () => {
    //Navigate to record screen
    navigation.navigate("Charts");
  };

  return (
    <KeyboardAvoidingView style={styles.bg}>
      <View style={styles.mainContainer}>
        <Pressable
          style={styles.backPressable}
          onPress={() => navigation.goBack()}
        >
          <BackArrow />
        </Pressable>

        <View style={styles.header}>
          <View style={styles.profile}>
            <View style={styles.viewWelcomeName}>
              <MyAppText style={styles.textWelcomeName} typeFont="Bold">
                {`Hola ${userApp.name},`}{" "}
              </MyAppText>
            </View>

            <View style={styles.historyButton}>
              <Pressable
                style={styles.historyPressable}
                onPress={() => goToRecordsScreen()}
              >
                <SVGHistory width="50%" height="50%" />
              </Pressable>
            </View>
            <View style={styles.chartButton}>
              <Pressable
                style={styles.chartPressable}
                onPress={() => goToChartsScreen()}
              >
                <SVGTrafficLight width="50%" height="50%" />
              </Pressable>
            </View>
            <View style={styles.logoutButton}>
              <Pressable
                style={styles.logoutPressable}
                onPress={() => goToSelectUserScreen()}
              >
                <MyAppText style={styles.textLogout} typeFont="Regular">
                  {`Salir`}
                </MyAppText>
              </Pressable>
            </View>
          </View>

          <View style={styles.searcher}>
            <View style={styles.containerSearcher}>
              <SearchBar
                autoCorrect={false}
                placeholder="Buscar indicador..."
                onChangeText={updateSearch}
                value={search}
                platform={platform ? platform : "android"}
                containerStyle={styles.inputContainerSearcher}
                inputContainerStyle={{ backgroundColor: "white" }}
                inputStyle={{ backgroundColor: "white" }}
                leftIconContainerStyle={{ color: "black" }}
              />
            </View>
          </View>
        </View>
        <View style={styles.indicators}>
          {errorLoadingIndicators && (
            <MyAppText style={styles.error} typeFont="Regular">
              {() => errorLoadingIndicators}
            </MyAppText>
          )}
          <ScrollView
            contentContainerStyle={styles.grow}
            style={styles.scrollView}
          >
            {filteredIndicators.map((item, index) => (
              <IndicatorItem
                key={item.key}
                item={item}
                onPresssInfoIndicatorItem={() => goToInfoIndicator(item)}
                onPressAnswerIndicatorItem={() => gotoAnswerIndicator(item)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

//Styles
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
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  header: {
    flex: 1,
    marginBottom: 8,
  },
  indicators: {
    flex: 6,
  },
  profile: {
    flex: 3,
    flexDirection: "row",
  },
  viewWelcomeName: {
    paddingLeft: 12,
    flex: 7,
    justifyContent: "center",
  },

  textWelcomeName: {
    textAlignVertical: "center",
    color: COLORS.backgroundApp,
    fontSize: 22,
    fontWeight: "bold",
  },
  textLogout: {
    textAlignVertical: "center",
    color: COLORS.backgroundApp,
    fontSize: 14,
    fontWeight: "bold",
  },
  logoutButton: {
    flex: 2,
  },
  logoutPressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  historyPressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  historyButton: {
    flex: 2,
  },

  chartPressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  chartButton: {
    flex: 2,
  },

  searcher: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  containerSearcher: {
    backgroundColor: "rgba(52, 52, 52, 0.0)",
  },

  inputContainerSearcher: {
    width: "80%",
    height: 50,
    borderRadius: 8,

    backgroundColor: "white",
  },
  container: {
    marginTop: 30,
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
    width: "97%",
    alignSelf: "center",
    borderRadius: 16,
    marginTop: 8,
  },
  grow: { flexGrow: 1, paddingBottom: 28, backgroundColor: COLORS.white },
});
