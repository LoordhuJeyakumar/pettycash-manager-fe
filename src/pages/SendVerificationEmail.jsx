import React from "react";
import SendEmail from "../components/SendEmail";
import NavBarSignup from "../components/NavBarSignup";
import { motion } from "framer-motion";

function SendVerificationEmail() {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
      <div className="d-flex justify-content-center">
        <NavBarSignup />
      </div>
      <div className="w-100 d-flex justify-content-center ">
        <div className="d-flex align-items-center  w-75 vh-100 justify-content-center ">
          <SendEmail />
        </div>
      </div>
    </motion.div>
  );
}

export default SendVerificationEmail;
