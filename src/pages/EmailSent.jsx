import React from "react";
import NavBarSignup from "../components/NavBarSignup";
import { useSelector } from "react-redux";

function EmailSent() {
  const user = useSelector((state) => state.user.signup);

  return (
    <div className="row  justify-content-center align-items-center vh-100">
      <div className="d-flex justify-content-center p-0">
        <NavBarSignup />
      </div>
      <div className="col-12 col-md-4 mx-5 px-5">
        <h2>Registered successfully</h2>
        <h1></h1>
        <div className="logoBox ">
          <h1 className="logoName">Imprest-ive</h1>
          <small className="mt-0 pt-0 opacity-75 logoSlogen">
            Small Change, Big Impact
          </small>
        </div>
        <div>
          <p>Credentials to access your account has been updated.</p>
          <h5>Hi {user?.name},</h5>
          <p>
            Thank you very much for registering at <b>IMPREST-ive</b> Pettycash
            manager.
          </p>
          <p>
            We have sent an email to your mailbox. Please follow the
            instructions in the mail to confirm your account. Once your account
            is confirmed, you may login to access your dashboard.
          </p>
        </div>
      </div>
      <div className="col-6 col-md-4">
        <lord-icon
          src="https://cdn.lordicon.com/tmqaflqo.json"
          trigger="in"
          delay="1500"
          state="in-assembly"
          style={{ width: "250px", height: "250px" }}
        ></lord-icon>
      </div>
    </div>
  );
}

export default EmailSent;
