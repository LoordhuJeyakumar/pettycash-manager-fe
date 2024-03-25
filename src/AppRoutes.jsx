import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import About from "./pages/About";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import CreateAccount from "./pages/CreateAccount";
import CashRequest from "./pages/CashRequest";
import EmailSent from "./pages/EmailSent";
import Verification from "./pages/Verification";
import SendVerificationEmail from "./pages/SendVerificationEmail";
import Redirect from "./pages/Redirect";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import ErrorPage403 from "./pages/ErrorPage403";
import UserProfile from "./pages/UserProfile";
import ProfileSettings from "./pages/ProfileSettings";
import EditAccount from "./pages/EditAccount";
import ApproveRequests from "./pages/ApproveRequests";
import CreateTransactions from "./pages/CreateTransactions";
import Transactions from "./pages/Transactions";

function AppRoutes() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <Signup />} />

        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="about" element={<About />} />
        <Route path="emailsent" element={<EmailSent />} />
        <Route path="verification/:token" element={<Verification />} />
        <Route path="sendemail" element={<SendVerificationEmail />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="profileSettings" element={<ProfileSettings />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route element={<ProtectedRoutes role={"manager"} />}>
            <Route path="create-account" element={<CreateAccount />} />
            <Route path="accountSettings" element={<EditAccount />} />
            <Route path="approveRequests" element={<ApproveRequests />} />
          </Route>
          <Route element={<ProtectedRoutes role={"user"} />}>
            <Route
              path="create-transactions"
              element={<CreateTransactions />}
            />
            <Route path="cash-request" element={<CashRequest />} />
          </Route>
        </Route>

        <Route path="error403" element={<ErrorPage403 />} />
        <Route path="redirect" element={<Redirect />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
