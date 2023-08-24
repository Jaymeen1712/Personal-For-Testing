import jsPDF from "jspdf";

const handleGeneratePDF = (
  orientation: "portrait" | "landscape" = "landscape",
  unit: "mm" | "cm" | "in" | "px" = "px",
  format: string = "a4"
): jsPDF => {
  const pdf = new jsPDF(orientation, unit, format);
  return pdf;
};

export default handleGeneratePDF;
