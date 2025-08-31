import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configApi } from "./api/configApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import accountReducer from "./reducer/accountReducer";
import commonCodeReducer from "./reducer/commonCodeReducer";
import authReducer from "./reducer/authReducer";
import releaseReducer from "./reducer/releasingReducer";

const rootReducer = combineReducers({
  [configApi.reducerPath]: configApi.reducer,
  account: accountReducer,
  commonCodes: commonCodeReducer,
  auth: authReducer,
  releaseReducers: releaseReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only 'auth' will be persisted
};

const persistedReducers = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducers,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      configApi.middleware
    ),
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);
