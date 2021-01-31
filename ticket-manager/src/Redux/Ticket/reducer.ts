import {
  CREATE_TICKET,
  CREATE_TICKET_ERROR,
  GET_ONE_TICKET,
  GET_TICKET_ERROR,
  GET_TICKETS,
  GET_TICKETS_ERROR,
  RESET_CREATE_TICKET_ERROR,
  RESET_GET_TICKET_ERROR,
  RESET_SUCCESS,
  RESET_UPDATE_TICKET_ERROR,
  UPDATE_ONE_TICKET,
  UPDATE_TICKET_ERROR,
} from "./constants";
import { reduxAction } from "../../types/actions.type";

export interface TicketModel {
  id: string;
  status: string;
  subject: string;
  content: string;
  priority: string;
  type: string;
  createdAt: String;
  updateAt: String;
}

export interface ticketStore {
  tickets?: TicketModel[];
  oneTicket?: TicketModel;
  createdTicket: boolean;
  updatedTicket: boolean;
  getTicketsError: boolean;
  getCreatedTicketsError: boolean;
  getOneTicketError: boolean;
  updateTicketError: boolean;
}

const initialState: ticketStore = {
  oneTicket: undefined,
  tickets: undefined,
  updatedTicket: false,
  createdTicket: false,
  getTicketsError: false,
  getCreatedTicketsError: false,
  getOneTicketError: false,
  updateTicketError: false,
};

function reducer(state = initialState, action: reduxAction) {
  switch (action.type) {
    case GET_TICKETS:
      return { ...state, tickets: action.payload };
    case GET_TICKETS_ERROR:
      return { ...state, getTicketsError: true };
    case RESET_GET_TICKET_ERROR:
      return { ...state, getTicketsError: false };
    case CREATE_TICKET:
      return {
        ...state,
        createdTicket: true,
        tickets: [action.payload.createdTicket, ...(state.tickets || [])],
      };
    case CREATE_TICKET_ERROR:
      return { ...state, getCreatedTicketsError: true };
    case RESET_CREATE_TICKET_ERROR:
      return { ...state, getCreatedTicketsError: false };
    case GET_ONE_TICKET:
      return { ...state, oneTicket: action.payload };
    case GET_TICKET_ERROR:
      return { ...state, getOneTicketError: true };
    case UPDATE_ONE_TICKET:
      return {
        ...state,
        updatedTicket: true,
        tickets: [
          action.payload.updatedTicket,
          ...(state.tickets || []).filter(
            (t) => action.payload.updatedTicket.id !== t.id
          ),
        ],
      };
    case UPDATE_TICKET_ERROR:
      return { ...state, updateTicketError: true };
    case RESET_UPDATE_TICKET_ERROR:
      return { ...state, updateTicketError: false };
    case RESET_SUCCESS:
      return {
        ...state,
        updatedTicket: false,
        createdTicket: false,
        getTicketsError: false,
        getCreatedTicketsError: false,
        getOneTicketError: false,
        updateTicketError: false,
      };
    default:
      return state;
  }
}

export default reducer;
