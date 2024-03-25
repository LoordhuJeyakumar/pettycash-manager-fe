import React, { useRef, useState } from "react";
import NavBarSignup from "../components/NavBarSignup";
import loginTitle from "../assets/images/square1.e7549dcf.png";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import authService from "../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function Login() {
  const loginForm = useRef(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const loginUser = useSelector((state) => state.user.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginInputChange = async (event) => {
    dispatch({
      type: "SET_LOGIN_USER",
      payload: { name: event.target.name, value: event.target.value },
    });
  };

  const handleLogin = async (event) => {
    setIsSubmit(true);
    event.preventDefault();
    // Prevent form submission if there are any invalid fields
    if (!loginForm.current.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      setIsSubmit(false);
    }
    // Add 'was-validated' className to the form to show validation feedback
    loginForm.current.classList.add("was-validated");

    // If the form is valid, proceed with user details submission
    if (loginForm.current.checkValidity()) {
      const res = await authService.login(loginUser);
     

      if (res?.message === "Network Error") {
        toast.error(res.message);
        setIsSubmit(false);
        dispatch({ type: "default" });
        loginForm.current.classList.remove("was-validated");

        return;
      }

      if (res?.status === 200) {
        toast.success("Successfully logged in!");
        setIsSubmit(false);
        dispatch({ type: "default" });
        loginForm.current.classList.remove("was-validated");

        navigate("/redirect");
        dispatch({
          type: "SET_LOGIN",
        });
        dispatch({
          type: "SET_USER_DETAILS",
          payload: res.data,
        });
        return;
      } else if (res?.status == 401) {
        toast.info(res.data.message);
        setIsSubmit(false);
        dispatch({ type: "default" });
        loginForm.current.classList.remove("was-validated");
        return;
      } else if (res?.status == 403) {
        toast.info(res.data.message);
        setIsSubmit(false);
        dispatch({ type: "default" });
        loginForm.current.classList.remove("was-validated");
        return;
      }
    }
  };
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
      <div className="d-flex justify-content-center">
        <NavBarSignup />
      </div>
      <div className="login-page">
        <div className="login-page-header">
          <div className="container">
            <div className="row">
              <div className="loginMainCard mx-auto col-md-12 col-lg-5">
                <div
                  className="square square-7"
                  id="square7"
                  style={{
                    transform:
                      "perspective(500px) rotateY(9.32deg) rotateX(-2.76667deg)",
                  }}
                ></div>
                <div
                  className="square square-8"
                  id="square8"
                  style={{
                    transform:
                      "perspective(500px) rotateY(9.32deg) rotateX(-2.76667deg)",
                  }}
                ></div>
                <div className="card-login card">
                  <div className="card-header">
                    <img
                      alt="..."
                      src={loginTitle}
                      className="card-img-login"
                    />
                    <h4 className="card-title">Login</h4>
                  </div>
                  <div className="card-body">
                    <form
                      ref={loginForm}
                      onSubmit={handleLogin}
                      className="form p-3 loginForm needs-validation"
                      noValidate
                    >
                      <div className="input-groupCustom mt-2">
                        <div
                          className="input-groupCustom-prepend"
                          style={{ borderLeft: "5px solid #1d8cf8" }}
                        >
                          <span className="input-groupCustom-text">
                            <i className="fa-solid fa-envelope"></i>
                          </span>
                        </div>
                        <input
                          required
                          name="email"
                          placeholder="Email"
                          type="email"
                          className="registerInput"
                          value={loginUser.email}
                          onChange={handleLoginInputChange}
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">
                          Please enter valid email.
                        </div>
                      </div>
                      <div className="input-groupCustom mt-3 mb-2">
                        <div
                          className="input-groupCustom-prepend iconbox"
                          style={{ borderLeft: "5px solid #1d8cf8" }}
                        >
                          <span className="input-groupCustom-text iconbox">
                            <i className="fa-solid fa-key"></i>
                          </span>
                        </div>
                        <input
                          autoComplete=""
                          required
                          name="password"
                          placeholder="Password"
                          type="password"
                          className="registerInput"
                          value={loginUser.password}
                          onChange={handleLoginInputChange}
                        />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">
                          Please enter password.
                        </div>
                      </div>

                      <div className="card-footer m-0 pb-2 d-flex justify-content-center ">
                        <button
                          className="btn-round  btn-info btn-lg "
                          type="submit"
                        >
                          Login{" "}
                          <div
                            className={
                              isSubmit
                                ? "spinner-border spinner-border-sm "
                                : ""
                            }
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="signupLink">
                    <span>
                      If you don't have an account{" "}
                      <Link to="/">Create Account</Link> here
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="square square-1"
              id="square1"
              style={{
                transform:
                  "perspective(500px) rotateY(20.85deg) rotateX(-13.45deg)",
              }}
            ></div>
            <div
              className="square square-2"
              id="square2"
              style={{
                transform:
                  "perspective(500px) rotateY(20.8deg) rotateX(-2.1deg)",
              }}
            ></div>
            <div
              className="square square-3"
              id="square3"
              style={{
                transform:
                  "perspective(500px) rotateY(20.8deg) rotateX(-3.6deg)",
              }}
            ></div>
            <div
              className="square square-4"
              id="square4"
              style={{
                transform:
                  "perspective(500px) rotateY(20.8deg) rotateX(-3.6deg)",
              }}
            ></div>
            <div
              className="square square-5"
              id="square5"
              style={{
                transform:
                  "perspective(500px) rotateY(20.8deg) rotateX(-3.6deg)",
              }}
            ></div>
            <div
              className="square square-6"
              id="square6"
              style={{
                transform:
                  "perspective(500px) rotateY(20.8deg) rotateX(-3.6deg)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
