import { createSlice } from "@reduxjs/toolkit";

const authInitialState = {
  authUser: {
    fname: "",
    lname: "",
    email: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = {
        ...state.authUser,
        ...action.payload,
      };
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
