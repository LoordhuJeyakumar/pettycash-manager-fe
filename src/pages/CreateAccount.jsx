import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component

import MainWrapper from "../components/MainWrapper";
import { useDispatch, useSelector } from "react-redux";
import accountService from "../services/accountService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreateAccount() {
  const createAccountForm = useRef(null);
  const navigate = useNavigate();
  const { accountDetails, createAccount } = useSelector(
    (state) => state.account
  );
  const dispatch = useDispatch();
  const userParsed = JSON.parse(sessionStorage.getItem("user"));

  const getAccountsDetails = async () => {
    if (userParsed.id) {
      let res = await accountService.getAccountsDetails();

      if (res.status === 200 && res.data.message == "Account details fetched") {
        dispatch({
          type: "SET_ACC_DETAILS",
          payload: res.data.accounts,
        });
      }

      if (res?.response?.data?.error === "Token is invalid") {
        toast.error("Session Expired Please Login");
        sessionStorage.clear();
        navigate("/login");
      }
      setRowData(res.data.accounts);
    }
  };

  useEffect(() => {
    getAccountsDetails();
  }, [createAccount]);
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState(accountDetails);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "acc_Name" },
    { field: "companyName" },
    { field: "opening_Balance" },
    { field: "clossingBalance" },
    { field: "totalCashRequests" },
    { field: "totalTransactions" },
    { field: "createdAt" },
    { field: "updatedAt" },
  ]);
  const handleAccountInputChange = (event) => {
    let newAccountObj = {
      ...createAccount,
      createdBy: userParsed.id,
    };
    if (event.target.name === "acc_Name") {
      newAccountObj.acc_Name = event.target.value;
    } else if (event.target.name === "opening_Balance") {
      newAccountObj.opening_Balance = Number.parseInt(event.target.value);
    } else if (event.target.name === "companyName") {
      newAccountObj.companyName = event.target.value;
    }

    dispatch({
      type: "SET_CREATE_ACCOUNT",
      payload: newAccountObj,
    });
  };
  const handleCreateAccount = async (event) => {
    event.preventDefault();
    // Prevent form submission if there are any invalid fields
    if (!createAccountForm.current.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Add 'was-validated' className to the form to show validation feedback
    createAccountForm.current.classList.add("was-validated");

    // If the form is valid, proceed with user details submission
    if (createAccountForm.current.checkValidity()) {
      const res = await accountService.createAccount(createAccount);

      if (res.status === 201) {
        getAccountsDetails();
        toast.success(res.data.message);
        dispatch({ type: "UNSET_CREATE_ACCOUNT" });
      } else if (res.response.status === 409) {
        toast.info(res.response.data.message);
        dispatch({ type: "UNSET_CREATE_ACCOUNT" });
      }
    }
  };

  return (
    <div>
      <MainWrapper>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="d-flex align-items-center flex-column">
              <h3 className="text-center">Create Pettycash Account</h3>
              <form
                onSubmit={handleCreateAccount}
                action=""
                className="form card w-75 p-3 my-2 align-items-center needs-validation "
                noValidate
                ref={createAccountForm}
              >
                <div className="input-group-custom input-group-custom-dynamic mb-4 w-75 align-items-end">
                  <span className="input-group-text createAccountLable">
                    Account Name
                  </span>
                  <input
                    required
                    type="text"
                    className="form-control-custom"
                    placeholder="Account Name"
                    aria-label="account name"
                    name="acc_Name"
                    onChange={handleAccountInputChange}
                    value={createAccount.acc_Name}
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please choose a account name.
                  </div>
                </div>

                <div className="input-group-custom input-group-custom-dynamic mb-4 w-75 align-items-end">
                  <span className="input-group-text createAccountLable">
                    Amount
                  </span>
                  <input
                    required
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter opening amount"
                    name="opening_Balance"
                    onChange={handleAccountInputChange}
                    value={createAccount.opening_Balance}
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Please enter amount.</div>
                </div>
                <div className="input-group-custom input-group-custom-dynamic mb-4 w-75 align-items-end">
                  <span className="input-group-text createAccountLable">
                    Company Name
                  </span>
                  <input
                    required
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter company name"
                    name="companyName"
                    onChange={handleAccountInputChange}
                    value={createAccount.companyName}
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please choose a company name or any name you want.
                  </div>
                </div>

                <button className="btn btn-success" type="submit">
                  Create Account
                </button>
              </form>
            </div>

            <div className="col-12 py-3 ">
              <div className="d-flex align-items-center flex-column">
                <h3 className="text-center">Account Details</h3>
                <div className="card w-75">
                  <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
                    <AgGridReact
                      rowData={rowData}
                      columnDefs={colDefs}
                      pagination={true}
                    />
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

export default CreateAccount;
