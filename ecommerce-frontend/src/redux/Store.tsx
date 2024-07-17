import { configureStore } from '@reduxjs/toolkit';
import { dashboardApi } from './api/dashboardApi';
import { orderApi } from './api/orderApi';
import { productApi } from './api/productApi';
import { userAPI } from './api/userApi';
import { CartReducer } from './reducer/CartReducer';
import { userReducer } from './reducer/UserReducer';

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [userReducer.name]: userReducer.reducer,
    [CartReducer.name]: CartReducer.reducer,
  },
  middleware: (mid) => [
    ...mid(),
    userAPI.middleware,
    productApi.middleware,
    orderApi.middleware,
    dashboardApi.middleware,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
