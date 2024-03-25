import React from "react";
import MainWrapper from "../components/MainWrapper";

function ErrorPage403() {
  const parsedUser = JSON.parse(sessionStorage.getItem("user"));
  const user = parsedUser.role;

  return (
    <MainWrapper>
      <div className="d-flex flex-column align-items-center vh-100">
        <div>
          <div className="d-flex align-items-center">
            <h1 className="display-1 text-warning">403</h1>
            <lord-icon
              src="https://cdn.lordicon.com/akqsdstj.json"
              trigger="in"
              delay="1500"
              state="in-reveal"
              style={{ width: "200px", height: "200px" }}
            ></lord-icon>
          </div>
          <h2>Sorry ! </h2>
          <h3>You are not authorized access to this page</h3>
          <p>
            Only {user == "manager" ? "User or Admin" : "Manager or Admin"} can
            access this page
          </p>
        </div>

        <div className=" errorSlider">
          <h5
            className="error403 text-black"
            style={{ color: "black !important" }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;Error:
            403&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error:
            403&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error:
            Forbidden&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forbidden&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            403&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error:
            403&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error:
            Forbidden&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forbidden&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            403&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error:
            403&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error: 403
          </h5>
        </div>
      </div>
    </MainWrapper>
  );
}

export default ErrorPage403;
