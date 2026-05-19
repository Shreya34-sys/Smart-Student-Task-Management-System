import PDFDocument from "pdfkit";

export function streamTasksPdf(res, tasks) {
  const doc = new PDFDocument({ margin: 48 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=tasks.pdf");
  doc.pipe(res);

  doc.fontSize(20).text("Smart Student Tasks", { underline: true });
  doc.moveDown();

  tasks.forEach((task, index) => {
    doc.fontSize(13).text(`${index + 1}. ${task.title}`);
    doc.fontSize(10).text(`Subject: ${task.subject || "General"}`);
    doc.text(`Priority: ${task.priority} | Status: ${task.status}`);
    doc.text(`Due: ${new Date(task.dueDate).toLocaleDateString()}`);
    if (task.description) doc.text(`Notes: ${task.description}`);
    doc.moveDown();
  });

  doc.end();
}
