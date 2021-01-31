import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import user, { userStore } from "./User/reducer";
import ticket, { ticketStore } from "./Ticket/reducer";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user"], // only navigation will be persisted
};

export interface rootState {
  user: userStore;
  ticket: ticketStore;
}

const rootReducer = combineReducers({
  user,
  ticket,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  //@ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);

export default store;
