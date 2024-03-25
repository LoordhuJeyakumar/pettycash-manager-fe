import React, { useEffect, useRef, useState } from "react";
import MainWrapper from "../components/MainWrapper";
import { useDispatch, useSelector } from "react-redux";
import accountService from "../services/accountService";
import { toast } from "react-toastify";

function EditAccount() {
  const modalCloseBtnRef = useRef(null);
  const deleteBtnRef = useRef(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const { accountDetails, editAccountDetails } = useSelector(
    (state) => state.account
  );
  const dispatch = useDispatch();
  const userParsed = JSON.parse(sessionStorage.getItem("user"));
  const [account, setAccount] = useState({ acc_Name: "", companyName: "" });

  const getAccountsDetails = async () => {
    if (userParsed.id) {
      let res = await accountService.getAccountsDetails();
      if (res.status === 200 && res.data.message == "Account details fetched") {
        dispatch({
          type: "SET_ACC_DETAILS",
          payload: res.data.accounts,
        });
      }
    }
  };

  useEffect(() => {
    getAccountsDetails();
  }, []);

  const handleAccountSelect = async (event) => {
    let accountId = event.target.value;
    if (accountId) {
      const res = await accountService.getAccountById(accountId);
      if (res) {
        if (res.code === "ERR_NETWORK") {
          toast.error(res.message);
          return null;
        }
        if (res.status === 200 && res.data) {
          setAccount({
            acc_Name: res.data.accountById.acc_Name,
            companyName: res.data.accountById.companyName,
          });

          dispatch({
            type: "SET_EDIT_ACCOUNT",
            payload: res.data.accountById,
          });
        } else {
          setAccount({ acc_Name: "", companyName: "" });
          dispatch({ type: "UNSET_EDIT_ACCOUNT" });
        }
      }
    }
  };

  const handleEditAccountInput = (event) => {
    if (event.target.name === "acc_Name") {
      setAccount({ ...account, acc_Name: event.target.value });
    } else {
      setAccount({ ...account, companyName: event.target.value });
    }
  };
  const handleUpdateForm = async (event) => {
    event.preventDefault();
    try {
      const res = await accountService.editAccountById(
        editAccountDetails._id,
        account
      );
      if (res.status === 200 && res.data) {
        getAccountsDetails();
        toast.success(res.data.message);
        setAccount({ acc_Name: "", companyName: "" });
        dispatch({
          type: "UNSET_EDIT_ACCOUNT",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteButton = async (event) => {
    event.target.removeAttribute("data-bs-toggle");
    event.target.removeAttribute("data-bs-target");
    if (editAccountDetails.acc_Name) {
      event.target.setAttribute("data-bs-toggle", "modal");
      event.target.setAttribute("data-bs-target", "#handleDeleteModal");
      event.target.click();
    } else {
      event.target.setAttribute("data-bs-toggle", "");
      toast.info("Please select account");
    }
  };

  const handleDeleteAccount = async (event) => {
    setIsSubmit(true);
    event.preventDefault();

    if (editAccountDetails._id) {
      const res = await accountService.deleteAccountById(
        editAccountDetails._id
      );

      if (res?.status === 200 && res.data) {
        getAccountsDetails();
        setIsSubmit(false);
        toast.success(res.data.message);
        modalCloseBtnRef.current.click();
        setAccount({ acc_Name: "", companyName: "" });
        dispatch({
          type: "UNSET_EDIT_ACCOUNT",
        });
      }

      if (res?.response?.status === 401) {
        getAccountsDetails();
        setIsSubmit(false);
        toast.info(res.response.data.message);
        modalCloseBtnRef.current.click();
        setAccount({ acc_Name: "", companyName: "" });
        dispatch({
          type: "UNSET_EDIT_ACCOUNT",
        });
      }
    }
  };

  return (
    <div>
      <MainWrapper>
        <div className="container-fluid my-3 py-3">
          <div
            className="modal fade delete"
            id="handleDeleteModal"
            data-bs-backdrop="static"
            data-bs-keyboard="true"
            tabIndex="-1"
            aria-labelledby="handleDeleteModal"
            aria-hidden="true"
          >
            <div className="modal-dialog ">
              <div className="modal-content bg-dark">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="handleDeleteModal">
                    Delete Account
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ref={modalCloseBtnRef}
                    onClick={() => {
                      if (deleteBtnRef) {
                        deleteBtnRef.current.removeAttribute("data-bs-toggle");
                      }
                    }}
                  ></button>
                </div>
                <div className="modal-body ">
                  <h2 className="p-2">Are you sure ?</h2>
                  <h5>
                    Do you want to delete your {editAccountDetails.acc_Name}{" "}
                    account
                  </h5>
                  <p className="text-sm mb-0 p-2">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                </div>
                <div className="modal-footer p-3 d-flex justify-content-evenly">
                  <button
                    type="button"
                    className="btn btn-info bg-gradient-secondary"
                    data-bs-dismiss="modal"
                    ref={modalCloseBtnRef}
                    onClick={() => {
                      if (deleteBtnRef) {
                        deleteBtnRef.current.removeAttribute("data-bs-toggle");
                      }
                    }}
                  >
                    <lord-icon
                      src="https://cdn.lordicon.com/zhsxmjgz.json"
                      trigger="hover"
                      style={{ width: "50px", height: "50px" }}
                    ></lord-icon>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger bg-gradient-danger"
                    onClick={handleDeleteAccount}
                  >
                    <lord-icon
                      src="https://cdn.lordicon.com/hjbrplwk.json"
                      trigger="morph"
                      state="morph-trash-in"
                      style={{ width: "50px", height: "50px" }}
                    ></lord-icon>
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
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-lg-3">
              <div className="card position-sticky top-1">
                <ul className="nav flex-column bg-white border-radius-lg p-3 settingsNav">
                  <li className="nav-item pt-2">
                    <a
                      className="nav-link d-flex text-white"
                      data-scroll=""
                      href="#editAccount"
                    >
                      <i className="material-icons text-lg me-2">
                        receipt_long
                      </i>
                      <span className="text-sm">Edit Account</span>
                    </a>
                  </li>

                  <li className="nav-item pt-2">
                    <a
                      className="nav-link d-flex text-white"
                      data-scroll=""
                      href="#delete"
                    >
                      <i className="material-icons text-lg me-2">delete</i>
                      <span className="text-sm">Delete Account</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9 mt-lg-0 mt-4">
              <div className="card card-body" id="editAccount">
                <div className="row justify-content-center align-items-center">
                  <div className="col-sm-auto col-2">
                    <div className="avatar avatar-xl position-relative">
                      <lord-icon
                        src="https://cdn.lordicon.com/yqiuuheo.json"
                        trigger="in"
                        delay="1500"
                        state="in-reveal"
                        style={{ width: "100px", height: "100px" }}
                      ></lord-icon>
                    </div>
                  </div>
                  <div className=" col-6 my-auto">
                    <div className="h-100 selectAccount">
                      <h5 className="text-capitalize mb-1 font-weight-bolder">
                        Select Account
                      </h5>

                      <select
                        className="form-control form-select "
                        onChange={handleAccountSelect}
                      >
                        <option defaultValue={""}>None</option>

                        {accountDetails.map((eachAccount, i) => {
                          return (
                            <option value={eachAccount?._id} key={i}>
                              {eachAccount?.acc_Name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mt-4" id="basic-info">
                <div className="card-header">
                  <h5>Edit Account Info</h5>
                </div>
                <form onSubmit={handleUpdateForm}>
                  <div className="card-body pt-0">
                    <div className="row">
                      <div className="col-6">
                        <div className="input-group input-group-static">
                          <label>Account Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="acc_Name"
                            value={account?.acc_Name}
                            onChange={handleEditAccountInput}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group input-group-static">
                          <label>Company Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="companyName"
                            value={account?.companyName}
                            onChange={handleEditAccountInput}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <p className="text-sm mb-0">
                        Below Details are not allowed to edit.
                      </p>
                      <hr className="vertical-line" />
                    </div>
                    <div className="row mt-4">
                      <div className="col-6">
                        <div className="input-group input-group-static">
                          <label>Opening Balance</label>
                          <input
                            readOnly
                            type="text"
                            className="form-control"
                            name="opening_Balance"
                            disabled
                            value={editAccountDetails?.opening_Balance}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group input-group-static">
                          <label>Clossing Balance</label>
                          <input
                            readOnly
                            type="text"
                            className="form-control"
                            name="closing_balance"
                            disabled
                            value={editAccountDetails?.clossingBalance}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-6">
                        <div className="input-group input-group-static">
                          <label>Total Cash Requests</label>
                          <input
                            type="text"
                            className="form-control"
                            name="totalCashRequests"
                            disabled
                            readOnly
                            value={editAccountDetails?.cashRequests?.length}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group input-group-static">
                          <label>Total Transactions</label>
                          <input
                            type="text"
                            className="form-control"
                            name="totalTransactions"
                            disabled
                            readOnly
                            value={editAccountDetails?.transactions?.length}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-6">
                        <div className="input-group input-group-static">
                          <label>Created At</label>
                          <input
                            type="text"
                            className="form-control"
                            name="createdAt"
                            disabled
                            readOnly
                            value={new Date(
                              editAccountDetails?.createdAt
                            ).toUTCString()}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group input-group-static">
                          <label>Updated At</label>
                          <input
                            type="text"
                            className="form-control"
                            name="updatedAt"
                            disabled
                            readOnly
                            value={new Date(
                              editAccountDetails?.updatedAt
                            ).toUTCString()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer justify-content-end d-flex">
                    <button
                      className="btn btn-icon btn-3 btn-info d-flex"
                      type="submit"
                    >
                      Update Details{" "}
                      <span className="material-symbols-outlined text-center">
                        edit_note
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="card mt-4" id="delete">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-sm-0 mb-4">
                    <div className="w-50">
                      <h5>Delete Account</h5>
                      <p className="text-sm mb-0">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                    </div>
                    <div className="w-50 text-end">
                      <button
                        ref={deleteBtnRef}
                        className="btn bg-gradient-danger mb-0 ms-2"
                        type="button"
                        onClick={handleDeleteButton}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainWrapper>
    </div>
  );
}

export default EditAccount;
