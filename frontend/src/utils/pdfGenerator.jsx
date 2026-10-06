import jsPDF from 'jspdf';

export const downloadReservationPDF = (receipt) => {
  const doc = new jsPDF();

  // تنسيق التاريخ بأسلوب قياسي يمنع الانقلاب (DD.MM.YYYY)
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  // عنوان الوثيقة
  doc.setFontSize(18);
  doc.text('Food Surplus - Reservierungsbeleg', 20, 20);

  // خط فاصل
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  // تفاصيل الحجز
  doc.setFontSize(12);
  doc.text(`Reservierungs-ID: ${receipt.id || 'N/A'}`, 20, 40);
  doc.text(`Essen / Artikel: ${receipt.foodTitle || 'Lebensmittel'}`, 20, 50);
  doc.text(`Menge: ${receipt.quantity || 1}`, 20, 60);

  // طباعة التاريخ المنسق
  doc.text(`Datum: ${formattedDate}`, 20, 70);

  if (receipt.totalPrice !== undefined) {
    doc.text(`Gesamtsumme: ${parseFloat(receipt.totalPrice).toFixed(2)} €`, 20, 80);
  }

  if (receipt.paymentMethod) {
    doc.text(`Zahlungsmethode: ${receipt.paymentMethod}`, 20, 90);
  }

  // ملاحظة ختامية
  doc.setFontSize(10);
  doc.text('Bitte zeigen Sie diesen Beleg bei der Abholung vor.', 20, 110);
  doc.text('Vielen Dank, dass Sie Lebensmittel retten!', 20, 120);

  // حفظ الملف
  doc.save(`Beleg_${receipt.id || 'reservierung'}.pdf`);
};