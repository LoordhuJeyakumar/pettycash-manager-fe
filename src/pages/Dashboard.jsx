import React, { useEffect, useState } from "react";
import "../components/css/root.css";
import { useDispatch, useSelector } from "react-redux";
import MainWrapper from "../components/MainWrapper";
import { Navigate, useNavigate } from "react-router-dom";
import transactionsService from "../services/transactionsService";
import { toast } from "react-toastify";
import cashRequestService from "../services/cashRequestService";
import accountService from "../services/accountService";
import ChartPie from "../components/ChartPie";
import LineChart from "./LineChart";
import AllCashRequestsTable from "../components/AllCashRequestsTable";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Dashboard() {
  const cashRequestState = useSelector((state) => state.cashRequest);
  const transactionsState = useSelector((state) => state.transactions);
  const user = sessionStorage.getItem("user");

  const userParsed = JSON.parse(sessionStorage.getItem("user"));

  const currentMonth = new Date().getMonth();

  const [currentMonthExpenseSummery, setCurrentMonthExpenseSummery] =
    useState(null);
  const [previousMonthExpenseSummery, setPreviousMonthExpenseSummery] =
    useState(null);
  const [currentMonthIncomeSummery, setCurrentMonthIncomeSummery] =
    useState(null);
  const [previousMonthIncomeSummery, setPreviousMonthIncomeSummery] =
    useState(null);
  const [allTransactionsCount, setAllTransactionsCount] = useState(null);
  const [accountSummery, setAccountSummery] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCurrentMonthExpenseDetails = async () => {
    try {
      const res = await transactionsService.getCurrentMonthDetails("expense");

      if (
        res.response?.status === 401 &&
        res.response?.data?.error == "Token is invalid"
      ) {
        toast.error("Session expired please login");
        sessionStorage.clear();
        navigate("/login");
      }
      if (res.status === 200) {
        dispatch({ type: "SET_CURRENT_MONTH_EXPENSE", payload: res.data });
      }
      setCurrentMonthExpenseSummery({
        totalAmount: res.data.transactionsSummery[0].totalAmount,
        totalTransaction: res.data.transactionsSummery[0].count,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const getPreviousMonthExpenseDetails = async () => {
    try {
      const res = await transactionsService.getPreviousMonthDetails("expense");

      if (res.status === 200) {
        dispatch({ type: "SET_PREVIOUS_MONTH_EXPENSE", payload: res.data });
      }

      setPreviousMonthExpenseSummery({
        totalAmount: res.data.transactionsSummery[0].totalAmount,
        totalTransaction: res.data.transactionsSummery[0].count,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllTransactions = async () => {
    try {
      let res = await transactionsService.getAllTransactions();

      if (res.status === 200) {
        dispatch({
          type: "SET_ALL_TRANSACTIONS",
          payload: res?.data,
        });
        dispatch({
          type: "SET_ALL_TRANSACTIONS_SUMMERY",
          payload: res?.data?.allTransactionsSummery,
        });
      }

      const totalTrans = res?.data?.allTransactionsDetails;
      let totelExpense = 0;
      let totalIncome = 0;

      for (let i = 0; i < totalTrans?.length; i++) {
        if (totalTrans[i].type === "expense") {
          totelExpense++;
        } else {
          totalIncome++;
        }
      }
      setAllTransactionsCount({
        totelExpense,
        totalIncome,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getPercentage = (currentMonth, previousMonth) => {
    if (currentMonth && previousMonth) {
      let differ = currentMonth - previousMonth;
      let percentage = (differ / previousMonth) * 100;

      if (percentage < 0) {
        return percentage.toFixed();
      } else {
        return `+${percentage.toFixed()}`;
      }
    }

    return null;
  };

  const getCurrentMonthIncomeDetails = async () => {
    try {
      const res = await transactionsService.getCurrentMonthDetails("income");

      if (res.status === 200) {
        dispatch({ type: "SET_CURRENT_MONTH_INCOME", payload: res.data });
      }
      setCurrentMonthIncomeSummery({
        totalAmount: res.data.transactionsSummery[0].totalAmount,
        totalTransaction: res.data.transactionsSummery[0].count,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const getPreviousMonthIncomeDetails = async () => {
    try {
      const res = await transactionsService.getPreviousMonthDetails("income");

      if (res.status === 200) {
        dispatch({ type: "SET_PREVIOUS_MONTH_INCOME", payload: res.data });
      }

      setPreviousMonthIncomeSummery({
        totalAmount: res.data.transactionsSummery[0].totalAmount,
        totalTransaction: res.data.transactionsSummery[0].count,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const totalAmountAndNo = (arr, type) => {
    let result = {
      totalAmount: 0,
      noOfTransactions: 0,
    };

    if (arr != undefined) {
      let filterArr = arr?.filter((eachTrans) => eachTrans.type === type);
      result.noOfTransactions = filterArr.length;
      result.totalAmount = filterArr.reduce((accumulator, currentValue) => {
        return (accumulator += currentValue?.amount);
      }, 0);
    }

    return result;
  };

  const getAllPendingCashRequests = async () => {
    try {
      let res = await cashRequestService.getAllPendingRequests();

      if (res.status === 200) {
        dispatch({
          type: "SET_PENDING_REQUESTS",
          payload: res.data.allPendingRequests,
        });

        dispatch({
          type: "SET_PENDING_REQUESTS_SUMMERY",
          payload: res?.data?.allPendingRequestsSummery[0],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderSpinner = () => {
    return (
      <div
        className="spinner-border spinner-border-sm"
        role="status"
        style={{ fontSize: "5px" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  };

  const getAccountsDetails = async () => {
    if (userParsed.id) {
      let res = await accountService.getAccountsDetails();

      if (res.status === 200 && res.data.message == "Account details fetched") {
        dispatch({
          type: "SET_ACC_DETAILS",
          payload: res.data.accounts,
        });
        setAccountSummery({ ...res.data.accountsSummery[0] });
      }

      if (res?.response?.data?.error === "Token is invalid") {
        toast.error("Session Expired Please Login");
        sessionStorage.clear();
        navigate("/login");
      }
    }
  };

  const apiCalls = async () => {
    await getCurrentMonthExpenseDetails();
    await getPreviousMonthExpenseDetails();
    await getCurrentMonthIncomeDetails();
    await getPreviousMonthIncomeDetails();
    await getAllTransactions();
    await getAllPendingCashRequests();
    await getAccountsDetails();
  };

  useEffect(() => {
    apiCalls();
  }, []);

  return (
    <>
      {!user ? (
        <>
          <Navigate to={"/login"} />
        </>
      ) : (
        <MainWrapper>
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col-sm-4">
                <div className="card">
                  <div className="card-body p-3 position-relative">
                    <div className="row">
                      <div className="col-7 text-start">
                        <p className="text-sm mb-1 text-capitalize font-weight-bold">
                          Expenses
                        </p>
                        <h5 className="font-weight-bolder mb-0">
                          &#8377;{" "}
                          {currentMonthExpenseSummery
                            ? currentMonthExpenseSummery?.totalAmount
                            : renderSpinner()}
                        </h5>
                        <span
                          className={
                            getPercentage(
                              currentMonthExpenseSummery?.totalAmount,
                              previousMonthExpenseSummery?.totalAmount
                            ) < 0
                              ? "text-sm text-end text-success font-weight-bolder mt-auto mb-0"
                              : "text-sm text-end text-danger font-weight-bolder mt-auto mb-0"
                          }
                        >
                          {getPercentage(
                            currentMonthExpenseSummery?.totalAmount,
                            previousMonthExpenseSummery?.totalAmount
                          )}
                          {"% "}
                          <span className="font-weight-normal text-white opacity-8">
                            since last month
                          </span>
                        </span>
                      </div>
                      <div className="col-5  d-flex justify-content-end">
                        <div className="dropdown text-center">
                          <span className="text-xs text-white opacity-8">
                            {monthNames[currentMonth]}
                          </span>
                          <div>
                            <lord-icon
                              src="https://cdn.lordicon.com/lxizbtuq.json"
                              trigger="loop"
                              delay="2000"
                              style={{ width: "50px", height: "50px" }}
                            ></lord-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 mt-sm-0 mt-4">
                <div className="card">
                  <div className="card-body p-3 position-relative">
                    <div className="row">
                      <div className="col-7 text-start">
                        <p className="text-sm mb-1 text-capitalize font-weight-bold">
                          Income
                        </p>
                        <h5 className="font-weight-bolder mb-0">
                          {" "}
                          &#8377;{" "}
                          {currentMonthIncomeSummery
                            ? currentMonthIncomeSummery?.totalAmount
                            : renderSpinner()}
                        </h5>
                        <span
                          className={
                            getPercentage(
                              currentMonthIncomeSummery?.totalAmount,
                              previousMonthIncomeSummery?.totalAmount
                            ) < 0
                              ? "text-sm text-end text-success font-weight-bolder mt-auto mb-0"
                              : "text-sm text-end text-danger font-weight-bolder mt-auto mb-0"
                          }
                        >
                          {getPercentage(
                            currentMonthIncomeSummery?.totalAmount,
                            previousMonthIncomeSummery?.totalAmount
                          )}
                          {"% "}
                          <span className="font-weight-normal text-white opacity-8">
                            since last month
                          </span>
                        </span>
                      </div>
                      <div className="col-5  d-flex justify-content-end">
                        <div className="dropdown text-center">
                          <span className="text-xs text-white opacity-8">
                            {monthNames[currentMonth]}
                          </span>
                          <div>
                            <lord-icon
                              src="https://cdn.lordicon.com/dypzookn.json"
                              trigger="loop"
                              delay="2000"
                              style={{ width: "50px", height: "50px" }}
                            ></lord-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 mt-sm-0 mt-4 h-100">
                <div className="card">
                  <div className="card-body p-3 position-relative">
                    <div className="row">
                      <div className="col-7 text-start">
                        <p className="text-sm mb-1 text-capitalize font-weight-bold">
                          No of Transactions
                        </p>
                        {transactionsState?.allTransactionsDetails?.length !=
                        0 ? (
                          <h5 className="font-weight-bolder mb-0">
                            {transactionsState.allTransactionsSummery
                              ? transactionsState?.allTransactionsSummery[0]
                                  ?.totalTransactions
                              : renderSpinner()}
                          </h5>
                        ) : (
                          renderSpinner()
                        )}
                        <span className="font-weight-normal text-sm text-white opacity-8 w-100">
                          <small>
                            Income : {allTransactionsCount?.totalIncome}
                          </small>
                          &nbsp;
                          <small>
                            Expense : {allTransactionsCount?.totelExpense}
                          </small>
                        </span>
                      </div>
                      <div className="col-5 d-flex justify-content-end">
                        <lord-icon
                          src="https://cdn.lordicon.com/ujxzdfjx.json"
                          trigger="loop"
                          delay="1500"
                          state="in-unfold"
                          style={{ width: "50px", height: "50px" }}
                        ></lord-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-sm-4">
                <div className="card Total-Expenses">
                  <div className="card-body p-3 position-relative">
                    <div className="row">
                      <div className="col-8 text-start">
                        <p className="text-sm mb-1 text-capitalize font-weight-bold">
                          Total Expenses
                        </p>
                        <h5 className="font-weight-bolder mb-0">
                          &#8377;{" "}
                          {transactionsState?.allTransactions
                            ?.allTransactionsDetails
                            ? totalAmountAndNo(
                                transactionsState?.allTransactions
                                  ?.allTransactionsDetails,
                                "expense"
                              ).totalAmount
                            : renderSpinner()}
                        </h5>
                        <span className="text-sm text-end text-success font-weight-bolder mt-auto mb-0">
                          <span className="font-weight-normal text-white opacity-8">
                            No of transactions :{" "}
                            {transactionsState?.allTransactions
                              ?.allTransactionsDetails
                              ? totalAmountAndNo(
                                  transactionsState?.allTransactions
                                    ?.allTransactionsDetails,
                                  "expense"
                                ).noOfTransactions
                              : renderSpinner()}
                          </span>
                        </span>
                      </div>
                      <div className="col-4  d-flex justify-content-end">
                        <lord-icon
                          src="https://cdn.lordicon.com/jtiihjyw.json"
                          trigger="loop"
                          delay="2000"
                          state="hover-spending"
                          style={{ width: "50px", height: "50px" }}
                        ></lord-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 mt-sm-0 mt-4">
                <div className="card Total-Income">
                  <div className="card-body p-3 position-relative">
                    <div className="row">
                      <div className="col-7 text-start">
                        <p className="text-sm mb-1 text-capitalize font-weight-bold">
                          Total Income
                        </p>
                        <h5 className="font-weight-bolder mb-0">
                          &#8377;{" "}
                          {transactionsState?.allTransactions
                            ?.allTransactionsDetails
                            ? totalAmountAndNo(
                                transactionsState?.allTransactions
                                  ?.allTransactionsDetails,
                                "income"
                              ).totalAmount
                            : renderSpinner()}
                        </h5>
                        <span className="text-sm text-end text-success font-weight-bolder mt-auto mb-0">
                          <span className="font-weight-normal text-white opacity-8">
                            No of transactions :{" "}
                            {transactionsState?.allTransactions
                              ?.allTransactionsDetails
                              ? totalAmountAndNo(
                                  transactionsState?.allTransactions
                                    ?.allTransactionsDetails,
                                  "income"
                                ).noOfTransactions
                              : renderSpinner()}
                          </span>
                        </span>
                      </div>
                      <div className="col-5  d-flex justify-content-end">
                        <lord-icon
                          src="https://cdn.lordicon.com/dypzookn.json"
                          trigger="loop"
                          delay="1000"
                          state="morph-destroyed"
                          style={{ width: "50px", height: "50px" }}
                        ></lord-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 mt-sm-0 mt-4">
                <div className="card">
                  <div className="card-body p-3 position-relative">
                    <div className="row">
                      <div className="col-7 text-start">
                        <p className="text-sm mb-1 text-capitalize font-weight-bold ">
                          Pending Cash Requests
                        </p>
                        <h5 className="font-weight-bolder mb-0">
                          &#8377;{" "}
                          {cashRequestState?.pendingRequestsSummery == undefined
                            ? 0
                            : cashRequestState?.pendingRequestsSummery
                                ?.totalAmount
                            ? cashRequestState?.pendingRequestsSummery
                                ?.totalAmount
                            : renderSpinner()}
                        </h5>
                        <span className="font-weight-normal text-sm text-white opacity-8">
                          <span className="font-weight-bolder text-success"></span>
                          No of requests :{" "}
                          {
                            cashRequestState?.pendingRequestsSummery
                              ?.totalPendingRequests
                          }
                        </span>
                      </div>
                      <div className="col-5 d-flex justify-content-end">
                        <button
                          onClick={() => navigate("/approveRequests")}
                          className="btn text-center flex-column p-0 m-0 border-0  justify-content-center align-items-center"
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/fmjvulyw.json"
                            trigger="loop"
                            delay="2000"
                            state="hover-look-around"
                            style={{ width: "30px", height: "30px" }}
                          ></lord-icon>
                          <p style={{ fontSize: "10px" }}>View Requests</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body p-3 position-relative">
                    <div className="row">
                      <div className="col-7 text-start">
                        <p className="text-sm mb-1 text-capitalize font-weight-bold">
                          No of Accounts
                        </p>
                        <h5 className="font-weight-bolder mb-0">
                          {accountSummery?.totalNoOfAccounts
                            ? accountSummery?.totalNoOfAccounts
                            : renderSpinner()}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 mt-sm-0 mt-4">
                <div className="card">
                  <div className="card-body p-3 position-relative">
                    <div className="row">
                      <div className="col-12 text-start">
                        <p className="text-sm mb-1 text-capitalize font-weight-bold ">
                          Total Accounts Balance
                        </p>
                        <h5 className="font-weight-bolder mb-0">
                          &#8377;{" "}
                          {accountSummery?.totalClossingBalance
                            ? accountSummery?.totalClossingBalance
                            : renderSpinner()}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-4 col-sm-6">
                <div className="card h-100">
                  <div className="card-header pb-0 p-3 mb-0">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-0">Accounts Closing Balance</h6>
                      <button
                        type="button"
                        className="btn btn-icon-only btn-rounded btn-outline-secondary mb-0 ms-2 btn-sm d-flex align-items-center justify-content-center"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="All accounts closing balance"
                        data-bs-original-title="All accounts closing balance"
                      >
                        <i className="material-icons text-sm">priority_high</i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body pb-0 p-0 m-0">
                    <div className="row">
                      <div className="col-12 text-start">
                        <ChartPie />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-sm-6 mt-sm-0 mt-4">
                <div className="card">
                  <div className="card-header pb-0 p-3">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-0">Transaction Details</h6>
                      <button
                        type="button"
                        className="btn btn-icon-only btn-rounded btn-outline-secondary mb-0 ms-2 btn-sm d-flex align-items-center justify-content-center"
                        data-bs-toggle="tooltip"
                        data-bs-placement="left"
                        title="Transaction details"
                        data-bs-original-title="Transaction details"
                      >
                        <i className="material-icons text-sm">priority_high</i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    <LineChart />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-12">
                <div className="card h-100">
                  <div className="card-body p-3">
                    <AllCashRequestsTable />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainWrapper>
      )}
    </>
  );
}

export default Dashboard;
