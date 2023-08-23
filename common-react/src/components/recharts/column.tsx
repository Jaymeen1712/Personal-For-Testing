import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ReColumnChartProps {
  // Define any props for the component here
}

const ReColumnChart: React.ForwardRefRenderFunction<HTMLDivElement, ReColumnChartProps> = (
  props,
  ref
) => {
  const data = [
    { name: "Category 1", value: 10 },
    { name: "Category 2", value: 15 },
    { name: "Category 3", value: 7 },
    { name: "Category 4", value: 8 },
    { name: "Category 5", value: 12 },
  ];

  return (
    <div ref={ref} className="column-recharts">
      <BarChart width={400} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default React.forwardRef<HTMLDivElement, ReColumnChartProps>(ReColumnChart);
