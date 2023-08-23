import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const HighColumnChart = () => {
  const chartOptions = {
    chart: {
      type: "column",
    },
    title: {
      text: "Column Chart Example",
    },
    xAxis: {
      categories: [
        "Category 1",
        "Category 2",
        "Category 3",
        "Category 4",
        "Category 5",
      ],
    },
    yAxis: {
      title: {
        text: "Value",
      },
    },
    series: [
      {
        name: "Series 1",
        data: [10, 15, 7, 8, 12],
      },
    ],
  };

  return (
    <div id="column-chart-container">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default HighColumnChart;
