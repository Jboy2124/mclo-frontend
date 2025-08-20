import { createSlice } from "@reduxjs/toolkit";

const commonCodeInitialState = {
  titles: {
    id: 0,
    value: "",
  },
  designation: {
    id: 0,
    value: "",
  },
  natureOfCommunication: {
    id: 0,
    value: "",
  },
  receivedThru: {
    id: 0,
    value: "",
  },
  documentTypes: {
    id: 0,
    value: "",
    shortcut: "",
  },
};

export const commonCodeSlice = createSlice({
  name: "commonCodes",
  initialState: commonCodeInitialState,
  reducers: {
    titles: (state, action) => {
      state.titles = {
        ...state.titles,
        ...action.payload,
      };
    },
    designation: (state, action) => {
      state.designation = {
        ...state.designation,
        ...action.payload,
      };
    },
    setNatureOfCommunication: (state, action) => {
      state.natureOfCommunication = {
        ...state.natureOfCommunication,
        ...action.payload,
      };
    },
    setReceivedThrough: (state, action) => {
      state.receivedThru = {
        ...state.receivedThru,
        ...action.payload,
      };
    },
    setDocumentTypes: (state, action) => {
      state.documentTypes = {
        ...state.documentTypes,
        ...action.payload,
      };
    },
  },
});

export const {
  titles,
  designation,
  setNatureOfCommunication,
  setReceivedThrough,
  setDocumentTypes,
} = commonCodeSlice.actions;
export default commonCodeSlice.reducer;
