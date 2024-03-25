import React, { useEffect } from "react";
import MainWrapper from "../components/MainWrapper";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authService from "../services/auth";

function UserProfile() {
  const { details: userDetails } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { user } = sessionStorage;
  let dojDate = new Date(+userDetails.doj).toDateString();

  const getUserDetails = async () => {
    const res = await authService.getUserDetails(JSON.parse(user).id);
    dispatch({
      type: "SET_USER_DETAILS",
      payload: { ...res.user, ...res.user.addressDetails },
    });
  };
  useEffect(() => {
    if (!user.id) {
      getUserDetails();
    }
  }, []);
  return (
    <div>
      <MainWrapper>
        <div className="container-fluid px-2 px-md-4">
          <div
            className="page-header min-height-300 border-radius-xl mt-4"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1920&amp;q=80')",
            }}
          >
            <span className="mask  bg-gradient-primary  opacity-6"></span>
          </div>
          <div className="card card-body mx-3 mx-md-4 mt-n6">
            <div className="row gx-4 mb-2">
              <div className="col-auto">
                <div className="avatar avatar-xl position-relative">
                  <lord-icon
                    className="w-100 border-radius-lg shadow-sm"
                    src="https://cdn.lordicon.com/fmasbomy.json"
                    trigger="in"
                    delay="2000"
                    colors="primary:#121331,secondary:#e91e63,tertiary:#ffc738"
                    style={{ width: "100px", height: "100px" }}
                  ></lord-icon>
                </div>
              </div>
              <div className="col-auto my-auto">
                <div className="h-100">
                  <h5 className="mb-1">{userDetails.name}</h5>
                  <p className="mb-0 font-weight-normal text-sm">
                    {userDetails.role}
                  </p>
                </div>
              </div>
              <div className="col-lg-1 col-1 col-md-1 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
                <div className="nav-wrapper position-relative end-0">
                  <Link className="btn" to={"/profileSettings"}>
                    <i className="material-icons text-lg position-relative">
                      settings
                    </i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="row mt-3">
                <div className="col-12 col-md-6 col-xl-6 mt-md-0 mt-4 position-relative">
                  <div className="card card-plain h-100">
                    <div className="card-header pb-0 p-3">
                      <div className="row">
                        <div className="col-md-8 d-flex align-items-center">
                          <h6 className="mb-0">Profile Information</h6>
                        </div>
                        <div className="col-md-4 text-end">
                          <Link to={"/profileSettings"}>
                            <i
                              className="fas fa-user-edit text-secondary text-sm"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              aria-hidden="true"
                              aria-label="Edit Profile"
                              data-bs-original-title="Edit Profile"
                            ></i>
                            <span className="sr-only">Edit Profile</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-3 d-flex justify-content-between">
                      <ul className="list-group pt-4">
                        <li className="list-group-item text-white border-0 ps-0 pt-0 text-sm">
                          <strong className="text-white">Full Name:</strong>{" "}
                          &nbsp; {userDetails.name ? userDetails.name : "none"}
                        </li>
                        <li className="list-group-item text-white border-0 ps-0 text-sm">
                          <strong className="text-white">Mobile:</strong> &nbsp;
                          {userDetails.phone ? userDetails.phone : "none"}
                        </li>
                        <li className="list-group-item text-white border-0 ps-0 text-sm">
                          <strong className="text-white">Email:</strong> &nbsp;
                          {userDetails.email ? userDetails.email : "none"}
                        </li>
                        <li className="list-group-item text-white border-0 ps-0 text-sm">
                          <strong className="text-white">DOB:</strong> &nbsp;
                          {userDetails.dob ? userDetails.dob : "none"}
                        </li>
                        <li className="list-group-item text-white border-0 ps-0 text-sm">
                          <strong className="text-white">DOJ:</strong> &nbsp;
                          {userDetails.doj ? dojDate : "none"}
                        </li>
                        <li className="list-group-item text-white border-0 ps-0 text-sm">
                          <strong className="text-white">Role:</strong> &nbsp;
                          {userDetails.role ? userDetails.role : "none"}
                        </li>
                      </ul>

                      <div className="pt-4">
                        <lord-icon
                          src="https://cdn.lordicon.com/yqiuuheo.json"
                          trigger="in"
                          delay="1500"
                          state="in-unfold"
                          style={{ width: "150px", height: "150px" }}
                        ></lord-icon>
                      </div>
                    </div>
                  </div>
                  <hr className="vertical light" />
                </div>
                <div className="col-12 col-md-6 col-xl-6 mt-md-0 mt-4 position-relative">
                  <div className="card card-plain h-100">
                    <div className="card-header pb-0 p-3">
                      <div className="row">
                        <div className="col-md-8 d-flex align-items-center ">
                          <h6 className="mb-0">Contact details</h6>
                        </div>
                        <div className="col-md-4 text-end">
                          <Link to={"/profileSettings"}>
                            <i
                              className="fas fa-user-edit text-secondary text-sm"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              aria-hidden="true"
                              aria-label="Edit Profile"
                              data-bs-original-title="Edit Profile"
                            ></i>
                            <span className="sr-only">Edit Profile</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-3 d-flex justify-content-between">
                      <hr className="horizontal gray-light m-0 p-0" />
                      <ul className="list-group pt-3">
                        <li className="list-group-item text-white border-0 ps-0 pt-0 text-sm">
                          <strong className="text-white">Address:</strong>{" "}
                          &nbsp;{" "}
                          {userDetails.address ? userDetails.address : "none"}
                        </li>
                        <li className="list-group-item text-white border-0 ps-0 text-sm">
                          <strong className="text-white">City:</strong> &nbsp;
                          {userDetails.city ? userDetails.city : "none"}
                        </li>
                        <li className="list-group-item text-white border-0 ps-0 text-sm">
                          <strong className="text-white">State:</strong> &nbsp;
                          {userDetails.state ? userDetails.state : "none"}
                        </li>
                        <li className="list-group-item text-white border-0 ps-0 text-sm">
                          <strong className="text-white">Pincode:</strong>{" "}
                          &nbsp;{" "}
                          {userDetails.pincode ? userDetails.pincode : "none"}
                        </li>
                      </ul>
                      <div className="pt-3">
                        <lord-icon
                          src="https://cdn.lordicon.com/egmlnyku.json"
                          trigger="in"
                          delay="1500"
                          state="in-reveal"
                          style={{ width: "150px", height: "150px" }}
                        ></lord-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainWrapper>
    </div>
  );
}

export default UserProfile;
