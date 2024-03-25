import React, { useState } from "react";
import SideNav from "./SideNav";
import NavBarTop from "./NavBarTop";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function MainWrapper({ children }) {
  const [sideNavShow, setSideNavShow] = useState(false);
  return (
    <div>
      <div
        className={
          sideNavShow
            ? "g-sidenav-show g-sidenav-pinned bg-gray-200 dark-version"
            : "g-sidenav-show bg-gray-200 dark-version"
        }
      >
        <SideNav />
        <div className="main-content position-relative max-height-vh-100 h-100 border-radius-lg  ">
          <NavBarTop
            sideNavShow={sideNavShow}
            setSideNavShow={setSideNavShow}
          />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            {children}
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default MainWrapper;
