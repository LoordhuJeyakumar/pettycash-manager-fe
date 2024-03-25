import { AgChartsReact } from "ag-charts-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ChartPie() {
  const accountsState = useSelector((state) => state.account);
  const [accountDetails, setAccountDetails] = useState([]);
  const [options, setOptions] = useState({
    theme: "ag-default-dark",
    data: accountsState.accountDetails || accountDetails,

    series: [
      {
        type: "pie",

        angleKey: "clossingBalance",
        calloutLabelKey: "acc_Name",
        sectorLabelKey: "clossingBalance",
        sectorLabel: {
          color: "white",
          fontWeight: "bold",
          formatter: ({ value }) => `₹${(value / 1000).toFixed(0)}K`,
        },
      },
    ],
  });

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      data: accountsState.accountDetails,
    }));
    getAccountData();
  }, [accountsState.accountDetails]);

  const getAccountData = () => {
    let accountArr = [];
    if (accountsState.accountDetails.length) {
      accountsState.accountDetails.forEach((each) => {
        let name = each.acc_Name;
        let clossingBalance = each.clossingBalance;
        let obj = {
          asset: name,
          amount: clossingBalance,
        };

        accountArr.push(obj);
      });
    }
    setAccountDetails(accountArr);
  };

  return (
    <div className="text-white">
      <AgChartsReact options={options} />
    </div>
  );
}

export default ChartPie;
