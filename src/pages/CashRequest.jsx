import React, { useEffect, useRef, useState } from "react";

import MainWrapper from "../components/MainWrapper";
import accountService from "../services/accountService";
import { useDispatch, useSelector } from "react-redux";

import cashRequestService from "../services/cashRequestService";

import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AllCashRequestsTable from "../components/AllCashRequestsTable";
import instanceService from "../services/instanceService";
function CashRequest() {
  const inputFileRef = useRef(null);
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const cashRequest = useSelector((state) => state.cashRequest);
  const [documents, setDocuments] = useState("");
  const userParsed = JSON.parse(sessionStorage.getItem("user"));
  const [selecedAccount, setSelectedAccount] = useState(null);
  const [progressStatus, setProgressStatus] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const dispatch = useDispatch();

  const getAllAccounts = async () => {
    try {
      if (userParsed.id) {
        let res = await accountService.getAccountsDetails();
        if (
          res?.status === 200 &&
          res?.data?.message == "Account details fetched"
        ) {
          dispatch({
            type: "SET_ACC_DETAILS",
            payload: res.data.accounts,
          });
        }

        if (
          res?.response?.status === 401 &&
          res?.response?.data?.error === "Token is invalid"
        ) {
          sessionStorage.clear();
          toast.error("Session expired");
          navigate("/login");
          sessionStorage.clear();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getAllCashRequests = async () => {
    try {
      const res = await cashRequestService.getAllRequests();

      if (res.status === 200) {
        dispatch({
          type: "SET_ALL_REQUESTS",
          payload: res.data.allCashRequests,
        });

        if (res?.response?.status === 401) {
          toast.error("Session expired, Please login");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllAccounts();
    getAllCashRequests();
  }, []);

  const handleDropdown = (event, id, acc_Name, clossingBalance) => {
    setSelectedAccount({
      id,
      acc_Name,
      clossingBalance,
    });
  };
  const fd = new FormData();

  const resetAllFields = () => {
    setIsSubmit(false);
    dispatch({ type: "UNSET_NEWREQUEST" });
    setDocuments(null);
    if (inputFileRef) {
      inputFileRef.current.value = "";
    }
    setProgressStatus(null);
  };
  const handleInputChange = async (event) => {
    if (!selecedAccount) {
      toast.info("Please select account");
      return null;
    }

    let newObj = {
      ...cashRequest.newRequest,
    };
    if (event.target.name === "purpose") {
      newObj.purpose = event.target.value;
    }
    if (event.target.name === "amount") {
      newObj.amount = event.target.value;
    }
    if (event.target.name === "documents") {
      setDocuments(event.target.files);
    }

    newObj.accountId = selecedAccount.id;

    dispatch({
      type: "SET_NEWREQUEST",
      payload: newObj,
    });
  };

  const handleCreateRequest = async (event) => {
    setIsSubmit(true);
    event.preventDefault();

    if (documents) {
      for (let i = 0; i < documents.length; i++) {
        fd.append("documents", documents[i]);
      }
    }
    fd.append("amount", cashRequest.newRequest.amount);
    fd.append("purpose", cashRequest.newRequest.purpose);
    fd.append("documents", documents);
    fd.append("accountId", cashRequest.newRequest.accountId);

    try {
      const accessToken = sessionStorage.getItem("accessToken");

      const res = await axios.post(
        `${instanceService.baseURL}cashRequest/create`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          onUploadProgress: (progressEvent) => {
            let progress = progressEvent.progress * 100;

            setProgressStatus(Math.round(progress));
          },
        }
      );
      if (res.status === 201) {
        toast.success(res.data.message);

        dispatch({ type: "SET_IS_UPDATE" });
        await getAllAccounts();
        resetAllFields();
      }
    } catch (error) {
      if (error.response.status === 409) {
        toast.info(error.response.data.message);
        resetAllFields();
      }
      resetAllFields();
      console.error(error);
    }
  };

  return (
    <div>
      <MainWrapper>
        <div className="container-fluid py-4">
          <div className="row ">
            <div className="col-lg-3">
              <div className="card position-sticky top-1">
                <ul className="nav flex-column bg-white border-radius-lg p-3 settingsNav">
                  <li className="nav-item pt-2">
                    <a
                      className="nav-link d-flex text-white"
                      data-scroll=""
                      href="#selectAccount"
                    >
                      <i className="material-icons text-lg me-2">
                        receipt_long
                      </i>
                      <span className="text-sm">Select Account</span>
                    </a>
                  </li>

                  <li className="nav-item pt-2">
                    <a
                      className="nav-link d-flex text-white"
                      data-scroll=""
                      href="#createRequest"
                    >
                      <i className="material-icons text-lg me-2">create</i>
                      <span className="text-sm">Create Request</span>
                    </a>
                  </li>
                  <li className="nav-item pt-2">
                    <a
                      className="nav-link d-flex text-white"
                      data-scroll=""
                      href="#viewAllRequests"
                    >
                      <i className="material-icons text-lg me-2">visibility</i>
                      <span className="text-sm">All Requests</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-9 mt-lg-0 row ">
              <h3 className="text-center" id="selectAccount">
                Cash Request
              </h3>
              <div className="d-flex justify-content-center z-3">
                <div className="card cashRequest col-6 m-2 ">
                  <p className="p-3">
                    Plaese select account to replenish amount
                  </p>

                  <div className="dropdown mx-3">
                    <button
                      className="btn bg-gradient-primary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Select Account
                    </button>
                    <ul
                      className="dropdown-menu z-4"
                      aria-labelledby="dropdownMenuButton"
                    >
                      {account.accountDetails.map((eachAcc, i) => {
                        return (
                          <li key={i}>
                            <button
                              className="dropdown-item  "
                              onClick={(event) =>
                                handleDropdown(
                                  event,
                                  eachAcc._id,
                                  eachAcc.acc_Name,
                                  eachAcc.clossingBalance
                                )
                              }
                            >
                              {eachAcc.acc_Name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <h6 className="p-3">
                    Selected Account : {selecedAccount?.acc_Name}
                  </h6>
                </div>
                <div className=" card col-6 m-2 align-items-center">
                  <div className="card-header">
                    <div className="card-body">
                      <h4>Current Balance</h4>
                      <h1>{selecedAccount?.clossingBalance}</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 m-1 p-0 " id="createRequest">
                <form
                  encType="multipart/form-data"
                  onSubmit={handleCreateRequest}
                >
                  <div className="card ">
                    <div className="card-body">
                      <div className="input-group input-group-static mb-4">
                        <label htmlFor="amount">
                          Amount{" "}
                          <span
                            style={{ fontSize: 12, color: "red" }}
                            className="material-symbols-rounded"
                          >
                            star_rate
                          </span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="amount"
                          id="amount"
                          required
                          onChange={handleInputChange}
                          value={cashRequest.newRequest.amount}
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">
                          Please enter amount you need.
                        </div>
                      </div>
                      <div className="input-group input-group-static mb-4">
                        <label htmlFor="reason">
                          Reaseon{" "}
                          <span
                            style={{ fontSize: 12, color: "red" }}
                            className="material-symbols-rounded"
                          >
                            star_rate
                          </span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="purpose"
                          required
                          id="reason"
                          onChange={handleInputChange}
                          value={cashRequest?.newRequest?.purpose}
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">
                          Please enter amount you need.
                        </div>
                      </div>
                      <div className="input-group input-group-static mb-4">
                        <label htmlFor="documents">Documents</label>
                        <input
                          ref={inputFileRef}
                          type="file"
                          className="form-control"
                          name="documents"
                          id="documents"
                          accept="image/*,.pdf,.doc"
                          multiple
                          onChange={handleInputChange}
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">
                          Please enter amount you need.
                        </div>

                        <p>
                          If you have supported documents for the request you
                          can add here
                        </p>
                      </div>

                      {progressStatus && (
                        <div className="progress-wrapper">
                          <div className="progress-info">
                            <div className="progress-percentage">
                              <span className="text-sm font-weight-normal">
                                {progressStatus + "% files are uploded"}
                              </span>
                            </div>
                          </div>
                          <div className="progress">
                            <div
                              className="progress-bar bg-gradient-success"
                              role="progressbar"
                              aria-valuenow={progressStatus}
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{
                                width: `${progressStatus}%`,
                                height: "100%",
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="card-footer d-flex m-0 pt-0 justify-content-end">
                      <button className="btn bg-gradient-success btn-lg">
                        {isSubmit ? "Uploding..." : "Request"}
                        <div
                          className={
                            isSubmit ? "spinner-border spinner-border-sm " : ""
                          }
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <AllCashRequestsTable />
        </div>
      </MainWrapper>
    </div>
  );
}

export default CashRequest;
