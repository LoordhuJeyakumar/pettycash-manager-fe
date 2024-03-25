import { AgChartsReact } from "ag-charts-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function LineChart() {
  const transactionState = useSelector((state) => state.transactions);
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  const [options, setOptions] = useState({
    theme: "ag-default-dark",
    title: {
      text: "Expense and income details",
    },
    data: data,
    series: [
      {
        type: "line",
        xKey: "date",
        yKey: "amount",
        yName: "Expense",
      },
      {
        type: "line",
        xKey: "date",
        yKey: "amount",
        yName: "Income",
      },
    ],
  });

  useEffect(() => {
    let { expense, income } = getDataDetails();
    setOptions((prevOptions) => ({
      ...prevOptions,
      series: [
        {
          type: "line",
          xKey: "date",
          yKey: "amount",
          yName: "Expense",
          data: expense,
          connectMissingData: true,
        },
        {
          type: "line",
          xKey: "date",
          yKey: "amount",
          yName: "Income",
          data: income,
          connectMissingData: true,
        },
      ],
    }));
  }, [transactionState.allTransactions]);
  function getDataDetails() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    let previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentMonthData = [];
    let previousMonthData = [];
    let expense = [];
    let income = [];

    transactionState?.allTransactions?.allTransactionsDetails?.forEach(
      (eachTrans) => {
        let transactionDate = new Date(eachTrans.createdAt);
        let isCurrentMonth =
          transactionDate.getFullYear() === currentYear &&
          transactionDate.getMonth() === currentMonth;
        let isPreviousMonth =
          transactionDate.getFullYear() === previousYear &&
          transactionDate.getMonth() === previousMonth;

        let isExpense = eachTrans.type === "expense";
        let isIncome = eachTrans.type === "income";

        if (isExpense || isIncome) {
          let dateString = transactionDate.toLocaleDateString();
          let newData = {
            date: dateString,
            amount: eachTrans.amount,
          };
          if (isExpense) {
            let existingItem = expense.find((item) => item.date === dateString);
            if (existingItem) {
              existingItem.amount += eachTrans.amount;
            } else {
              expense.push(newData);
            }
          } else {
            let existingItem = income.find((item) => item.date === dateString);
            if (existingItem) {
              existingItem.amount += eachTrans.amount;
            } else {
              income.push(newData);
            }
          }
        }
        if (isCurrentMonth || isPreviousMonth) {
          let dateString = transactionDate.toLocaleDateString();
          let dataItem = {
            date: dateString,
            amount: eachTrans.amount,
          };
          if (isCurrentMonth) {
            let existingItem = currentMonthData.find(
              (item) => item.date === dateString
            );
            if (existingItem) {
              existingItem.amount += eachTrans.amount;
            } else {
              currentMonthData.push(dataItem);
            }
          } else {
            let existingItem = previousMonthData.find(
              (item) => item.date === dateString
            );
            if (existingItem) {
              existingItem.amount += eachTrans.amount;
            } else {
              previousMonthData.push(dataItem);
            }
          }
        }
      }
    );
    setData({ expense, income });
    return { currentMonthData, previousMonthData, expense, income };
  }

  return (
    <div>
      <AgChartsReact options={options} ref={chartRef} />
    </div>
  );
}

export default LineChart;
