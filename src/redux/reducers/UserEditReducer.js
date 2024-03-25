const initialState = {
  basicInfo: {
    name: "",
    email: "",
    phone: "",
    dob: null,
    addressDetails: {
      address: null,
      city: null,
      state: null,
      pincode: null,
    },
  },
  changePassword: {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  },
};

function UserEditReducer(state = initialState, action) {
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
        ...state,
      };
    case "SET_CHANGEPASSWORD":
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          ...action.payload,
        },
      };
    case "UNSET_CHANGEPASSWORD":
      return {
        ...state,
      };
    default:
      return initialState;
  }
}

export default UserEditReducer;
