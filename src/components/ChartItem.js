//React imports
import { View, StyleSheet, TouchableOpacity } from "react-native";
//Styled text
import MyAppText from "./componentStyles/MyAppText.js";
//Colors
import {
  COLORS,
  colorCirclePercentage,
  textPercentage,
} from "../utils/constants.js";

export default function ChartItem(props) {
  //Context data
  const { item, typeOfRecords } = props;

  return (
    <TouchableOpacity style={styles.containerItem}>
      <View style={styles.line} />
      <View style={styles.containerDetail}>
        <View style={styles.lineSplitter}></View>
        <View style={styles.detailItemContainer}>
          <View style={styles.detailItemContainerTexts}>
            <MyAppText style={styles.titleTextIndicator} typeFont="Bold">
              {typeOfRecords === "idIndicator"
                ? `Indicador ${item.idIndicator}`
                : typeOfRecords === "stage"
                ? `${item.stage}`
                : typeOfRecords === "subindicator"
                ? `Subindicador ${item.subindicator}`
                : null}
            </MyAppText>
            <View style={styles.containerDetailTextIndicator}>
              {typeOfRecords === "idIndicator" ? (
                <MyAppText
                  style={styles.detailTextIndicatorName}
                  typeFont="Regular"
                  numberOfLines={3}
                >
                  {item.name}
                </MyAppText>
              ) : typeOfRecords === "subindicator" ? (
                <MyAppText
                  style={styles.detailTextIndicatorName}
                  typeFont="Regular"
                  numberOfLines={3}
                >
                  {item.nameSubindicator}
                </MyAppText>
              ) : null}
              <MyAppText
                style={styles.detailTextIndicator}
                typeFont="Regular"
                numberOfLines={1}
              >
                {`Respuestas: ${item.counter}`}
              </MyAppText>
              <MyAppText
                style={styles.detailTextIndicator}
                typeFont="Regular"
                numberOfLines={1}
              >
                {`Cumplimiento: ${item.counterFulfilled}`}
              </MyAppText>

              <MyAppText
                style={styles.detailTextIndicator}
                typeFont="Regular"
                numberOfLines={1}
              >
                {`Porcentaje: ${item.percentage}%`}
              </MyAppText>

              <MyAppText
                style={styles.detailTextIndicator}
                typeFont="Regular"
                numberOfLines={1}
              >
                {`Calidad: ${textPercentage(item.percentage)}`}
              </MyAppText>
            </View>
          </View>
          <View style={styles.detailItemContainerColors}>
            <View
              style={[
                styles.circleIndicator,
                colorCirclePercentage(item.percentage),
              ]}
            ></View>
          </View>
        </View>
      </View>
      <View style={styles.line} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerItem: {
    height: 220,
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
  lineSplitter: {
    height: "100%",
    width: 1,
    backgroundColor: COLORS.tertiary1,
    backgroundColor: COLORS.disabled1,
  },
  detailItemContainer: {
    height: "100%",
    flex: 1,
    paddingLeft: 16,
    flexDirection: "row",
  },
  detailItemContainerTexts: {
    flex: 6,
  },
  detailItemContainerColors: {
    flex: 2,
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: 16,
  },
  circleIndicator: {
    height: "80%",
    width: 8,
    borderRadius: 15,
  },
  titleTextIndicator: {
    marginTop: 8,
    fontSize: 16,
    height: 30,
  },
  containerDetailTextIndicator: {
    flex: 7,
    marginTop: 0,
    flexDirection: "column",
  },
  detailTextIndicatorName: {
    fontSize: 14,
    color: COLORS.secondary3,
  },
  detailTextIndicator: {
    fontSize: 13,
    color: COLORS.tertiary1,
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
