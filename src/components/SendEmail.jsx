import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/auth";
import { toast } from "react-toastify";

function SendEmail() {
  const [email, setEmail] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const emailSendForm = useRef(null);

  const handleEmailInput = (event) => {
    event.preventDefault();
    let email = event.target.value;
    setEmail(email);
  };

  const handleEmailSent = async (event) => {
    setIsSubmit(true);
    event.preventDefault();
    // Prevent form submission if there are any invalid fields
    if (!emailSendForm.current.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      setIsSubmit(false);
    }
    // Add 'was-validated' className to the form to show validation feedback
    emailSendForm.current.classList.add("was-validated");

    // If the form is valid, proceed with user details submission
    if (emailSendForm.current.checkValidity()) {
      let obj = { email: email };
      let response = await authService.sendVerificationEmail(obj);
    
      if (response.status === 200) {
        toast.success(response.data.message);
        emailSendForm.current.classList.remove("was-validated");
        setIsSubmit(false);
      } else if (response.status === 401) {
        toast.info(response.data.message);
        emailSendForm.current.classList.remove("was-validated");
        setIsSubmit(false);
      } else {
        toast.error(response.message);
        emailSendForm.current.classList.remove("was-validated");
        setIsSubmit(false);
      }
    }
  };
  return (
    <div className="col-md-12 col-lg-5 col-12 p-1 cardBox rounded">
      <div className=" card  text-white">
        <div className="card-header">
          <h1 className="card-title text-center fs-1 fw-bold text-warning">
            Send Email
          </h1>
        </div>
        <div className="card-body">
          <form
            ref={emailSendForm}
            className="form needs-validation"
            noValidate
            onSubmit={handleEmailSent}
          >
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
                value={email}
                onChange={handleEmailInput}
              />
              <div className="valid-feedback">Looks good!</div>
              <div className="invalid-feedback">Please enter email.</div>
            </div>
            <div className="form-text text-white opacity-50" id="basic-addon4">
              Please enter your email id to get new verification email
            </div>

            <div className="card-footer mt-4 pb-0 mb-0 d-flex justify-content-center">
              <button
                className="btn-round  btn-primary btn-lg animation-on-hover"
                type="submit"
              >
                Send Email{" "}
                {isSubmit ? (
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  ""
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="loginLink pt-0">
          <span>
            Back to home page <Link to="/">Click</Link> here
          </span>
        </div>
      </div>
    </div>
  );
}

export default SendEmail;
