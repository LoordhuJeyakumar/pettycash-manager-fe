import React, { useEffect, useState } from "react";

import "./css/root.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function SideNav() {
  const location = useLocation();
  const userParsed = JSON.parse(sessionStorage.getItem("user"));
  const [profileTabActive, setProfileTabActive] = useState(false);
  const [dashboardTabActive, setDashboardTabActive] = useState(false);
  const navigate = useNavigate();
  const handleSignOut = async () => {
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const profilePaths = ["/profile", "/profileSettings"];
    if (profilePaths.includes(location.pathname)) {
      handleProfileTabOpen();
      setProfileTabActive(true);
      setDashboardTabActive(false);
    } else {
      setProfileTabActive(false);
      setDashboardTabActive(true);
      handleDashboardTabOpen();
    }
  }, [location.pathname]);

  const handleProfileTabOpen = () => {
    setProfileTabActive(true);
    setDashboardTabActive(false);
  };

  const handleDashboardTabOpen = () => {
    setDashboardTabActive(true);
    setProfileTabActive(false);
  };
  return (
    <aside
      className="sidenav  navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark "
      id="sidenav-main"
    >
      <div className="sidenav-header">
        <div className="p-1 m-1">
          <div className="logoBox d-flex flex-column align-items-center">
            <h1 className="logoName fs-5 w-50">Imprest-ive</h1>
            <small className="mt-0 pt-0 opacity-75 tagline">
              Small Change, Big Impact
            </small>
            <small className="tagline">
              Manage your petty cash, effortlessly.
            </small>
          </div>
        </div>
      </div>
      <hr className="horizontal light mt-0 mb-2" />
      <div
        className="collapse navbar-collapse w-auto h-auto "
        id="sidenav-collapse-main"
      >
        <ul className="navbar-nav">
          <li className="nav-item mb-2 mt-0">
            <a
              data-bs-toggle="collapse"
              href="#ProfileNav"
              className="nav-link text-white active"
              aria-controls="ProfileNav"
              role="button"
              aria-expanded="false"
            >
              <span className="material-symbols-outlined">account_circle</span>
              <span className="nav-link-text ms-2 ps-1">
                {userParsed?.name}
              </span>
            </a>
            <div
              className={profileTabActive ? "collapse show" : "collapse"}
              id="ProfileNav"
            >
              <ul className="nav ">
                <li className="nav-item">
                  <NavLink
                    className="nav-link text-w hite"
                    to={"/profile"}
                    onClick={handleProfileTabOpen}
                  >
                    <span className="material-symbols-outlined sidenav-mini-icon">
                      badge
                    </span>
                    <span className="sidenav-normal  ms-3  ps-1">
                      {" "}
                      My Profile{" "}
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link text-white "
                    to={"/profileSettings"}
                    onClick={handleProfileTabOpen}
                  >
                    <span className="material-symbols-outlined sidenav-mini-icon">
                      manage_accounts
                    </span>
                    <span className="sidenav-normal  ms-3  ps-1">
                      {" "}
                      Settings{" "}
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <a
                    type="button"
                    onClick={handleSignOut}
                    className="nav-link text-white "
                  >
                    <span className="material-symbols-outlined sidenav-mini-icon">
                      logout
                    </span>
                    <span className="sidenav-normal  ms-3  ps-1"> Logout </span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <hr className="horizontal light mt-0" />
          <li className="nav-item">
            <a
              data-bs-toggle="collapse"
              href="#dashboardsExamples"
              className="nav-link text-white active"
              aria-controls="dashboardsExamples"
              role="button"
              aria-expanded="false"
            >
              <span className="material-icons-round">widgets</span>
              <span className="nav-link-text ms-2 ps-1">Menu</span>
            </a>
            <div
              className={dashboardTabActive ? "collapse show" : "collapse"}
              id="dashboardsExamples"
            >
              <ul className="nav ">
                <li className="nav-item ">
                  <NavLink
                    className="nav-link text-white d-flex justify-content-between"
                    to="/dashboard"
                    onClick={handleDashboardTabOpen}
                  >
                    <span className="sidenav-normal  ms-2  ps-1">
                      Dashboard
                    </span>
                    <lord-icon
                      src="https://cdn.lordicon.com/epietrpn.json"
                      trigger="morph"
                      state="morph-mantion"
                      style={{ width: "30px", height: "30px" }}
                    ></lord-icon>
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <NavLink
                    onClick={handleDashboardTabOpen}
                    to="/create-account"
                    className="nav-link text-white d-flex justify-content-between"
                  >
                    <span className="sidenav-normal  ms-2  ps-1">
                      Create Account
                    </span>
                    <lord-icon
                      src="https://cdn.lordicon.com/svsiboke.json"
                      trigger="morph"
                      state="morph-open"
                      style={{ width: "30px", height: "30px" }}
                    ></lord-icon>
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <NavLink
                    onClick={handleDashboardTabOpen}
                    to="/accountSettings"
                    className="nav-link text-white d-flex justify-content-between"
                  >
                    <span className="sidenav-normal  ms-2  ps-1">
                      Account Settings
                    </span>
                    <lord-icon
                      src="https://cdn.lordicon.com/dvqeipeg.json"
                      trigger="hover"
                      style={{ width: "30px", height: "30px" }}
                    ></lord-icon>
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <NavLink
                    onClick={handleDashboardTabOpen}
                    to="/approveRequests"
                    className="nav-link text-white d-flex justify-content-between"
                  >
                    <span className="sidenav-normal  ms-2  ps-1">
                      Approve Requests
                    </span>
                    <lord-icon
                      src="https://cdn.lordicon.com/atidmavy.json"
                      trigger="hover"
                      colors="primary:#e8308c,secondary:#08a88a,tertiary:#f24c00,quaternary:#ebe6ef"
                      style={{ width: "30px", height: "30px" }}
                    ></lord-icon>
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <NavLink
                    onClick={handleDashboardTabOpen}
                    className="nav-link text-white d-flex justify-content-between"
                    to="/cash-request"
                  >
                    <span className="sidenav-normal  ms-2  ps-1">
                      Cash Request
                    </span>
                    <lord-icon
                      src="https://cdn.lordicon.com/dypzookn.json"
                      trigger="morph"
                      state="morph-destroyed"
                      style={{ width: "30px", height: "30px" }}
                    ></lord-icon>
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <NavLink
                    onClick={handleDashboardTabOpen}
                    className="nav-link text-white d-flex justify-content-between"
                    to="/create-transactions"
                  >
                    <span className="sidenav-normal  ms-2  ps-1">
                      Create Transactions
                    </span>
                    <lord-icon
                      src="https://cdn.lordicon.com/jtiihjyw.json"
                      trigger="hover"
                      state="hover-spending"
                      style={{ width: "30px", height: "30px" }}
                    ></lord-icon>
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <NavLink
                    onClick={handleDashboardTabOpen}
                    className="nav-link text-white d-flex justify-content-between"
                    to="/transactions"
                  >
                    <span className="sidenav-normal  ms-2  ps-1">
                      Transactions
                    </span>
                    <lord-icon
                      src="https://cdn.lordicon.com/lxizbtuq.json"
                      trigger="loop"
                      delay="1000"
                      state="morph-coins"
                      style={{ width: "30px", height: "30px" }}
                    ></lord-icon>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default SideNav;
