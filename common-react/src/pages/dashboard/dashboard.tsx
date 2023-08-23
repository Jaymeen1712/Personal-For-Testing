import React, { useRef } from "react";
import { Button } from "antd";
import html2canvas from "html2canvas";
import ReColumnChart from "../../components/recharts/column";
import jsPDF from "jspdf";

const Dashboard = () => {
  const chartRef = useRef(null); // Create a ref for ReColumnChart

  const handleGeneratePDF = async () => {
    if (chartRef.current) {
      try {
        // Capture the screenshot using html2canvas
        const canvas = await html2canvas(chartRef.current);

        // Convert the canvas to an image URL
        const image = canvas.toDataURL("image/png");

        // Initialize a new jsPDF instance
        const pdf = new jsPDF("landscape", "px", "a4");

        // Add the image to the PDF
        pdf.addImage(image, "JPEG", 10, 10, 500, 300); // Adjust the coordinates and dimensions as needed
        pdf.addImage(image, "JPEG", 100, 100, 280, 150); // Adjust the coordinates and dimensions as needed

        // Save the PDF using FileSaver
        pdf.save("column_chart.pdf");
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <div>
      <ReColumnChart ref={chartRef} />
      <Button onClick={handleGeneratePDF}>Generate and Download Image</Button>
    </div>
  );
};

export default Dashboard;
