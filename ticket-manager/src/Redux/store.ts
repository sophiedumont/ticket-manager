import { createStore, combineReducers } from "redux";
import user, { userStore } from "./User/reducer";
import ticket, { ticketStore } from "./Ticket/reducer";

export interface rootState {
  user: userStore;
  ticket: ticketStore;
}

const store = createStore(
  combineReducers({
    user,
    ticket,
  }),
  //@ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
