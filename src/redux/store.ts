import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./authSlice";
import segmentReducer from "./segmentSlice";
import productReducer from "./productSlice";
import appReducer from "./appSlice";
import userReducer from "./userSlice";
import voucherReducer from "./voucherSlice";
import bankReducer from "./bankSlice";
import orderReducer from "./orderSlice";
import analyticReducer from "./analyticSlice";
import chatReducer from "./chatSlice";
import newReducer from "./newSlice";
import eventReducer from "./eventSlice";

// Persist config chỉ cho auth
const authPersistConfig = {
  key: "auth",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  segment: segmentReducer,
  product: productReducer,
  app: appReducer,
  user: userReducer,
  voucher: voucherReducer,
  bank: bankReducer,
  order: orderReducer,
  analytics: analyticReducer,
  chat: chatReducer,
  new: newReducer,
  event: eventReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
