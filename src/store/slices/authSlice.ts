import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface authState {
  authenticated: boolean;
  user?: User;
  token: string;
}

const initialState: authState = {
  authenticated: false,
  user: undefined,
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userSignedIn: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.authenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    userSignedOut: (state) => {
      state.authenticated = false;
      state.token = "";
      state.user = undefined;
    },
  },
});

export const { userSignedIn, userSignedOut } = authSlice.actions;

export default authSlice.reducer;
