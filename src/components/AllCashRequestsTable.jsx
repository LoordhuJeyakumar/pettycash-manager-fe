import React, { useEffect, useState } from "react";
import cashRequestService from "../services/cashRequestService";
import { useDispatch, useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AllCashRequestsTable() {
  const { isUpdate } = useSelector((state) => state.cashRequest);

  const dispatch = useDispatch();
  const [fetchStart, setFetchStart] = useState(false);
  const navigate = useNavigate();
  const [rowData, setRowData] = useState("");
  const [colDefs, setColDefs] = useState([
    { field: "accountName" },
    { field: "purpose" },
    { field: "amount" },
    {
      field: "status",
      cellStyle: (params) => {
        if (params.value === "Approved") {
          return {
            fontWeight: "bolder",
            color: "black",

            background:
              "linear-gradient(90deg, hsla(175, 79%, 63%, 1) 0%, hsla(82, 96%, 57%, 1) 100%)",
          };
        } else if (params.value === "Pending") {
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
    { field: "dateRequested" },
    { field: "documentsCount" },
    { field: "requestedUserName" },
    { field: "approvedUserName" },
    { field: "approvalDate" },
    { field: "rejectionReason" },
  ]);

  const getAllCashRequests = async () => {
    setFetchStart(true);
    try {
      const res = await cashRequestService.getAllRequests();

      if (res.status === 200) {
        dispatch({
          type: "SET_ALL_REQUESTS",
          payload: res.data.allCashRequests,
        });

        let newArr = await Promise.all(
          res.data.allCashRequests.map(async (each) => {
            each.dateRequested = new Date(each.dateRequested).toUTCString();
            each.approvalDate = each.approvalDate
              ? new Date(each.approvalDate).toUTCString()
              : "";

            return each;
          })
        );
        if (res?.response?.status === 401) {
          toast.error("Session expired, Please login");
          navigate("/login");
        }

        setRowData(newArr);
        setFetchStart(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCashRequests();
  }, [isUpdate]);
  return (
    <div className="row" id="viewAllRequests">
      <div className="card">
        <div className="card-header">
          <h3 className="text-center">All Cash Request</h3>
        </div>
        <div className="card-body">
          <div>
            <button
              onClick={getAllCashRequests}
              className="btn btn-outline-info text-capitalize d-flex justify-content-center align-items-center"
            >
              Sync
              <span className="material-symbols-outlined">sync</span>
              <div
                className={fetchStart ? "spinner-grow" : "d-none"}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </button>
          </div>
          <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              pagination={true}
            />
          </div>
        </div>
        <div className="card-footer"></div>
      </div>
    </div>
  );
}

export default AllCashRequestsTable;
