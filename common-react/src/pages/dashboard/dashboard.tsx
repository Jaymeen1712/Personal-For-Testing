// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import ReColumnChart from "../../components/recharts/column";
import handleGenerateImage from "../../utils/generate-image";
import handleGeneratePDF from "../../utils/generate-pdf";

const Dashboard = () => {
  const firstChartRef = useRef(null);
  const secondChartRef = useRef(null);
  const thirdChartRef = useRef(null);
  const [pdfOffset, setPdfOffset] = useState({ x: 20, y: 20 });
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    const newPdf = handleGeneratePDF();
    setPdf(newPdf);
  }, []);

  const handleAddImageToPdf = async (chartRef) => {
    if (pdf && chartRef.current) {
      const { image, width, height } = await handleGenerateImage(chartRef);
      const pdfWidth = 210;
      const scaleFactor = pdfWidth / width;
      const scaledWidth = width * scaleFactor;
      const scaledHeight = height * scaleFactor;

      pdf.addImage(
        image,
        "JPEG",
        pdfOffset.x,
        pdfOffset.y,
        scaledWidth,
        scaledHeight
      );
      setPdfOffset((prev) => ({ ...prev, y: prev.y + scaledHeight + 10 }));
    }
  };

  return (
    <div>
      <ReColumnChart ref={firstChartRef} />
      <Button onClick={() => handleAddImageToPdf(firstChartRef)}>
        add into pdf
      </Button>
      <ReColumnChart ref={secondChartRef} />
      <Button onClick={() => handleAddImageToPdf(secondChartRef)}>
        add into pdf
      </Button>
      <ReColumnChart ref={thirdChartRef} />
      <Button onClick={() => handleAddImageToPdf(thirdChartRef)}>
        add into pdf
      </Button>
      <Button onClick={() => pdf && pdf.save("column_chart.pdf")}>
        Generate PDF
      </Button>
    </div>
  );
};

export default Dashboard;
