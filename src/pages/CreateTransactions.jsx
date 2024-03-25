import React, { useEffect, useRef, useState } from "react";
import MainWrapper from "../components/MainWrapper";
import accountService from "../services/accountService";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import instanceService from "../services/instanceService";

function CreateTransactions() {
  const { accountDetails } = useSelector((state) => state.account);
  const transactions = useSelector((state) => state.transactions);

  const transactionFormRef = useRef(null);
  const typeSelectRef = useRef(null);
  const reciptsFilesRef = useRef(null);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [reciptsFiles, setReciptsFiles] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [uploadProgressStatus, setUploadProgressStatus] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userParsed = JSON.parse(sessionStorage.getItem("user"));

  const [rowData, setRowData] = useState("");
  const [colDefs, setColDefs] = useState([
    { field: "entry_Name", headerName: "Entry Name" },
    { field: "entry_Amount", headerName: "Entry Amount" },
    { field: "category" },
  ]);

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
  const handleSelectAccount = (event) => {
    const selectedAccountId = event.target.value;
    if (accountDetails.length) {
      const selectedAccount = accountDetails.find(
        (eachAcc) => eachAcc._id === selectedAccountId
      );
      setSelectedAccount(selectedAccount);

      dispatch({
        type: "SET_NEW_TRANSACTION",
        payload: { pettyCashAccountId: selectedAccountId },
      });
    }
  };
  useEffect(() => {
    if (accountDetails.length == 0) {
      getAllAccounts();
    }
  }, []);

  const handleTransactionMainInput = (event) => {
    if (event.target.name === "receipts") {
      setReciptsFiles(event.target.files);
      dispatch({
        type: "SET_RECEIPTS",
        payload: { name: event.target.name, value: event.target.files },
      });
    } else {
      dispatch({
        type: "SET_NEW_TRANSACTION",
        payload: { name: event.target.name, value: event.target.value },
      });
    }
  };

  const handleEntryInput = (event) => {
    dispatch({
      type: "SET_ENTRIES",
      payload: { name: event.target.name, value: event.target.value },
    });
  };

  const handleAddEntries = () => {
    let entry = transactions.entries;
    if (entry.entry_Name && entry.entry_Amount && entry.category) {
      let foundedEntry = transactions.newTransaction.entries.find(
        (eachEntry) => {
          if (
            eachEntry.entry_Name === entry.entry_Name &&
            eachEntry.entry_Amount === entry.entry_Amount &&
            eachEntry.category === entry.category
          ) {
            return eachEntry;
          }

          return null;
        }
      );

      if (!foundedEntry) {
        transactions.newTransaction.entries.push(entry);
        dispatch({ type: "UNSET_ENTRIES" });
        if (transactions.newTransaction.entries.length) {
          gridApi.updateGridOptions({
            rowData: transactions.newTransaction.entries,
          }); // Refresh grid
        }
      } else {
        toast.info("This entry already exists");
      }
    }
  };
  const formData = new FormData();
  const handleTransactionFormSubmit = async (event) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      let reciptsArray = transactions.newTransaction.receipts;

      if (reciptsArray.length) {
        for (let i = 0; i < reciptsArray.length; i++) {
          formData.append(`receipts`, reciptsArray[i]);
        }
      }

      let formTextData = transactions.newTransaction;

      if (formTextData.entries.length) {
        for (let i = 0; i < formTextData.entries.length; i++) {
          let entry = formTextData.entries[i];
          for (let key in entry) {
            formData.append(`entries[${i}][${key}]`, entry[key]);
          }
        }
      }

      formData.append("pettyCashAccountId", formTextData.pettyCashAccountId);
      formData.append("description", formTextData.description);
      formData.append("department", formTextData.department);
      formData.append("type", formTextData.type);

      event.preventDefault();
      setIsSubmit(true);

      if (!transactionFormRef.current.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        setIsSubmit(false);
      }

      transactionFormRef.current.classList.add("was-validated");

      if (transactionFormRef.current.checkValidity()) {
        const res = await axios.post(
          `${instanceService.baseURL}transaction/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
            onUploadProgress: (progressEvent) => {
              let progress = progressEvent.progress * 100;

              setUploadProgressStatus(Math.round(progress));
            },
          }
        );

        if (
          res.status === 201 &&
          res.data.message === "Transaction created succesfully"
        ) {
          toast.success(res.data.message);
          setIsSubmit(false);
          dispatch({ type: "RESET_ALL" });
          setSelectedAccount(null);
          setReciptsFiles([]);
          setUploadProgressStatus(null);
          gridApi.updateGridOptions({
            rowData: [],
          });
          if (reciptsFilesRef) {
            reciptsFilesRef.current.value = "";
          }
        }
      }
    } catch (error) {
      setIsSubmit(false);
      console.error(error);
    }
  };
  return (
    <MainWrapper>
      <form
        onSubmit={handleTransactionFormSubmit}
        noValidate
        ref={transactionFormRef}
      >
        <div className="container-fluid py-4">
          <div className="row selectAccount">
            <h2 className="text-center">Create Transactions</h2>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="form-floating">
                    <select
                      required
                      disabled={
                        transactions.newTransaction.entries.length
                          ? true
                          : false
                      }
                      onChange={handleSelectAccount}
                      id="accountSelect"
                      className="form-select bg-dark text-white accountSelectInput"
                      aria-label="Account select"
                      value={transactions.newTransaction.pettyCashAccountId}
                    >
                      <option defaultValue>Select Account</option>
                      {accountDetails.map((eachAcc, i) => {
                        return (
                          <option value={eachAcc._id} key={i}>
                            {eachAcc.acc_Name}
                          </option>
                        );
                      })}
                    </select>

                    <label htmlFor="accountSelect">Select Account</label>
                  </div>
                  <div className="form-text text-secondary" id="basic-addon4">
                    Select account name for create transactions
                    <span
                      style={{ fontSize: 12, color: "red" }}
                      className="material-symbols-rounded"
                    >
                      star_rate
                    </span>
                  </div>
                  <div>
                    <span className="pt-3 opacity-75">Selected Account : </span>
                    <span className="opacity-100">
                      {selectedAccount ? selectedAccount?.acc_Name : "none"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="card h-100">
                <div className="card-header">
                  <h3 className="text-center pb-0 mb-0">Closing Balance</h3>
                </div>
                <div className="card-body pt-0">
                  <h1 className="text-center text-warning fw-bold">
                    {selectedAccount ? (
                      selectedAccount?.clossingBalance
                    ) : (
                      <p>Please select account</p>
                    )}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card p-3 mt-1">
                <div className="card-heading">
                  <h4 className="text-center">Transaction</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-group input-group-static mb-4">
                        <label>Description</label>{" "}
                        <span
                          style={{ fontSize: 12, color: "red" }}
                          className="material-symbols-rounded"
                        >
                          star_rate
                        </span>
                        <input
                          value={transactions.newTransaction.description}
                          disabled={selectedAccount ? false : true}
                          type="text"
                          className="form-control"
                          name="description"
                          required
                          onChange={handleTransactionMainInput}
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">
                          Please enter description for this transaction.
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group input-group-static mb-4">
                        <label>Department</label>{" "}
                        <span
                          style={{ fontSize: 12, color: "red" }}
                          className="material-symbols-rounded"
                        >
                          star_rate
                        </span>
                        <input
                          value={transactions.newTransaction.department}
                          disabled={selectedAccount ? false : true}
                          type="text"
                          className="form-control"
                          name="department"
                          required
                          onChange={handleTransactionMainInput}
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">
                          Please enter department for this transaction.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-group input-group-static mb-4">
                        <label>Transaction Type</label>{" "}
                        <span
                          style={{ fontSize: 12, color: "red" }}
                          className="material-symbols-rounded"
                        >
                          star_rate
                        </span>
                        <select
                          ref={typeSelectRef}
                          value={transactions.newTransaction.type}
                          disabled={selectedAccount ? false : true}
                          name="type"
                          required
                          className="form-control form-select"
                          onChange={handleTransactionMainInput}
                        >
                          <option className="bg-dark" value="">
                            Select one
                          </option>
                          <option className="bg-dark" value="income">
                            Income
                          </option>
                          <option className="bg-dark" value="expense">
                            Expense
                          </option>
                        </select>
                        <div className="invalid-feedback">
                          Please select transaction type.
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group input-group-static mb-4">
                        <label>Receipts</label>{" "}
                        <input
                          disabled={selectedAccount ? false : true}
                          type="file"
                          className="form-control"
                          name="receipts"
                          onChange={handleTransactionMainInput}
                          accept="image/*,.pdf,.doc"
                          multiple
                          ref={reciptsFilesRef}
                        />
                        <div
                          className="form-text text-secondary"
                          id="basic-addon4"
                        >
                          Add receipts if you have for this transactions
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card p-3 mt-1">
                <div className="card-header mt-0 pt-0">
                  <h4 className="text-center">Entries</h4>
                </div>
                <div className="card-body mt-0 pt-0">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-group input-group-static mb-4">
                        <label>Entry Name</label>{" "}
                        <span
                          style={{ fontSize: 12, color: "red" }}
                          className="material-symbols-rounded"
                        >
                          star_rate
                        </span>
                        <input
                          disabled={
                            transactions.newTransaction.pettyCashAccountId
                              ? false
                              : true
                          }
                          onChange={handleEntryInput}
                          type="text"
                          className="form-control"
                          name="entry_Name"
                          required={
                            transactions.newTransaction.entries.length
                              ? false
                              : true
                          }
                          value={transactions?.entries?.entry_Name}
                          placeholder="Please enter product or service name"
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">
                          Please enter product or service name for this
                          transaction.
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group input-group-static mb-4">
                        <label>Category</label>{" "}
                        <span
                          style={{ fontSize: 12, color: "red" }}
                          className="material-symbols-rounded"
                        >
                          star_rate
                        </span>
                        <input
                          disabled={
                            transactions.newTransaction.pettyCashAccountId
                              ? false
                              : true
                          }
                          onChange={handleEntryInput}
                          type="text"
                          className="form-control"
                          name="category"
                          required={
                            transactions.newTransaction.entries.length
                              ? false
                              : true
                          }
                          placeholder="Please enter category name"
                          value={transactions?.entries?.category}
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">
                          Please enter category name for this entry.
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group input-group-static mb-4">
                        <label>Amount</label>{" "}
                        <span
                          style={{ fontSize: 12, color: "red" }}
                          className="material-symbols-rounded"
                        >
                          star_rate
                        </span>
                        <input
                          disabled={
                            transactions.newTransaction.pettyCashAccountId
                              ? false
                              : true
                          }
                          onChange={handleEntryInput}
                          type="number"
                          className="form-control"
                          name="entry_Amount"
                          required={
                            transactions.newTransaction.entries.length
                              ? false
                              : true
                          }
                          value={transactions?.entries?.entry_Amount}
                          placeholder="Please enter amount for this entry"
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">
                          Please enter amount for this entry
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 justify-content-center d-flex">
                      <button
                        onClick={handleAddEntries}
                        disabled={
                          transactions.entries.entry_Name &&
                          transactions.entries.entry_Amount &&
                          transactions.entries.category
                            ? false
                            : true
                        }
                        className="btn btn-warning btn-lg w-50 p-2 m-2 entryAddBtn"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 ">
              <div className="card p-3 mt-1">
                <div className="card-header p-0 m-0">
                  <h4 className="text-center">Details</h4>
                </div>
                <div className="card-body row">
                  <div className="d-flex justify-content-between col-md-12 col-12">
                    <div>
                      <p className="d-inline-flex">Account : </p>
                      <h5 className="d-inline-flex">
                        &nbsp;{selectedAccount?.acc_Name}
                      </h5>
                    </div>
                    <div>
                      <p className="d-inline-flex">Cloasing Balance : </p>
                      <h5 className="d-inline-flex">
                        &nbsp;{selectedAccount?.clossingBalance}
                      </h5>
                    </div>
                  </div>
                  <div className="d-flex justify-content-evenly row">
                    <div className="col-12 col-md-4">
                      <p className="d-inline-flex">Description : </p>
                      <span>
                        &nbsp;{transactions?.newTransaction?.description}
                      </span>
                    </div>
                    <div className="col-6 col-md-2">
                      <p className="d-inline-flex">Department : </p>
                      <h6 className="d-inline-flex">
                        &nbsp;{transactions?.newTransaction?.department}
                      </h6>
                    </div>
                    <div className="col-6 col-md-2">
                      <p className="d-inline-flex">Type : </p>
                      <h6 className="d-inline-flex">
                        &nbsp;{transactions?.newTransaction?.type}
                      </h6>
                    </div>
                    <div className="col-6 col-md-2">
                      <p className="d-inline-flex">Total receipts : </p>
                      <h6 className="d-inline-flex">
                        &nbsp;{reciptsFiles?.length}
                      </h6>
                    </div>
                    <div className="col-6 col-md-2">
                      <p className="d-inline-flex">Total entries : </p>
                      <h6 className="d-inline-flex">
                        &nbsp;
                        {transactions?.newTransaction?.entries?.length}
                      </h6>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-9">
                      <div
                        className="ag-theme-quartz-dark"
                        style={{ height: 300 }}
                      >
                        <AgGridReact
                          rowData={rowData}
                          columnDefs={colDefs}
                          pagination={true}
                          animateRows={true}
                          onGridReady={(params) => setGridApi(params.api)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 d-flex flex-column justify-content-center align-items-center">
                      <div className="d-flex flex-column align-items-center">
                        <h3>Total Amount</h3>
                        <h1 className="display-1 text-warning fw-bold">
                          {transactions.newTransaction.entries.length
                            ? transactions?.newTransaction?.entries.reduce(
                                (accumulator, currentValue) =>
                                  +accumulator + +currentValue.entry_Amount,
                                0
                              )
                            : 0}
                        </h1>
                      </div>
                      {uploadProgressStatus == 100 ? (
                        <small
                          className="alert w-50  text-center alert-success p-1 text-white fw-medium m-0 border-0"
                          role="alert"
                        >
                          Upload Success!
                        </small>
                      ) : uploadProgressStatus ? (
                        <div
                          className="progress "
                          role="progressbar"
                          aria-label="Upload Progress"
                          aria-valuenow={uploadProgressStatus}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            className="progress-bar h-100 "
                            style={{ width: `${uploadProgressStatus}%` }}
                          >
                            {`${uploadProgressStatus}%`}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="d-flex flex-column align-items-center">
                        <button
                          disabled={
                            transactions.newTransaction.entries.length
                              ? false
                              : true
                          }
                          type="submit"
                          className="btn btn-lg btn-success w-100 p-3 m-2 createTransactionBtn d-flex flex-column align-items-center"
                        >
                          Create Transaction{" "}
                          {isSubmit ? (
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          ) : (
                            ""
                          )}
                        </button>
                        <button
                          onClick={() => {
                            dispatch({ type: "RESET_ALL" });
                            setSelectedAccount(null);
                            gridApi.updateGridOptions({
                              rowData: [],
                            });
                          }}
                          className="btn btn-outline-info btn-lg w-50 p-2 m-2 w-100"
                          type="button"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </MainWrapper>
  );
}

export default CreateTransactions;
