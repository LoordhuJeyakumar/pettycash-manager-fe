import React from "react";
import { Link, NavLink } from "react-router-dom";

function NavBarSignup() {
  return (
    <div className="  p-5 bg-transparent navBox ">
      <nav className="navbar navbar-expand-md flex-wrap navbar-dark ">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link
            className="navbar-brand font-weight-bolder ms-lg-0 ms-3 text-white"
            to={"/"}
          >
            <h1 className="logoName fw-bold fs-5 text-uppercase p-0 m-0">
              Imprest-ive
            </h1>
            <small className="mt-0 p-0 opacity-75 logoSlogen">
              Pettycash Manager
            </small>
          </Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex  justify-content-end w-100 nav-pills  navLinks ">
              <li className="nav-item rounded-pill">
                <NavLink to="/" className="nav-link  rounded-pill">
                  <span>Signup </span>
                  <span className="material-symbols-outlined">person_add</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link rounded-pill">
                  <span>Login</span>
                  <span className="material-symbols-outlined">login</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link rounded-pill" to="/about">
                  <span>About</span>
                  <span className="material-symbols-outlined">page_info</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link rounded-pill" to="/sendemail">
                  <span>Send Email </span>
                  <span className="material-symbols-outlined">send</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBarSignup;
