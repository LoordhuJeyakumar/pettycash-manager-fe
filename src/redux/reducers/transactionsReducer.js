const initialState = {
  allTransactions: [],
  allTransactionsSummery: null,
  newTransaction: {
    pettyCashAccountId: "",
    description: "",
    entries: [],
    department: "",
    type: "",
    receipts: [],
  },
  entries: {
    entry_Name: "",
    entry_Amount: "",
    category: "",
  },
  currentMonthExpense: [],
  previousMonthExpense: [],
  currentMonthIncome: [],
  previousMonthIncome: [],
};

function transactionsReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_ALL_TRANSACTIONS":
      return {
        ...state,
        allTransactions: action.payload,
      };
    case "SET_ALL_TRANSACTIONS_SUMMERY":
      return {
        ...state,
        allTransactionsSummery: [...action.payload],
      };
    case "UNSET_ALL_TRANSACTIONS":
      return {
        ...state,
        allTransactions: [],
      };
    case "SET_ENTRIES":
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.name]: action.payload.value,
        },
      };
    case "UNSET_ENTRIES":
      return {
        ...state,
        entries: {
          ...initialState.entries,
        },
      };
    case "SET_RECEIPTS":
      return {
        ...state,
        newTransaction: {
          ...state.newTransaction,
          [action.payload.name]: action.payload.value,
        },
      };
    case "SET_NEW_TRANSACTION":
      if (action.payload.pettyCashAccountId) {
        return {
          ...state,
          newTransaction: { ...state.newTransaction, ...action.payload },
        };
      }

      return {
        ...state,
        newTransaction: {
          ...state.newTransaction,
          [action.payload.name]: action.payload.value,
        },
      };
    case "USET_NEW_TRANSACTION":
      return {
        ...state,
        newTransaction: { ...initialState.newTransaction },
      };

    case "SET_CURRENT_MONTH_EXPENSE":
      return {
        ...state,
        currentMonthExpense: action.payload,
      };
    case "SET_PREVIOUS_MONTH_EXPENSE":
      return {
        ...state,
        previousMonthExpense: action.payload,
      };
    case "SET_CURRENT_MONTH_INCOME":
      return {
        ...state,
        currentMonthIncome: action.payload,
      };
    case "SET_PREVIOUS_MONTH_INCOME":
      return {
        ...state,
        previousMonthIncome: action.payload,
      };
    case "RESET_ALL":
      state.newTransaction.entries = [];
      state = initialState;

      return {
        ...initialState,
        newTransaction: {
          ...initialState.newTransaction,
          entries: [],
        },
      };
    default:
      state.newTransaction.entries = [];
      return state;
  }
}

export default transactionsReducer;
