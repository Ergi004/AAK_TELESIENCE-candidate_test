import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { API } from "../services/api";

export const BarChartComponent = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [categories, setCategories] = useState([]);

  const getData = async () => {
    const response = await API();

    if (response) {
      let allTransformedData = [];
      let allDates = new Set();

      const transformData = (monthData, year, monthKey) => {
        return monthData.map((entry) => {
          const dateKey = Object.keys(entry)[0];
          const value = entry[dateKey];
          return {
            date: dateKey.split(" , ")[0],
            value: value,
            label: `${year}/${monthKey}`,
          };
        });
      };

      for (const yearObj of response) {
        const year = Object.keys(yearObj)[0];
        const yearData = Object.values(yearObj[year]);

        yearData.forEach((monthData) => {
          const monthKey = Object.keys(monthData)[0];
          const transformedMonthData = transformData(
            monthData[monthKey],
            year,
            monthKey
          );

          transformedMonthData.forEach((entry) => allDates.add(entry.date));

          allTransformedData.push({
            label: `${year}/${monthKey}`,
            data: transformedMonthData,
          });
        });
      }

      const sortedDates = [...allDates].sort();

      const finalSeriesData = allTransformedData.map((series) => {
        const lookup = Object.fromEntries(
          series.data.map((entry) => [entry.date, entry.value])
        );
        return {
          label: series.label,
          data: sortedDates.map((date) => lookup[date] || 0),
        };
      });

      setCategories(sortedDates);
      setSeriesData(finalSeriesData);
    }
  };

  return (
    <div className="shadow-xl rounded-md flex flex-col bg-white max-lg:overflow-x-scroll">
      <button
        onClick={() => {
          getData();
        }}
        className="px-5 py-2 shadow-xl rounded-md ml-auto mr-7 hover:bg-blue-700 mt-4 bg-blue-500 text-white transition-all duration-150"
      >
        Display Data
      </button>
      <BarChart
        xAxis={[{ scaleType: "band", data: categories }]}
        series={seriesData}
        width={750}
        height={300}
      />
    </div>
  );
};
