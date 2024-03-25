import React, { useState } from "react";
import cashRequestService from "../services/cashRequestService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

function ApproveButton({ getAllPendingRequests, id }) {
  const [isApproveStart, setIsApproveStart] = useState(false);
  const dispatch = useDispatch();

  const handleApproveCashRequest = async (event) => {
    setIsApproveStart(true);
    event.preventDefault();
    const requestObjId = {
      cashRequestId: id,
    };
    try {
      if (requestObjId.cashRequestId) {
        const res = await cashRequestService.approveRequest(requestObjId);

        if (res?.status === 200) {
          toast.success(res.data.message);
          setIsApproveStart(false);
          getAllPendingRequests();
          dispatch({ type: "SET_IS_UPDATE" });
        }

        if (res?.response?.status === 409) {
          toast.info(res.response.data.message);
          setIsApproveStart(false);
          getAllPendingRequests();
          dispatch({ type: "SET_IS_UPDATE" });
        }
      }
    } catch (error) {
      setIsApproveStart(false);
      console.error(error);
      getAllPendingRequests();
      dispatch({ type: "SET_IS_UPDATE" });
    }
  };
  return (
    <button
      onClick={handleApproveCashRequest}
      className={
        isApproveStart
          ? "btn btn-success w-100  text-center m-2 d-flex align-items-center"
          : "btn btn-success w-100  text-center m-2"
      }
    >
      Approve{"  "}
      <div
        className={isApproveStart ? "spinner-border ms-1" : "d-none"}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </button>
  );
}

export default ApproveButton;
