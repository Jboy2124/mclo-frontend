import { createSlice } from "@reduxjs/toolkit";

const releaseInitialState = {
  payloadObject: {
    docId: "",
    codeId: "",
    releasedDateTime: "",
    liaison: "",
    receivedBy: "",
    remarks: "",
  },
};

export const releaseSlice = createSlice({
  name: "release",
  initialState: releaseInitialState,
  reducers: {
    setPayloadObject: (state, action) => {
      state.payloadObject = {
        ...state.payloadObject,
        ...action.payload,
      };
    },
  },
});

export const { setPayloadObject } = releaseSlice.actions;
export default releaseSlice.reducer;
