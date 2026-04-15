async function captureCanvas(targetElement) {
  if (!targetElement) {
    throw new Error("Target chart tidak ditemukan.");
  }

  const { default: html2canvas } = await import("html2canvas");

  return html2canvas(targetElement, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });
}

export async function exportElementToPng(targetElement, fileName) {
  const canvas = await captureCanvas(targetElement);
  const dataUrl = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

export async function exportElementToPdf(targetElement, fileName) {
  const canvas = await captureCanvas(targetElement);
  const imageData = canvas.toDataURL("image/png");
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 10;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;

  const imageWidth = canvas.width;
  const imageHeight = canvas.height;
  const ratio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);

  const renderWidth = imageWidth * ratio;
  const renderHeight = imageHeight * ratio;
  const offsetX = (pageWidth - renderWidth) / 2;
  const offsetY = (pageHeight - renderHeight) / 2;

  pdf.addImage(imageData, "PNG", offsetX, offsetY, renderWidth, renderHeight);
  pdf.save(fileName);
}
