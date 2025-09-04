import { createSlice } from "@reduxjs/toolkit";

const receivingInitialState = {
  receivingPayload: {
    codeId: "",
    receivedDate: "",
    receivedTime: "",
    description: "",
    attachments: [],
    forwardedBy: "",
    natureOfCommId: null,
    natureOfComm: "",

    receivedThru: "",
  },
};

export const receivingSlice = createSlice({
  name: "receiving",
  initialState: receivingInitialState,
  reducers: {
    setReceivingPayload: (state, action) => {
      state.receivingPayload = action.payload;
    },
  },
});

export const { setReceivingPayload } = receivingSlice.actions;
export default receivingSlice.reducer;
