import React from "react";
import NavBarSignup from "../components/NavBarSignup";
import { motion } from "framer-motion";

function About() {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
      <div className="d-flex justify-content-center">
        <NavBarSignup />
      </div>
      <div className="about-page">
        <div className="container pt-5 mt-4">
          <div className="row pt-5 mt-5 d-flex justify-content-center">
            <div>
              <h1>Welcome to IMPREST-IVE!</h1>
              <p>
                <b className="fw-bold"> IMPREST-IVE</b> is your comprehensive
                solution for managing petty cash effortlessly and efficiently.
                Designed with simplicity and functionality in mind, our
                application streamlines the process of handling income and
                expenses, ensuring that your business’s financial transactions
                are tracked with precision.
              </p>
            </div>
            <div>
              <h2>Demo Access</h2> To get a feel for IMPREST-IVE, use our demo
              accounts: <br />
              Manager Role
              <ul>
                <li>Username : loordhujeyakumar@gmail.com</li>
                <li>Password : 12345</li>
              </ul>
              User Role
              <ul>
                <li>Username : johnj3931@gmail.com </li>
                <li>Password : 12345</li>
              </ul>
            </div>
            <div>
              <h2>Main Features</h2>
              <ul>
                <li>
                  <b>Income & Expense Tracking:</b> Keep a detailed record of
                  all financial transactions, categorized for easy analysis.
                </li>
                <li>
                  <b>Cash Requests:</b> Short on funds? Submit a cash request
                  directly through the app and never halt your operations.
                </li>
                <li>
                  <b>Transaction Management:</b> Record expenses and income with
                  just a few taps, and maintain an accurate cash flow.
                </li>
                <li>
                  <b>Approval Workflow:</b> Managers can review and approve cash
                  requests swiftly, maintaining control over cash distribution.
                </li>
                <li>
                  <b>Account Creation:</b> New users can sign up within minutes
                  and start managing their petty cash immediately.
                </li>
                <li>
                  <b>Email Verification: </b>Enhance security with email
                  verification for new accounts, ensuring authorized access.
                </li>
                <li>
                  <b>User Management: </b>Admins have the power to deactivate or
                  delete user accounts, providing additional oversight.
                </li>
              </ul>
            </div>
            <div>
              <h2>Why Choose IMPREST-IVE?</h2>
              <p>
                At IMPREST-IVE, we understand the importance of having a
                reliable petty cash management system. Our application is built
                to cater to the dynamic needs of modern businesses, offering a
                user-friendly interface and robust features that make financial
                management a breeze.
              </p>
              <p>
                Join the multitude of satisfied users who have streamlined their
                petty cash management with IMPREST-IVE. Try our demo today and
                experience the difference!
              </p>
            </div>
            <div>
              <h2>Your Feedback Matters</h2>
              <p>
                At IMPREST-IVE, we are committed to continuous improvement and
                value your input. If you have suggestions on how we can enhance
                your experience or ideas for new features, please let us know.
                Your feedback drives our innovation.
              </p>
            </div>
            <div>
              <h2>Facing an Issue?</h2>
              <p>
                We understand that issues may arise, and we’re here to help. If
                you encounter any problems while using IMPREST-IVE, please reach
                out to our support team. We are dedicated to resolving your
                concerns promptly and ensuring the smooth operation of your
                petty cash management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default About;
