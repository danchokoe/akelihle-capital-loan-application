import PDFDocument from 'pdfkit';
import { LoanApplication } from '@prisma/client';

export const generateContract = async (application: LoanApplication): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header
      doc.fontSize(20).text('AKELIHLE CAPITAL', 50, 50);
      doc.fontSize(16).text('LOAN AGREEMENT CONTRACT', 50, 80);
      doc.moveDown();

      // Contract details
      doc.fontSize(12);
      doc.text(`Contract ID: ${application.id}`, 50, 120);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 140);
      doc.moveDown();

      // Borrower information
      doc.fontSize(14).text('BORROWER INFORMATION', 50, 180);
      doc.fontSize(12);
      doc.text(`Name: ${application.firstName} ${application.lastName}`, 50, 200);
      doc.text(`Email: ${application.email}`, 50, 220);
      doc.text(`Phone: ${application.phone}`, 50, 240);
      doc.text(`Employment Status: ${application.employmentStatus}`, 50, 260);
      doc.text(`Monthly Income: R${application.monthlyIncome.toLocaleString()}`, 50, 280);
      doc.moveDown();

      // Loan details
      doc.fontSize(14).text('LOAN DETAILS', 50, 320);
      doc.fontSize(12);
      doc.text(`Loan Amount: R${application.loanAmount.toLocaleString()}`, 50, 340);
      doc.text(`Loan Term: ${application.loanTerm} days`, 50, 360);
      doc.text(`Interest Rate: ${(application.interestRate * 100).toFixed(1)}%`, 50, 380);
      doc.text(`Repayment Fee: R${application.repaymentFee.toLocaleString()}`, 50, 400);
      doc.text(`Total Repayment: R${application.totalRepayment.toLocaleString()}`, 50, 420);
      doc.moveDown();

      // Terms and conditions
      doc.fontSize(14).text('TERMS AND CONDITIONS', 50, 460);
      doc.fontSize(10);
      
      const terms = [
        '1. The borrower agrees to repay the full loan amount plus interest and fees within the specified term.',
        '2. Late payments may incur additional penalties as per company policy.',
        '3. The borrower has provided accurate information and supporting documents.',
        '4. This agreement is governed by South African law.',
        '5. Any disputes will be resolved through the appropriate legal channels.',
        '6. The lender reserves the right to take legal action for non-payment.',
        '7. The borrower acknowledges receipt of this contract and agrees to all terms.'
      ];

      let yPosition = 480;
      terms.forEach(term => {
        doc.text(term, 50, yPosition, { width: 500 });
        yPosition += 25;
      });

      // Signatures
      doc.fontSize(12);
      doc.text('BORROWER SIGNATURE: _________________________', 50, yPosition + 40);
      doc.text(`${application.firstName} ${application.lastName}`, 50, yPosition + 60);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, yPosition + 80);

      doc.text('LENDER SIGNATURE: _________________________', 300, yPosition + 40);
      doc.text('Akelihle Capital Representative', 300, yPosition + 60);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 300, yPosition + 80);

      // Footer
      doc.fontSize(8);
      doc.text('This is a digitally generated contract. For queries, contact support@akelihlecap.co.za', 50, yPosition + 120);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};