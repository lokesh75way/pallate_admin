import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string;
}

const storedToken = localStorage.getItem('authToken');
const initialState = { token: storedToken || '' } as AuthState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    increment(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state) {
      state.token = '';
      localStorage.removeItem('authToken');
    },
  },
});

export const { increment, logout } = authSlice.actions;

export default authSlice.reducer;
