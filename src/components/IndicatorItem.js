import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import React from "react";
//Components
import StageComponent from "./StageComponent.js";
//Styled font
import MyAppText from "./componentStyles/MyAppText.js";
//Colors
import { COLORS } from "../utils/constants.js";
//icons and images
import PlayIndicator from "../../assets/iconPlayCircleFill.svg";
import InfoIndicator from "../../assets/InfoCircle.svg";

export default function IndicatorItem(props) {
  //Data from props
  const { item, onPresssInfoIndicatorItem, onPressAnswerIndicatorItem } = props;

  //render
  return (
    <TouchableOpacity
      onPress={onPresssInfoIndicatorItem}
      style={styles.containerItem}
    >
      <View style={styles.containerDetail}>
        <View style={styles.circleStage}>
          <View style={styles.stage}>
            <StageComponent stage={item.stage} size={"small"}></StageComponent>
          </View>
        </View>
        <View style={styles.lineSplitter}></View>
        <View style={styles.detailItemContainer}>
          <View style={styles.detailItemContainerTexts}>
            <MyAppText style={styles.titleTextIndicator} typeFont="Bold">
              {`Indicador ${item.idIndicator}`}
            </MyAppText>
            <View style={styles.containerDetailTextIndicator}>
              <MyAppText
                style={styles.detailTextIndicator}
                typeFont="Regular"
                numberOfLines={4}
              >
                {item.name}
              </MyAppText>
            </View>
          </View>
          <View style={styles.detailItemContainerButtons}>
            <Pressable
              style={styles.continueIndicator}
              onPress={() => onPressAnswerIndicatorItem()}
            >
              <PlayIndicator />
            </Pressable>
            <Pressable
              style={styles.infoIndicator}
              onPress={() => onPresssInfoIndicatorItem(item)}
            >
              <InfoIndicator />
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.line} />
    </TouchableOpacity>
  );
}

//Styles
const styles = StyleSheet.create({
  containerItem: {
    height: 120,
    width: "100%",
    paddingTop: 4,
  },
  line: {
    height: 1,
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
    height: 136,
    width: 1,
    backgroundColor: COLORS.tertiary1,
    backgroundColor: COLORS.disabled1,
  },
  detailItemContainer: {
    height: "100%",
    flex: 6,
    paddingLeft: 8,
    flexDirection: "row",
  },
  detailItemContainerTexts: {
    flex: 4,
  },
  titleTextIndicator: {
    marginTop: 4,
    fontSize: 16,
    flex: 1,
  },
  containerDetailTextIndicator: {
    flex: 4,
    flexDirection: "row",
  },
  detailTextIndicator: {
    marginTop: 8,
    fontSize: 13,
  },
  detailItemContainerButtons: {
    flex: 2,
    flexDirection: "row",
  },

  continueIndicator: {
    width: 30,
    justifyContent: "center",
    marginLeft: 24,
  },

  infoIndicator: {
    width: 30,
    marginLeft: 8,
    justifyContent: "center",
  },
});
