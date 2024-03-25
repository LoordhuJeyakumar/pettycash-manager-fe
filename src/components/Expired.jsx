import { motion } from "framer-motion";
import React from "react";
import SendEmail from "./SendEmail";

function Expired() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="  m-5  p-5  infoContainer rounded-4 row"
    >
      <div className="d-flex flex-column justify-content-center align-items-center col-12 col-md-12 col-lg-5 ">
        <h2 className="Verifying fw-bold position-absolut text-warning">
          Link Expired!
        </h2>
        <lord-icon
          src="https://cdn.lordicon.com/lzgqzxrq.json"
          trigger="in"
          delay="500"
          state="in-reveal"
          style={{ width: "250px", height: "250px" }}
        ></lord-icon>
      </div>
      <SendEmail />
    </motion.div>
  );
}

export default Expired;
