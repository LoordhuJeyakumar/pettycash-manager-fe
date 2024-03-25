import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth";
import { useDispatch } from "react-redux";

function Redirect() {
  const navigate = useNavigate();
  const { accessToken, user } = sessionStorage;
  const userDetails = JSON.parse(user);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserDetails();
    handleRedirect();
  }, []);

  const getUserDetails = async () => {
    const res = await authService.getUserDetails(userDetails.id);
    dispatch({
      type: "SET_USER_DETAILS",
      payload: res.user,
    });
  };

  const handleRedirect = () => {
    if (accessToken) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="d-flex align-items-center flex-column justify-content-center vh-100"
    >
      <div>
        <div className="position-relative mt-5 pt-4 top-0">
          <span className="h1">Welcome! {userDetails.name},</span>{" "}
          <span className="h2">Just a moment...</span>
        </div>
        <div className="slider top-50">
          <div className="line"></div>
          <div className="break dot1"></div>
          <div className="break dot2"></div>
          <div className="break dot3"></div>
        </div>

        <p className="">
          We're redirecting you to your dashboard... Not working?{" "}
          <button className="btn btn-warning" onClick={handleRedirect}>
            Click here
          </button>
        </p>
      </div>
      <div className="position-absolute redirectIcon">
        <lord-icon
          src="https://cdn.lordicon.com/hsrrkevt.json"
          colors="primary:#ebe6ef,secondary:#4a8df8,tertiary:#ffc738,quaternary:#646e78"
          trigger="loop"
          state="loop-cycle"
          style={{ width: "250px", height: "250px" }}
        ></lord-icon>
      </div>
    </motion.div>
  );
}

export default Redirect;
