import React, { useState, createContext } from "react";

export const AppContext = createContext({
  //General data to be used in the app
  stateApp: undefined,
  municipalityApp: undefined,
  clinicApp: undefined,
  userApp: undefined,
});

export function AppProvider(props) {
  const { children } = props;
  //"global" data
  const [stateApp, setStateApp] = useState(undefined);
  const [municipalityApp, setMunicipalityApp] = useState(undefined);
  const [clinicApp, setClinicApp] = useState(undefined);
  const [userApp, setUserApp] = useState(undefined);
  const [indicatorActiveApp, setIndicatorActiveApp] = useState(undefined);
  const [indicatorAnswered, setIndicatorAnswered] = useState();
  const [recordActiveApp, setRecordActiveApp] = useState(undefined);

  const valueContext = {
    stateApp,
    municipalityApp,
    clinicApp,
    userApp,
    indicatorActiveApp,
    indicatorAnswered,
    recordActiveApp,
    setStateApp,
    setMunicipalityApp,
    setClinicApp,
    setUserApp,
    setIndicatorActiveApp,
    setIndicatorAnswered,
    setRecordActiveApp,
  };
  return (
    <AppContext.Provider value={valueContext}>{children}</AppContext.Provider>
  );
}
