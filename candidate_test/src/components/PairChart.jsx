import React, { useState, useEffect } from "react";
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
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="shadow-xl rounded-md flex flex-col bg-white max-md:overflow-x-scroll">
      <BarChart
        xAxis={[{ scaleType: "band", data: days }]}
        series={seriesData}
        width={600}
        height={300}
      />
    </div>
  );
};
