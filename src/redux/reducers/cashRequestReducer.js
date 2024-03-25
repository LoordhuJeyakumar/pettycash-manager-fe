const initialState = {
  totalCashRequests: [],
  pendingRequests: [],
  allCashRequests: [],
  newRequest: {
    accountId: "",
    purpose: "",
    amount: "",
    documents: [],
  },
  isUpdate: false,
  pendingRequestsSummery: null,
};

function cashRequestReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_TOTAL_REQUESTS":
      return {
        ...state,
        totalCashRequests: action.payload,
      };
    case "UNSET_TOTAL_REQUESTS":
      return {
        ...state,
        totalCashRequests: initialState.totalCashRequests,
      };
    case "SET_ALL_REQUESTS":
      return {
        ...state,
        allCashRequests: { ...action.payload, ...state.allCashRequests },
      };
    case "UNSET_ALL_REQUESTS":
      return {
        ...state,
        allCashRequests: initialState.allCashRequests,
      };

    case "SET_NEWREQUEST":
      return {
        ...state,
        newRequest: { ...action.payload },
      };
    case "UNSET_NEWREQUEST":
      return {
        ...state,
        newRequest: { ...initialState.newRequest },
      };
    case "SET_PENDING_REQUESTS":
      return {
        ...state,
        pendingRequests: [...action.payload],
      };
    case "SET_PENDING_REQUESTS_SUMMERY":
      return {
        ...state,
        pendingRequestsSummery: action.payload,
      };
    case "UNSET_NEWREQUEST":
      return {
        ...state,
        pendingRequests: [...initialState.pendingRequests],
      };
    case "SET_IS_UPDATE":
      return {
        ...state,
        isUpdate: !state.isUpdate,
      };
    default:
      return state;
  }
}

export default cashRequestReducer;
