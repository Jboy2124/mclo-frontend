import { createSlice } from "@reduxjs/toolkit";

const authInitialState = {
  authUser: {
    fname: "",
    lname: "",
    email: "",
    userId: "",
    accessLevel: null,
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
    logoutUser: (state) => {
      state.authUser = { ...authInitialState.authUser };
    },
  },
});

export const { setAuthUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
