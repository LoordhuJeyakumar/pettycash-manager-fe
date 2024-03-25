import instanceService from "./instanceService";
const CASH_REQUEST_ENDPOINT = `/cashRequest`;

const cashRequestService = {
  getAllRequests: async () => {
    try {
      const response = await instanceService.protectedInstance.get(
        CASH_REQUEST_ENDPOINT
      );
      if (response) {
        return response;
      } else {
        throw Error;
      }
    } catch (error) {
      return error;
    }
  },
  createRequest: async (obj) => {
    try {
      const response = await instanceService.protectedInstance.post(
        `${CASH_REQUEST_ENDPOINT}/create`,
        obj
      );
      if (response) {
        return response;
      } else {
        throw Error;
      }
    } catch (error) {
      return error;
    }
  },
  getAllPendingRequests: async () => {
    try {
      const response = await instanceService.protectedInstance.get(
        `${CASH_REQUEST_ENDPOINT}/pending`
      );

      return response;
    } catch (error) {
      return error;
    }
  },
  rejectRequest: async (obj) => {
    try {
      const response = await instanceService.protectedInstance.post(
        `${CASH_REQUEST_ENDPOINT}/reject`,
        obj
      );
      return response;
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
  approveRequest: async (obj) => {
    try {
      const response = await instanceService.protectedInstance.post(
        `${CASH_REQUEST_ENDPOINT}/approve`,
        obj
      );
      return response;
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
  getDocuments: async (id) => {
    try {
      const response = await instanceService.protectedInstance.get(
        `${CASH_REQUEST_ENDPOINT}/documents/${id}`
      );
    
      return response;
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
};
export default cashRequestService;
