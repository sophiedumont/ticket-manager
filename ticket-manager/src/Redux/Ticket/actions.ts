import requestService from "../../common/requestService";
import {
  CREATE_TICKET,
  CREATE_TICKET_ERROR,
  GET_ONE_TICKET,
  GET_TICKET_ERROR,
  GET_TICKETS,
  GET_TICKETS_ERROR,
  RESET_CREATE_TICKET_ERROR,
  RESET_GET_TICKET_ERROR,
  RESET_UPDATE_TICKET_ERROR,
  UPDATE_ONE_TICKET,
  UPDATE_TICKET_ERROR,
} from "../Ticket/constants";
import { reduxAction } from "../../types/actions.type";

export async function getUserConnectedTickets() {
  try {
    const response = await requestService.get("tickets");
    return {
      type: GET_TICKETS,
      payload: response.data,
    };
  } catch (e) {
    return {
      type: GET_TICKETS_ERROR,
    };
  }
}

export async function getOneTicket(id: string) {
  try {
    const response = await requestService.get(`tickets/${id}`);
    return {
      type: GET_ONE_TICKET,
      payload: response.data,
    };
  } catch (e) {
    return {
      type: GET_TICKET_ERROR,
    };
  }
}

export async function updateOneTicket(
  id: string,
  subject: string,
  content: string,
  type: string,
  priority: string
) {
  try {
    await requestService.put(`tickets/${id}`, {
      subject: subject,
      content: content,
      type: type,
      priority: priority,
    });
    return {
      type: UPDATE_ONE_TICKET,
    };
  } catch (e) {
    return {
      type: UPDATE_TICKET_ERROR,
    };
  }
}

export async function createOneTicket(
  subject: string,
  content: string,
  type: string,
  priority: string
): Promise<reduxAction> {
  try {
    await requestService.post("tickets", {
      subject: subject,
      content: content,
      type: type,
      priority: priority,
    });
    return {
      type: CREATE_TICKET,
    };
  } catch (e) {
    return {
      type: CREATE_TICKET_ERROR,
    };
  }
}

export function resetTicketError(): reduxAction {
  return {
    type: RESET_GET_TICKET_ERROR,
  };
}

export function resetCreateTicketError(): reduxAction {
  return {
    type: RESET_CREATE_TICKET_ERROR,
  };
}
export function resetUpdateTicketError(): reduxAction {
  return {
    type: RESET_UPDATE_TICKET_ERROR,
  };
}
