// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import ReColumnChart from "../../../components/recharts/column";
import handleGenerateImage from "../../../utils/generate-image";
import handleGeneratePDF from "../../../utils/generate-pdf";

const DownloadPDFUsingHtml2CanvasAndJsPdf = () => {
  const chartRefs = [useRef(null), useRef(null), useRef(null)];
  const [pdf, setPdf] = useState(null);
  const [pdfOffset, setPdfOffset] = useState({ x: 20, y: 20 });
  const pdfWidth = 595; // A4 width in points
  const pdfHeight = 842; // A4 height in points
  const verticalPadding = 10; // Vertical padding between content and page edge

  useEffect(() => {
    const newPdf = handleGeneratePDF();
    setPdf(newPdf);
  }, []);

  const handleAddImageToPdf = async (chartRef) => {
    if (pdf && chartRef.current) {
      const { image, width, height } = await handleGenerateImage(chartRef);
      const scaleFactor = pdfWidth / width;
      const scaledWidth = width * scaleFactor;
      const scaledHeight = height * scaleFactor;

      const availableHeight = pdfHeight - pdfOffset.y - verticalPadding;

      if (scaledHeight > availableHeight) {
        // Add a new page
        pdf.addPage();
        setPdfOffset({ x: 20, y: verticalPadding });
      }

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

  const generatePDF = () => {
    if (pdf) {
      pdf.save("column_charts.pdf");
    }
  };

  return (
    <div>
      {chartRefs.map((chartRef, index) => (
        <div key={index}>
          <ReColumnChart ref={chartRef} />
          <Button onClick={() => handleAddImageToPdf(chartRef)}>
            Add into PDF
          </Button>
        </div>
      ))}
      <Button onClick={generatePDF}>Generate PDF</Button>
    </div>
  );
};

export default DownloadPDFUsingHtml2CanvasAndJsPdf;
