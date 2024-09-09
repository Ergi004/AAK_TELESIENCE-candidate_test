export const formatData = (data) => {
  if (response) {
    const yearData = Object.keys(response[0]);
    console.log(yearData);
    const month1Data = yearData[0]["01"];
    const month2Data = yearData[1]["02"];

    const transformData = (monthData, monthLabel) => {
      return monthData.map((entry) => {
        const dateKey = Object.keys(entry)[0];
        const value = entry[dateKey];
        const day = dateKey.split("/")[2].split(" , ")[0]; // Extract the day (e.g., '01' from '2024/01/01')
        return {
          date: day, // Only the day
          value: value,
          monthLabel: monthLabel,
        };
      });
    };

    const transformedMonth1 = transformData(month1Data, "Month 1");
    const transformedMonth2 = transformData(month2Data, "Month 2");

    // Combine categories and data (dates here represent only days now)
    const days = transformedMonth1.map((entry) => entry.date);
    const seriesData = [
      {
        label: "2024/01",
        data: transformedMonth1.map((entry) => entry.value),
      },
      {
        label: "2024/02",
        data: transformedMonth2.map((entry) => entry.value),
      },
    ];

    return { days, seriesData };
  }
};
