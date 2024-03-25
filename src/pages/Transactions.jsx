import React, { useEffect, useState } from "react";
import MainWrapper from "../components/MainWrapper";
import { useDispatch, useSelector } from "react-redux";
import transactionsService from "../services/transactionsService";
import { AgGridReact } from "ag-grid-react";
import accountService from "../services/accountService";
import authService from "../services/auth";
import { toast } from "react-toastify";

function Transactions() {
  const transactionsState = useSelector((state) => state.transactions);
  const accountsState = useSelector((state) => state.account);
  const dispatch = useDispatch();

  const [rowData, setRowData] = useState("");
  const [colDefs, setColDefs] = useState([
    { field: "accountName" },
    { field: "department" },
    { field: "amount" },
    {
      field: "type",
      cellStyle: (params) => {
        if (params.value === "income") {
          return {
            fontWeight: "bolder",
            color: "black",

            background:
              "linear-gradient(90deg, hsla(175, 79%, 63%, 1) 0%, hsla(82, 96%, 57%, 1) 100%)",
          };
        } else if (params.value === "expense") {
          return {
            fontWeight: "bolder",
            color: "white",

            background:
              "linear-gradient(90deg, hsla(217, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)",
          };
        } else {
          return {
            fontWeight: "bolder",
            color: "white",

            background:
              "linear-gradient(90deg, hsla(333, 100%, 53%, 1) 0%, hsla(33, 94%, 57%, 1) 100%)",
          };
        }
      },
    },
    { field: "category" },
    { field: "description" },
    { field: "entriesCount" },
    {
      field: "receiptsCount",
    },
    /*  {
      headerName: "Download Receipts",
      cellRenderer: "downloadButtonCellRenderer",
      cellRendererParams: {
        onClick: (id) => {
          console.log(
            `Download button clicked for receiptsCount with id: ${id}`
          );
          // Add your download logic here
        },
      },
    }, */
    { field: "createdAt" },
    { field: "createdBy" },
  ]);
  const DownloadButtonCellRenderer = (props) => {
    const handleClick = () => {
      props.onClick(props.data.id);
    };

    return (
      <button className="btn btn-icon btn-2 btn-primary" onClick={handleClick}>
        <span class="material-symbols-outlined">download</span>
      </button>
    );
  };

  const getAllTRansactions = async () => {
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
        let data = await getData(res?.data?.allTransactionsDetails);
        setRowData(data);
      }

      if (
        res?.response?.status === 401 &&
        res?.response?.data?.error === "Token is invalid"
      ) {
        toast.error("Session expired, please login!");
        sessionStorage.clear();
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllTRansactions();
  }, []);

  const getAccountName = async (id) => {
    const res = await accountService.getAccountById(id);

    return res?.data?.accountById.acc_Name;
  };
  const getUserName = async (id) => {
    const res = await authService.getUserDetails(id);

    return res?.user.name;
  };

  const getData = async (arr) => {
    let newData = Promise.all(
      arr.map(async (eachData, i) => {
        if (eachData?.pettyCashAccountId) {
          let account = accountsState.accountDetails.filter(
            (acc) => acc._id == eachData?.pettyCashAccountId
          );
          if (account.length) {
            eachData.accountName = account[0].acc_Name;
          } else {
            eachData.accountName = await getAccountName(
              eachData.pettyCashAccountId
            );
          }
        }
        if (eachData.createdAt) {
          eachData.createdAt = new Date(eachData.createdAt).toDateString();
        }
        if (eachData.createdBy) {
          eachData.createdBy = await getUserName(eachData.createdBy);
        }

        return eachData;
      })
    );

    return newData;
  };
  return (
    <MainWrapper>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header text-white pb-0 mb-0">
                {" "}
                <h3 className="text-center">Transaction Details</h3>
                <div className="d-flex justify-content-between p-0 m-0">
                  <p>
                    No of transactions :{" "}
                    {transactionsState?.allTransactionsSummery ? (
                      transactionsState?.allTransactionsSummery[0]
                        ?.totalTransactions
                    ) : (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                        style={{ fontSize: "5px" }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </p>
                  <p>
                    Total Transactions value :{" "}
                    {transactionsState?.allTransactionsSummery ? (
                      transactionsState?.allTransactionsSummery[0]?.totalAmount
                    ) : (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                        style={{ fontSize: "5px" }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </p>
                </div>
              </div>
              <div className="card-body text-white">
                <div
                  className="ag-theme-quartz-dark" 
                  style={{ height: 500 }}
                >
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    pagination={true}
                    components={{
                      downloadButtonCellRenderer: DownloadButtonCellRenderer,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
}

export default Transactions;
