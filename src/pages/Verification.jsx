import React, { useEffect, useState } from "react";
import Verifying from "../components/Verifying";
import Verified from "../components/Verified";
import Expired from "../components/Expired";
import Invalid from "../components/Invalid";
import { useParams } from "react-router-dom";
import authService from "../services/auth";

function Verification() {
  const [tokenStatus, setTokenStatus] = useState("verifying");
  const { token } = useParams();

  useEffect(() => {
    verifyToken(token);
  }, []);

  async function verifyToken(token) {
    try {
      setTokenStatus("verifying");
      let res = await authService.verify(token);

      if (res?.data) {
        if (res.data.message === "verificationToken is valid") {
          setTokenStatus("verified");
          return res;
        }
      } else {
        if (res.response.data.message === "Verification Token is not valid") {
          setTokenStatus("invalid");
          return res;
        } else if (res.response.data.message === "verificationToken Expired") {
          setTokenStatus("expired");
          return res;
        }
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  const renderPage = () => {
    if (tokenStatus === "verifying") {
      return <Verifying />;
    } else if (tokenStatus === "expired") {
      return <Expired />;
    } else if (tokenStatus === "invalid") {
      return <Invalid />;
    } else if (tokenStatus === "verified") {
      return <Verified />;
    }
  };
  return <>{renderPage()}</>;
}

export default Verification;
