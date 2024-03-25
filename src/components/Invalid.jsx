import React from "react";
import SendEmail from "./SendEmail";
import { motion } from "framer-motion";

function Invalid() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="  m-5  p-5  infoContainer rounded-4 row"
    >
      <div className="d-flex flex-lg-column justify-content-center align-items-center col-12 col-md-6 col-lg-5">
        <h1 className="Verifying fw-bold position-absolut text-warning">
          Invalid Link!
        </h1>
        <lord-icon
          src="https://cdn.lordicon.com/ezjqphcn.json"
          trigger="in"
          delay="1500"
          state="in-reveal"
          style={{ width: "250px", height: "250px" }}
        ></lord-icon>
      </div>

      <SendEmail />
    </motion.div>
  );
}

export default Invalid;
