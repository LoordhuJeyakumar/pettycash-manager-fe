import { combineReducers } from "redux";
import userReducer from "./userReducer";
import editUserReducer from "./editUserReducer";
import accountReducer from "./accountReducer";
import cashRequestReducer from "./cashRequestReducer";
import transactionsReducer from "./transactionsReducer";

const rootReducer = combineReducers({
  user: userReducer,
  editUser: editUserReducer,
  account: accountReducer,
  cashRequest: cashRequestReducer,
  transactions: transactionsReducer,
});

export default rootReducer;
