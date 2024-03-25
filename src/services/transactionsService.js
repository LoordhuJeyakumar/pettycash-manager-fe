import instanceService from "./instanceService";

const transactionsService = {
  createTransaction: async (data) => {
    try {
      const response = await instanceService.protectedInstance.post(
        "transaction/create",

        data
      );

      return response;
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
  getCurrentMonthDetails: async (type) => {
    try {
      const response = await instanceService.protectedInstance.get(
        `/transaction/currentMonth/${type}`
      );

      if (response) {
        return response;
      }
      return null;
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
  getPreviousMonthDetails: async (type) => {
    try {
      const response = await instanceService.protectedInstance.get(
        `/transaction/previousMonth/${type}`
      );

      if (response) {
        return response;
      }
      return null;
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
  getAllTransactions: async () => {
    try {
      const response = await instanceService.protectedInstance.get(
        `/transaction`
      );

      if (response) {
        return response;
      }
      return null;
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
};

export default transactionsService;
