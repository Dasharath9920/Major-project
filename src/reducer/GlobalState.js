import React, { createContext, useReducer } from "react";
import reducer from "./reducer";

const initializer = {
  curr_user: -1,
  users: [],
  user_data: [],
  show_modal: false,
  modal_msg1: "",
  modal_msg2: "",
  decrypt: false,
};

export const GlobalStateContext = createContext(initializer);

export const GlobalState = ({ children }) => {
  return (
    <GlobalStateContext.Provider value={useReducer(reducer, initializer)}>
      {children}
    </GlobalStateContext.Provider>
  );
};
