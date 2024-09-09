import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { API } from "../services/api";

export const PairChartComponent = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [days, setDays] = useState([]);

  const getData = async () => {
    const response = await API();

    if (response) {
      let pairedSeries = [];
      let allDays = new Set();

      const transformData = (monthData, monthLabel, year) => {
        return monthData.map((entry) => {
          const dateKey = Object.keys(entry)[0];
          const value = entry[dateKey];
          const day = dateKey.split("/")[2].split(" , ")[0];
          return {
            date: day,
            value: value,
            label: `${year}/${monthLabel}`,
          };
        });
      };

      for (const yearObj of response) {
        const year = Object.keys(yearObj)[0];
        const yearData = Object.values(yearObj[year]);

        for (let i = 0; i < yearData.length; i++) {
          const month = yearData[i];
          const monthLabel = Object.keys(month)[0];
          const transformedMonth = transformData(
            month[monthLabel],
            monthLabel,
            year
          );

          transformedMonth.forEach((entry) => allDays.add(entry.date));

          pairedSeries.push({
            label: `${year}/${monthLabel}`,
            data: transformedMonth.map((entry) => entry.value),
          });
        }
      }

      const sortedDays = [...allDays].sort((a, b) => a - b);

      const dynamicSeriesData = pairedSeries.map((series) => {
        const lookup = Object.fromEntries(
          series.data.map((entry, index) => [sortedDays[index], entry])
        );
        return {
          label: series.label,
          data: sortedDays.map((date) => lookup[date] || 0),
        };
      });

      setDays(sortedDays);
      setSeriesData(dynamicSeriesData);
    }
  };

  return (
    <div className="shadow-xl rounded-md flex flex-col bg-white max-md:overflow-x-scroll">
      <button
        onClick={() => {
          getData();
        }}
        className="px-5 py-2 shadow-xl rounded-md ml-auto mr-7 hover:bg-blue-700 mt-4 bg-blue-500 text-white transition-all duration-150"
      >
        Display Data
      </button>
      <BarChart
        xAxis={[{ scaleType: "band", data: days }]}
        series={seriesData}
        width={600}
        height={300}
      />
    </div>
  );
};
