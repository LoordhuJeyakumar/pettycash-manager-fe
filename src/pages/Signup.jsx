import React, { useEffect, useRef, useState } from "react";

import square_purple from "../assets/images/square-purple-1.webp";
import NavBarSignup from "../components/NavBarSignup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authService from "../services/auth";
import { toast } from "react-toastify";
import { motion, useIsPresent } from "framer-motion";

function Signup() {
  const signupFormRef = useRef(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const signupUser = useSelector((state) => state.user.signup);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isPresent = useIsPresent();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleInputChange = (event) => {
    let obj = {
      [event.target.name]: event.target.value,
    };
    dispatch({
      type: "SET_SIGNUP_USER",
      payload: { name: event.target.name, value: event.target.value },
    });
  };

  const handleSignup = async (event) => {
    setIsSubmit(true);
    event.preventDefault();
    // Prevent form submission if there are any invalid fields
    if (!signupFormRef.current.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      setIsSubmit(false);
    }
    // Add 'was-validated' className to the form to show validation feedback
    signupFormRef.current.classList.add("was-validated");

    // If the form is valid, proceed with user details submission
    if (signupFormRef.current.checkValidity()) {
      let response = await authService.signup(signupUser);

      if (response.status === 201) {
        toast.success(response.data.message);
        signupFormRef.current.classList.remove("was-validated");
        setIsSubmit(false);
        navigate("/emailsent");
      } else if (response.status === 409) {
        toast.info(response.data.message);
        signupFormRef.current.classList.remove("was-validated");
        setIsSubmit(false);
        dispatch({ type: "UNSET_SIGNUP_USER" });
      } else {
        toast.error(response.message);
        signupFormRef.current.classList.remove("was-validated");
        setIsSubmit(false);
        dispatch({ type: "UNSET_SIGNUP_USER" });
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="signup-page"
      >
        <div className="signup-wrapper ">
          <div className="d-flex justify-content-center">
            <NavBarSignup />
          </div>
          <div className="signUp-page-header">
            <div className="page-header-image"></div>
            <div className="content ">
              <div className="container ">
                <div className="row flex-row">
                  <div className="cardMain  col-md-6 col-lg-5">
                    <div
                      className="square square-7"
                      id="square7"
                      style={{
                        transform:
                          "perspective(500px) rotateY(8.79deg) rotateX(-1.51667deg)",
                      }}
                    ></div>
                    {/* square animation block */}
                    <div
                      className="square square-8"
                      id="square8"
                      style={{
                        transform:
                          "perspective(500px) rotateY(8.79deg) rotateX(-1.51667deg)",
                      }}
                    ></div>
                    {/* square animation block */}
                    <div className="card-register card">
                      <div className="card-header">
                        <img
                          alt="..."
                          src={square_purple}
                          className="card-img"
                        />
                        <h4 className="card-title">Register</h4>
                      </div>
                      <div className="card-body">
                        <form
                          className="form needs-validation"
                          onSubmit={handleSignup}
                          ref={signupFormRef}
                          noValidate
                        >
                          <div className="input-groupCustom">
                            <div className="input-groupCustom-prepend">
                              <span className="input-groupCustom-text">
                                <i className="fa-regular fa-user "></i>
                              </span>
                            </div>

                            <input
                              required
                              placeholder="Full Name"
                              type="text"
                              className="registerInput"
                              name="name"
                              value={signupUser.name}
                              onChange={handleInputChange}
                            />
                            <div className="valid-feedback">Looks good!</div>
                            <div className="invalid-feedback">
                              Please enter full name.
                            </div>
                          </div>

                          <div className="input-groupCustom">
                            <div className="input-groupCustom-prepend">
                              <span className="input-groupCustom-text">
                                <i className="fa-solid fa-envelope"></i>
                              </span>
                            </div>
                            <input
                              required
                              placeholder="Email"
                              type="email"
                              className="registerInput"
                              name="email"
                              value={signupUser.email}
                              onChange={handleInputChange}
                            />
                            <div className="valid-feedback">Looks good!</div>
                            <div className="invalid-feedback">
                              Please enter email.
                            </div>
                          </div>
                          <div className="input-groupCustom">
                            <div className="input-groupCustom-prepend iconbox">
                              <span className="input-groupCustom-text iconbox">
                                <i className="fa-solid fa-key"></i>
                              </span>
                            </div>
                            <input
                              required
                              placeholder="Password"
                              type="password"
                              className="registerInput"
                              name="password"
                              autoComplete=""
                              value={signupUser.password}
                              onChange={handleInputChange}
                            />
                            <div className="valid-feedback">Looks good!</div>
                            <div className="invalid-feedback">
                              Please enter password.
                            </div>
                          </div>
                          <div className="input-groupCustom">
                            <div className="input-groupCustom-prepend iconbox">
                              <span className="input-groupCustom-text iconbox">
                                <i className="fa-solid fa-user-tie"></i>
                              </span>
                            </div>
                            <select
                              onChange={handleInputChange}
                              value={signupUser.role}
                              required
                              name="role"
                              id="userRole"
                              className="registerInput userRole"
                            >
                              <option value="">Select user type</option>
                              <option value="manager">Manager</option>
                              <option value="user">User</option>
                            </select>
                            <div className="valid-feedback">Looks good!</div>
                            <div className="invalid-feedback">
                              Please select role.
                            </div>
                          </div>
                          <div className="card-footer mt-4 pb-0 mb-0">
                            <button
                              className="btn-round  btn-primary btn-lg animation-on-hover"
                              type="submit"
                            >
                              Create Account{" "}
                              <div
                                className={
                                  isSubmit
                                    ? "spinner-border spinner-border-sm "
                                    : ""
                                }
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="loginLink pt-0">
                        <span>
                          If you already have an account{" "}
                          <Link to="/login">login</Link> here
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="cardSecond col-md-6 col-lg-7">
                    <div className="logoBox ">
                      <h1 className="logoName">Imprest-ive</h1>
                      <small className="mt-0 pt-0 opacity-75 logoSlogen">
                        Small Change, Big Impact
                      </small>
                    </div>

                    <h1 className="display-5 fw-bold ls-tight">
                      Pettycash Manager
                    </h1>
                    <h3>
                      <span style={{ color: "hsl(218, 81%, 75%)" }}>
                        Expense | Income | Cash Request & Approve
                      </span>
                    </h3>

                    <div className="card mb-3" style={{ maxWidth: "540px" }}>
                      <div className="row g-0 bg-transparent">
                        <div className="col-md-8">
                          <div className="card-body">
                            <p className="card-text ">
                              <b>Welcome</b> to the <b>Imprest-ive</b> Petty
                              Cash Manager! Here, you'll find all the resources
                              and information you need to effectively manage
                              your organization's petty cash fund.
                            </p>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <lord-icon
                            src="https://cdn.lordicon.com/nlmjynuq.json"
                            trigger="in"
                            delay="1500"
                            state="in-reveal"
                            style={{
                              width: "200px",
                              height: "200px",
                              background: "transparent !important",
                            }}
                          ></lord-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="register-bg"></div>
                <div
                  className="square square-1"
                  id="square1"
                  style={{
                    transform:
                      "perspective(500px) rotateY(21.975deg) rotateX(-3.79167deg)",
                  }}
                ></div>
                <div
                  className="square square-2"
                  id="square2"
                  style={{
                    transform:
                      "perspective(500px) rotateY(21.975deg) rotateX(-3.79167deg)",
                  }}
                ></div>
                <div
                  className="square square-3"
                  id="square3"
                  style={{
                    transform:
                      "perspective(500px) rotateY(21.975deg) rotateX(-3.79167deg)",
                  }}
                ></div>
                <div
                  className="square square-4"
                  id="square4"
                  style={{
                    transform:
                      "perspective(500px) rotateY(21.975deg) rotateX(-3.79167deg)",
                  }}
                ></div>
                <div
                  className="square square-5"
                  id="square5"
                  style={{
                    transform:
                      "perspective(500px) rotateY(21.975deg) rotateX(-3.79167deg)",
                  }}
                ></div>
                <div
                  className="square square-6"
                  id="square6"
                  style={{
                    transform:
                      "perspective(500px) rotateY(21.975deg) rotateX(-3.79167deg)",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
      />
    </>
  );
}

export default Signup;
