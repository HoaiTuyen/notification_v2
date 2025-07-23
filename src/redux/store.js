// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationSlice";

import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Cấu hình persist riêng cho slice "notification"
const notificationPersistConfig = {
  key: "notification",
  storage,
  whitelist: ["list", "count"], // chỉ lưu list và count
};

const persistedNotificationReducer = persistReducer(
  notificationPersistConfig,
  notificationReducer
);

const store = configureStore({
  reducer: {
    notification: persistedNotificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
