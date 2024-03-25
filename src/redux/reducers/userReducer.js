const initialState = {
  isLoggedIn: false,
  signup: {
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  },
  login: {
    email: "",
    password: "",
  },
  details: {
    id: "",
    name: "",
    email: "",
    phone: "",
    addressDetails: {
      address: null,
      city: null,
      state: null,
      pincode: null,
    },
    role: "",
    dob: null,
    doj: null,
    accessToken: "",
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOGIN":
      return {
        ...state,
        isLoggedIn: true,
      };
    case "UNSET_LOGIN":
      return {
        ...state,
        isLoggedIn: false,
      };
    case "SET_LOGIN_USER":
      return {
        ...state,
        login: { ...state.login, [action.payload.name]: action.payload.value },
      };
    case "UNSET_LOGIN_USER":
      return { ...initialState };
    case "SET_SIGNUP_USER":
      return {
        ...state,
        signup: {
          ...state.signup,
          [action.payload.name]: action.payload.value,
        },
      };
    case "UNSET_SIGNUP_USER":
      return { ...initialState };
    case "SET_USER_DETAILS":
      return {
        ...state,
        details: {
          ...state.details,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default userReducer;
