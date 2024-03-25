import React from "react";

function Verifying() {
  return (
    <div className="d-flex  m-5  p-5 justify-content-center align-items-center infoContainer rounded-4">
      <h2 className="Verifying fw-bold position-absolute text-info">
        Verifying....
      </h2>

      <lord-icon
        src="https://cdn.lordicon.com/unukghxb.json"
        trigger="loop"
        state="loop-spin"
        colors="primary:#1d8cf8,secondary:#e91e63"
        style={{ width: "350px", height: "350px" }}
      ></lord-icon>
    </div>
  );
}

export default Verifying;
