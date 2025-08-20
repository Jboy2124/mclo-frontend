import { createSlice } from "@reduxjs/toolkit";

const registerInitialState = {
  registration: {
    id: "",
    title: 0,
    firstName: "",
    lastName: "",
    designation: 0,
  },
  credentials: {
    email: "",
    password: "",
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState: registerInitialState,
  reducers: {
    register: (state, action) => {
      state.registration = {
        ...state.registration,
        ...action.payload,
      };
    },
    credentials: (state, action) => {
      state.credentials = {
        ...state.credentials,
        ...action.payload,
      };
    },
  },
});

export const { register, credentials } = accountSlice.actions;
export default accountSlice.reducer;
