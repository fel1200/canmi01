//Var to save COLORS
export const COLORS = {
  //app's style colors
  primary1: "#E73439",
  primary2: "#E7686B",
  primary3: "#ED9093",
  secondary1: "#000000",
  secondary2: "#373532",
  secondary3: "#53504C",
  tertiary1: "#A19688",
  brightContrast: "#FAFAFA",
  white: "#FFFFFF",
  disabled1: "#F1F1F1",
  disabled2: "#E8E8E8",
  disabled3: "#A5A5A5",
  backgroundApp: "#FAFAFA",
  greenTrafficLight: "#7BB662",
  yellowTrafficLight: "#F5BD1E",
  redTrafficLight: "#E7686B",
  //Colors for the different stages
  preconcepcion: "#E5CFBA",
  embarazo: "#CBB7A4",
  posparto: "#B09F8F",
  infancia: "#8E8174",
  preescolar: "#5E544B",
};

//For fullfillment of the indicator
export const colorCirclePercentage = (percentage) => {
  return {
    backgroundColor:
      percentage >= 0 && percentage < 70
        ? COLORS.redTrafficLight
        : percentage >= 70 && percentage < 90
        ? COLORS.yellowTrafficLight
        : percentage >= 90 && percentage <= 100
        ? COLORS.greenTrafficLight
        : COLORS.redTrafficLight,
  };
};

export const textPercentage = (percentage) => {
  return percentage >= 0 && percentage < 70
    ? "Mala"
    : percentage >= 70 && percentage < 90
    ? "Deficiente"
    : percentage >= 90 && percentage <= 100
    ? "Buena"
    : "Mala";
};

//URLS to fetch data
//General api host
export const API_HOST = "https://devdcm.com/";
//send record
export const API_HOST_RECORDS = "https://devdcm.com/indicator_answer/create";
//get info from token to get session
export const API_HOST_TOKEN = "https://devdcm.com/auth/signin";
