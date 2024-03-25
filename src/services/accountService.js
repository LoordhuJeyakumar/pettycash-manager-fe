import instanceService from "./instanceService";

const accountService = {
  getAccountsDetails: async () => {
    try {
      const response = await instanceService.protectedInstance.get("/account");

      return response;
    } catch (error) {
      console.error(error);

      return error;
    }
  },
  getAccountById: async (id) => {
    try {
      if (!id) {
        console.error(`is not valid ${id}`);
        return null;
      }
      const response = await instanceService.protectedInstance.get(
        `/account/${id}`
      );
      if (response) {
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  createAccount: async (accountObj) => {
    try {
      const response = await instanceService.protectedInstance.post(
        "/account/create",
        accountObj
      );
      if (response) {
        return response;
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  editAccountById: async (accountId, accountObj) => {
    try {
      const response = await instanceService.protectedInstance.put(
        `/account/update/${accountId}`,
        accountObj
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  deleteAccountById: async (id) => {
    try {
      if (!id) {
        console.error("Id not found");
      }

      const response = await instanceService.protectedInstance.delete(
        `/account/delete/${id}`
      );

      if (response) {
        return response;
      }
      throw Error;
    } catch (error) {
      return error;
    }
  },
};

export default accountService;
