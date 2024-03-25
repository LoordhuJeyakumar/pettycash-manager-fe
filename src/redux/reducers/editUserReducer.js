const initialState = {
  basicInfo: {
    name: "",
    email: "",
    phone: "",
    dob: "",
    addressDetails: {
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  },
  changePassword: {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  },
};

function editUserReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_BASICINFO":
      return {
        ...state,
        basicInfo: {
          ...state.basicInfo,
          ...action.payload,
        },
      };
    case "UNSET_BASICINFO":
      return {
        ...initialState,
      };
    case "SET_CHANGEPASSWORD":
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          [action.payload.name]: action.payload.value,
        },
      };
    case "UNSET_CHANGEPASSWORD":
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

export default editUserReducer;
