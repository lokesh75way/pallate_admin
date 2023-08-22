import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface AuthState {
  token: string;
}

const storedToken = localStorage.getItem('authToken');
const initialState = { token: storedToken || '' } as AuthState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state) {
      state.token = '';
      localStorage.removeItem('authToken');
    },
  },
});

export const { loginToken, logout } = authSlice.actions;
export const selectAuthToken = (state: RootState) => state.auth.token;
export default authSlice.reducer;
