import React, { useEffect, useRef, useState } from "react";
import MainWrapper from "../components/MainWrapper";
import { useDispatch, useSelector } from "react-redux";
import cashRequestService from "../services/cashRequestService";
import accountService from "../services/accountService";
import authService from "../services/auth";
import { toast } from "react-toastify";
import AllCashRequestsTable from "../components/AllCashRequestsTable";
import DownloadButton from "../components/DownloadButton";
import ApproveButton from "../components/ApproveButton";

function ApproveRequests() {
  const { pendingRequests } = useSelector((state) => state.cashRequest);

  const modalCloseBtnRef = useRef(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const [isFetchStart, setIsFetchStart] = useState(false);
  const [request, setRequest] = useState(null);
  const [rejectObj, setRejectObj] = useState({
    rejectionReason: request ? request?._id : "",
    cashRequestId: request?._id,
  });
  const dispatch = useDispatch();

  const getAllCashRequests = async () => {
    const res = await cashRequestService.getAllRequests();

    if (res.status === 200 && res.data) {
      dispatch({
        type: "SET_ALL_REQUESTS",
        payload: res.data.allCashRequests,
      });
    }
  };

  useEffect(() => {
    dispatch({ type: "SET_IS_UPDATE" });
    getAllPendingRequests();
    getAllCashRequests();
  }, []);

  const getAccountName = async (id) => {
    const res = await accountService.getAccountById(id);

    return res?.data?.accountById.acc_Name;
  };
  const getUserName = async (id) => {
    const res = await authService.getUserDetails(id);

    return res?.user.name;
  };

  const getAllPendingRequests = async () => {
    setIsFetchStart(true);
    try {
      setIsFetchStart(true);
      const res = await cashRequestService.getAllPendingRequests();

      if (res.status === 200) {
        let newArr = await Promise.all(
          res.data.allPendingRequests.map(async (eachReq) => {
            eachReq.accountName = await getAccountName(eachReq.accountId);
            eachReq.userName = await getUserName(eachReq.requestedBy);
            return eachReq;
          })
        );
        dispatch({
          type: "SET_PENDING_REQUESTS",
          payload: [...newArr],
        });
        dispatch({
          type: "SET_PENDING_REQUESTS_SUMMERY",
          payload: res.data.allPendingRequestsSummery[0],
        });
        setIsFetchStart(false);
      }
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetch = async () => {
    let res = await getAllPendingRequests();

    if (res.status === 200) {
      if (res.data.allPendingRequests.length == 0) {
        toast.info("There is no pending request");
      } else {
        toast.success("Pending details fetched");
      }
    } else {
      toast.info("There is no pending request");
    }
  };

  const handleRejectModalOpen = async (event) => {
    let singleRequest = await pendingRequests.find((eachReq) => {
      if (eachReq._id === event.target.value) {
        return eachReq;
      }
    });

    setRequest(singleRequest);
    setRejectObj({ ...rejectObj, cashRequestId: singleRequest._id });
  };
  const handleRejectRequest = async (event) => {
    setIsSubmit(true);
    event.preventDefault();
    try {
      let res = await cashRequestService.rejectRequest(rejectObj);

      if (res.status === 200) {
        toast.info(res.data.message);
        setIsSubmit(false);
        dispatch({ type: "SET_IS_UPDATE" });
      }
      if (modalCloseBtnRef) {
        modalCloseBtnRef.current.click();
      }
      getAllPendingRequests();
    } catch (error) {
      setIsSubmit(false);
      if (error?.response?.data?.status === 409) {
        toast.error(error?.response?.data?.message);
        if (modalCloseBtnRef) {
          modalCloseBtnRef.current.click();
        }
      } else if (error?.response?.data?.status === 404) {
        toast.error(error?.response?.data?.message);
        if (modalCloseBtnRef) {
          modalCloseBtnRef.current.click();
        }
      } else {
        console.error(error);
      }
      if (modalCloseBtnRef) {
        modalCloseBtnRef.current.click();
      }
      console.error(error);
    }
  };

  return (
    <MainWrapper>
      <div className="container-fluid py-4">
        <div
          className="modal fade"
          id="rejectModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Reject Request
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleRejectRequest}>
                <div className="modal-body">
                  <div className="input-group input-group-static mb-4 flex-column">
                    <p className="p-0 m-0">
                      Are you sure do you want reject this request?
                    </p>
                    <ul className="list-group p-2 pt-0 m-0">
                      <li className="list-group-item border border border-0 text-white">
                        Amount : <span>{request?.amount}</span>
                      </li>
                      <li className="list-group-item text-white border-0">
                        Account Name : <span>{request?.accountName}</span>
                      </li>
                      <li className="list-group-item text-white border-0">
                        Requested By : <span>{request?.userName}</span>
                      </li>
                      <li className="list-group-item text-white border-0">
                        Requested Date :{" "}
                        <span>
                          {new Date(request?.dateRequested).toDateString()}
                        </span>
                      </li>
                      <li className="list-group-item text-white border-0 ">
                        Purpose : <span>{request?.purpose}</span>
                      </li>
                    </ul>
                    <p> If yes please enter reason below</p>
                    <div>
                      <label>Reject Reason</label>
                      <input
                        onChange={(event) => {
                          setRejectObj({
                            ...rejectObj,
                            rejectionReason: event.target.value,
                          });
                        }}
                        value={rejectObj ? rejectObj?.rejectionReason : ""}
                        type="text"
                        className="form-control"
                        name="rejectionReason"
                        required
                        placeholder="please enter reject reason here"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-evenly">
                  <button
                    type="button"
                    className="btn btn-secondary px-3 p-1"
                    data-bs-dismiss="modal"
                    ref={modalCloseBtnRef}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger px-3 p-1">
                    Reject{" "}
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
              </form>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="d-flex align-items-center justify-content-center flex-colum">
            <div>
              <h3 className="text-center fw-bold">Pending Requests</h3>
              <p>
                <button className="btn btn-primary" onClick={handleFetch}>
                  Fetch Details
                </button>
              </p>
            </div>
            <lord-icon
              src="https://cdn.lordicon.com/atidmavy.json"
              trigger="in"
              colors="primary:#e88c30,secondary:#08a88a,tertiary:#FFC107,quaternary:#ebe6ef"
              style={{ width: "150px", height: "150px" }}
            ></lord-icon>
          </div>
          <div className="row">
            <div className="col-12 m-0 row">
              {pendingRequests?.length != 0 ? (
                pendingRequests.map((eachReq, i) => {
                  return (
                    <div
                      className="card col-lg-4 col-12 col-sm-6 m- text-white my-1"
                      key={i}
                    >
                      <div className="card-header d-flex justify-content-between m-0 pb-0">
                        <div>
                          <span className="text-sm mb-1 text-capitalize fw-bold opacity-8">
                            Account Name :{" "}
                          </span>
                          <span className="h6 ">{eachReq?.accountName}</span>
                        </div>

                        <span className="material-symbols-rounded">
                          account_balance_wallet
                        </span>
                      </div>
                      <hr />
                      <div className="card-body p-0 m-0">
                        <div className=" p-0 m-0">
                          <div className="p-1 text-center">
                            <span className="text-sm mb-1 text-capitalize fw-bold opacity-8">
                              Amount
                            </span>
                            <h1 className="fw-bold text-warning">
                              {eachReq?.amount}
                            </h1>
                          </div>

                          <div className="d-flex flex-column align-items-evenly justify-content-evenly p-0 m-0">
                            <div className="p-1">
                              <span className="text-sm mb-1 text-capitalize fw-bold opacity-8">
                                Purpose :{" "}
                              </span>
                              <span>{eachReq.purpose}</span>
                            </div>
                            <div className="p-1">
                              <span className="text-sm mb-1 text-capitalize fw-bold opacity-8">
                                Requested By :{" "}
                              </span>
                              <span>{eachReq?.userName}</span>
                            </div>
                            <div className="p-1">
                              <span className="text-sm mb-1 text-capitalize fw-bold opacity-8">
                                Requested Date :{" "}
                              </span>
                              <span>
                                {new Date(
                                  eachReq?.dateRequested
                                ).toDateString()}
                              </span>
                            </div>

                            <div className="p-1">
                              <span className="text-sm mb-1 text-capitalize fw-bold opacity-8">
                                Status :{" "}
                              </span>
                              <span>{eachReq?.status}</span>
                            </div>
                            <div className="p-1">
                              <span className="text-sm mb-1 text-capitalize fw-bold opacity-8">
                                Documents :{" "}
                              </span>
                              <span>{eachReq?.documentsCount}</span>
                              {eachReq.documentsCount > 0 ? (
                                <DownloadButton id={eachReq._id} />
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="m-0 p-0 card-footer d-flex ">
                        <button
                          className="btn btn-danger w-100 m-2"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#rejectModal"
                          onClick={handleRejectModalOpen}
                          value={eachReq._id}
                        >
                          Reject
                        </button>
                        {/*  <button
                          onClick={handleApproveCashRequest}
                          value={eachReq._id}
                          className={
                            isApproveStart
                              ? "btn btn-success w-100  text-center m-2 d-flex align-items-center"
                              : "btn btn-success w-100  text-center m-2"
                          }
                        >
                          Approve{"  "}
                          <div
                            className={
                              isApproveStart ? "spinner-border ms-1" : "d-none"
                            }
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </button> */}
                        <ApproveButton
                          getAllPendingRequests={getAllPendingRequests}
                          id={eachReq._id}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="d-flex justify-content-center">
                  <div className="card text-center w-50 d-flex justify-content-center">
                    <div className="card-header">
                      <h2 className="p-2">There is no pending requests</h2>
                      <p>Please wait while we fetch the details, </p>
                      {isFetchStart ? (
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        ""
                      )}
                      <p>If stiil face the issue click here</p>
                      <button className="btn btn-primary" onClick={handleFetch}>
                        Fetch Details
                      </button>
                    </div>
                    <div className="card-body">
                      <lord-icon
                        src="https://cdn.lordicon.com/lwumwgrp.json"
                        trigger="in"
                        delay="1500"
                        state="in-oscillate"
                        style={{ width: "250px", height: "250px" }}
                      ></lord-icon>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/*  <div className="row" id="viewAllRequests">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">All Cash Request</h3>
            </div>
            <div className="card-body">
              <div
                className="ag-theme-quartz-dark" // applying the grid theme
                style={{ height: 500 }}
              >
                <AgGridReact
                  rowData={rowData}
                  columnDefs={colDefs}
                  pagination={true}
                />
              </div>
            </div>
            <div className="card-footer"></div>
          </div>
        </div> */}
        <AllCashRequestsTable />
      </div>
    </MainWrapper>
  );
}

export default ApproveRequests;
