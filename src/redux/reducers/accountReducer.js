const initialState = {
  createAccount: {
    acc_Name: "",
    companyName: "",
    opening_Balance: 0,
    createdBy: "",
  },
  accountDetails: [],
  editAccountDetails: {
    _id: "",
    acc_Name: "",
    companyName: "",
    createdBy: "",
    opening_Balance: 0,
    clossingBalance: 0,
    cashRequests: [],
    transactions: [],
    createdAt: "",
    updatedAt: "",
  },
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CREATE_ACCOUNT":
      return {
        ...state,
        createAccount: { ...action.payload },
      };
    case "UNSET_CREATE_ACCOUNT":
      return {
        ...state,
        createAccount: { ...initialState.createAccount },
      };
    case "SET_ACC_DETAILS":
      let payloadArr = action.payload;
      let res = payloadArr.map((eachData) => {
        if (eachData.cashRequests) {
          eachData.totalCashRequests = eachData.cashRequests.length;
        }

        if (eachData.transactions) {
          eachData.totalTransactions = eachData.transactions.length;
        }

        if (eachData.createdAt || eachData.updatedAt) {
          eachData.createdAt = new Date(eachData.createdAt);
          eachData.updatedAt = new Date(eachData.updatedAt);
        }

        return eachData;
      });

      return {
        ...state,
        accountDetails: res,
      };
    case "UNSET_ACC_DETAILS":
      return {
        ...state,
        accountDetails: { ...initialState.accountDetails },
      };
    case "SET_EDIT_ACCOUNT":
      return {
        ...state,
        editAccountDetails: { ...action.payload },
      };
    case "UNSET_EDIT_ACCOUNT":
      return {
        ...state,
        editAccountDetails: { ...initialState.editAccountDetails },
      };
    default:
      return state;
  }
};

export default accountReducer;
