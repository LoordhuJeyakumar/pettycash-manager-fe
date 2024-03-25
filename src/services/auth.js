import { toast } from "react-toastify";
import instanceService from "./instanceService.js";
import axios from "axios";

const authService = {
  signup: async (user) => {
    try {
      const response = await instanceService.authInstance.post(
        "/user/signup",
        user
      );

      if (response.data) {
        return response;
      } else {
        console.error("error registering user");
        return response;
      }
    } catch (error) {
      if (!error?.response) {
        console.error("No server response", error);

        return error;
      } else if (error.response?.status === 409) {
        console.error("already exist", error);
        return error.response;
      } else {
        console.error(error);
        return error.response;
      }
    }
  },
  verify: async (token) => {
    const obj = { verificationToken: token };
    try {
      const response = await instanceService.authInstance.post(
        "/user/verify",
        obj
      );

      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  sendVerificationEmail: async (email) => {
    try {
      const response = await instanceService.authInstance.post(
        "/user/sendVerificationEmail",
        email
      );

      return response;
    } catch (error) {
      console.error(error);
      return error.response;
    }
  },
  login: async (user) => {
    try {
      const response = await instanceService.authInstance.post(
        "/user/login",
        user
      );
      if (response?.data?.accessToken) {
        sessionStorage.setItem("user", JSON.stringify(response.data));
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("isLoggedIn", true);
      }

      return response;
    } catch (error) {
      comsole.error(error);
      if (!error?.response) {
        console.error("No server response", error);
        return error;
      } else if (error.response.status === 401) {
        console.error(error.response.data.message, error);
        return error.response;
      } else if (error.response.status === 403) {
        console.error(error.response.data.message, error);
        return error.response;
      }

      return error;
    }
  },
  getUserDetails: async (id) => {
    try {
      const response = await instanceService.protectedInstance.get(
        `/user/${id}`
      );

      return response.data;
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
  updateUserDetails: async (id, updateObj) => {
    try {
      const response = await instanceService.protectedInstance.put(
        `/user/update/${id}`,
        updateObj
      );

      return response;
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
  changePassword: async (id, passwordObj) => {
    try {
      const response = await instanceService.protectedInstance.post(
        `/user/changePassword/${id}`,
        passwordObj
      );
      if (response) {
        return response;
      }
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
  deactivate: async (id) => {
    try {
      const response = await instanceService.protectedInstance.post(
        `/user/deactivate/${id}`
      );
      if (response) {
        return response;
      }
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
  deleteAccount: async (id) => {
    try {
      const response = await instanceService.protectedInstance.post(
        `/user/delete/${id}`
      );
      if (response) {
        return response;
      }
    } catch (error) {
      comsole.error(error);
      return error;
    }
  },
};

export default authService;
