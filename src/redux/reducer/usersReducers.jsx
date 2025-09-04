import { createSlice } from "@reduxjs/toolkit";

const userInitialState = {
  userProfile: [],
};

export const userListSlice = createSlice({
  name: "users",
  initialState: userInitialState,
  reducers: {
    setUserList: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setUserList } = userListSlice.actions;
export default userListSlice.reducer;
