import jsPDF from 'jspdf';

// تأكدي من وجود كلمة export هنا
export const downloadReservationPDF = (reservationData) => {
    const doc = new jsPDF();

    // إعداد عنوان الإيصال
    doc.setFontSize(20);
    doc.text('Food Surplus - Reservierungsbeleg', 20, 20);

    doc.setFontSize(12);
    doc.text('----------------------------------------------------', 20, 30);

    // تفاصيل الحجز
    doc.text(`Reservierungs-ID: ${reservationData.id || 'N/A'}`, 20, 45);
    doc.text(`Essen / Artikel: ${reservationData.foodTitle || 'Lebensmittel'}`, 20, 55);
    doc.text(`Menge: ${reservationData.quantity || '1'}`, 20, 65);
    doc.text(`Datum: ${new Date().toLocaleDateString()}`, 20, 75);
    
    // ملاحظة خاصة بالاستلام
    doc.setFontSize(10);
    doc.text('Bitte zeigen Sie diesen Beleg bei der Abholung vor.', 20, 95);
    doc.text('Vielen Dank, dass Sie Lebensmittel retten!', 20, 105);

    // حفظ الملف وتنزيله تلقائياً
    doc.save(`Reservierung_${reservationData.id || 'beleg'}.pdf`);
};