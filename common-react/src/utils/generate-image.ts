import html2canvas from "html2canvas";

const handleGenerateImage = async (ref: React.RefObject<HTMLElement>) => {
  if (ref.current) {
    try {
      const canvas = await html2canvas(ref.current);
      const image = canvas.toDataURL("image/png");

      return { image, width: canvas.width, height: canvas.height };
    } catch (error) {
      console.error("Error generating image:", error);
    }
  }
};

export default handleGenerateImage;
