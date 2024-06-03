import { StyleSheet } from "react-native";
import React from "react";

//images and icons
import StagePreconcepcion from "../../assets/stagePreconcepcion.svg";
import StageEmbarazo from "../../assets/stageEmbarazo.svg";
import StagePosparto from "../../assets/stagePosparto.svg";
import StageInfancia from "../../assets/stageInfancia.svg";
import StagePreescolar from "../../assets/stagePreescolar.svg";
import StagePreconcepcionBig from "../../assets/stagePreconcepcionBig.svg";
import StageEmbarazoBig from "../../assets/stageEmbarazoBig.svg";
import StagePospartoBig from "../../assets/stagePospartoBig.svg";
import StageInfanciaBig from "../../assets/stageInfanciaBig.svg";
import StagePreescolarBig from "../../assets/stagePreescolarBig.svg";
import StagePreconcepcionMedium from "../../assets/stagePreconcepcionMedium.svg";
import StageEmbarazoMedium from "../../assets/stageEmbarazoMedium.svg";
import StagePospartoMedium from "../../assets/stagePospartoMedium.svg";
import StageInfanciaMedium from "../../assets/stageInfanciaMedium.svg";
import StagePreescolarMedium from "../../assets/stagePreescolarMedium.svg";

export default function stageComponent(props) {
  //Depending the size of the component, it will render a different svg
  const { stage, size } = props;
  if (size === "small") {
    return stage === "PreconcepciÃ³n" ? (
      <StagePreconcepcion style={styles.stageComponent} />
    ) : stage === "Embarazo" ? (
      <StageEmbarazo />
    ) : stage === "Posparto" ? (
      <StagePosparto />
    ) : stage === "Infancia" ? (
      <StageInfancia />
    ) : stage === "Preescolar" ? (
      <StagePreescolar />
    ) : (
      <StagePreconcepcion />
    );
  } else if (size === "big") {
    return stage === "PreconcepciÃ³n" ? (
      <StagePreconcepcionBig style={styles.stageComponent} />
    ) : stage === "Embarazo" ? (
      <StageEmbarazoBig />
    ) : stage === "Posparto" ? (
      <StagePospartoBig />
    ) : stage === "Infancia" ? (
      <StageInfanciaBig />
    ) : stage === "Preescolar" ? (
      <StagePreescolarBig />
    ) : (
      <StagePreconcepcionBig />
    );
  } else if (size === "medium") {
    return stage === "PreconcepciÃ³n" ? (
      <StagePreconcepcionMedium style={styles.stageComponent} />
    ) : stage === "Embarazo" ? (
      <StageEmbarazoMedium />
    ) : stage === "Posparto" ? (
      <StagePospartoMedium />
    ) : stage === "Infancia" ? (
      <StageInfanciaMedium />
    ) : stage === "Preescolar" ? (
      <StagePreescolarMedium />
    ) : (
      <StagePreconcepcionMedium />
    );
  }
}

const styles = StyleSheet.create({
  stageComponent: {
    height: "100%",
    width: "100%",
  },
});
