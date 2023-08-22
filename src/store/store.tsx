import { configureStore } from '@reduxjs/toolkit';
import {usersApi} from  '../services/userApi'
import authReducer from './authReducer';

const store = configureStore({
  reducer:{
    [usersApi.reducerPath]:usersApi.reducer,
    auth: authReducer
  },
  middleware:(getDefaultMiddleware)=>
      getDefaultMiddleware().concat(usersApi.middleware)

});

export default store;
export type RootState = ReturnType<typeof store.getState>;
