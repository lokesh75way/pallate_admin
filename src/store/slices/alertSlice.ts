import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface authState {
  open: boolean;
  message: string;
  varient: "success" | "error";
}

const initialState: authState = {
  open: false,
  message: "",
  varient: "success",
};

export const alertSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openAlert: (
      state,
      action: PayloadAction<{ message: string; varient: "success" | "error" }>
    ) => {
      state.open = true;
      state.message = action.payload.message;
      state.varient = action.payload.varient;
    },
    closeAlert: (state) => {
      state.open = false;
      state.message = "";
      state.varient = "success";
    },
  },
});

export const { openAlert, closeAlert } = alertSlice.actions;

export default alertSlice.reducer;
