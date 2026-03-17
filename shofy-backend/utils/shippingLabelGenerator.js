const PDFDocument = require('pdfkit');
const archiver = require('archiver');
const bwipjs = require('bwip-js');

/**
 * Generate a shipping label PDF for a single order
 * @param {Object} order - Order object with shipping details
 * @returns {Promise<Buffer>} PDF buffer
 */
function generateShippingLabelPDF(order) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [400, 450],
        margins: { top: 15, bottom: 15, left: 15, right: 15 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // --- Header Banner ---
      const width = doc.page.width - 30;
      doc.rect(15, 15, width, 35)
        .fill('#000000');

      doc.fillColor('#ffffff')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('LOOKFAME SHIPPING LABEL', 15, 27, { align: 'center', width: width });

      // --- Order Info Row ---
      doc.fillColor('#000000')
        .moveDown(2);

      const startY = 65;
      const displayOrderId = order.orderId ? String(order.orderId).replace(/-/g, '') : String(order.invoice);
      doc.fontSize(8).font('Helvetica-Bold').text('ORDER ID:', 15, startY);
      doc.fontSize(10).text(displayOrderId, 15, startY + 10);

      doc.fontSize(8).text('DATE:', 150, startY);
      doc.fontSize(10).font('Helvetica').text(`${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, 150, startY + 10);

      const paymentMethod = order.paymentMethod?.toUpperCase() || 'N/A';
      const codStatus = paymentMethod === 'COD' ? `COD - ₹${(order.totalAmount || 0).toFixed(2)}` : 'PREPAID';

      doc.fontSize(8).font('Helvetica-Bold').text('PAYMENT:', 280, startY);
      doc.fontSize(10).text(codStatus, 280, startY + 10);

      // Separator Line - Fixed method chaining
      doc.strokeColor('#cccccc');
      doc.dash(2, { space: 2 });
      doc.moveTo(15, startY + 25).lineTo(385, startY + 25).stroke();
      doc.undash();

      // --- Main Sections (Boxes) ---
      const boxY = startY + 35;
      const boxWidth = (width / 2) - 5;
      const boxHeight = 130;

      // Delivery Information Box
      doc.strokeColor('#000000')
        .rect(15, boxY, boxWidth, boxHeight)
        .stroke();

      doc.rect(15, boxY, 100, 15).fill('#000000');
      doc.fillColor('#ffffff').fontSize(7).text('DELIVERY INFO', 20, boxY + 5);

      doc.fillColor('#000000')
        .fontSize(10).font('Helvetica-Bold').text(order.name || '', 20, boxY + 20)
        .fontSize(8).font('Helvetica').text(order.address || '', 20, boxY + 35, { width: boxWidth - 10 })
        .moveDown(0.2)
        .text(`${order.city || ''}, ${order.zipCode || ''}`, { width: boxWidth - 10 })
        .text(order.country || '')
        .moveDown(0.5)
        .font('Helvetica-Bold').text(`Phone: ${order.contact || ''}`)
        .font('Helvetica').fontSize(7).text(order.email || '', { width: boxWidth - 10 });

      // Right Side Containers
      const rightX = 15 + boxWidth + 10;
      const smallBoxHeight = 45;

      // Tracking box
      doc.rect(rightX, boxY, boxWidth, smallBoxHeight).stroke();
      doc.rect(rightX, boxY, 60, 12).fill('#000000');
      doc.fillColor('#ffffff').fontSize(6).text('TRACKING', rightX + 5, boxY + 3);

      doc.fillColor('#000000')
        .fontSize(7).font('Helvetica').text('Scan for status updates', rightX + 5, boxY + 15)
        .fontSize(6).font('Helvetica-Bold').text(order._id, rightX + 5, boxY + 28);

      // QR Code Integration - Reduced size to "Medium" (30 instead of 38)
      try {
        const qrBuffer = await bwipjs.toBuffer({
          bcid: 'qrcode',
          text: `https://lookfame.com/track-order/${order._id}`,
          scale: 2,
        });
        doc.image(qrBuffer, rightX + boxWidth - 35, boxY + 7, { width: 30, height: 30 });
      } catch (err) {
        console.error('QR generation failed:', err);
      }

      // Item Summary box
      const itemBoxY = boxY + smallBoxHeight + 10;
      const itemBoxHeight = boxHeight - smallBoxHeight - 10;
      doc.rect(rightX, itemBoxY, boxWidth, itemBoxHeight).stroke();
      doc.rect(rightX, itemBoxY, 70, 12).fill('#000000');
      doc.fillColor('#ffffff').fontSize(7).text('ITEM SUMMARY', rightX + 5, itemBoxY + 3);

      doc.fillColor('#000000').fontSize(8).font('Helvetica-Bold');
      const totalQty = (order.cart || []).reduce((sum, item) => sum + (item.orderQuantity || 0), 0);
      doc.text(`Total Items: ${totalQty}`, rightX + 5, itemBoxY + 18);

      let itemY = itemBoxY + 30;
      (order.cart || []).slice(0, 3).forEach((item) => {
        doc.fontSize(7).font('Helvetica').text(`${item.title?.substring(0, 25)}...`, rightX + 5, itemY);
        doc.text(`x${item.orderQuantity}`, rightX + boxWidth - 20, itemY);
        itemY += 10;
      });

      // --- Footer Barcode Area ---
      const footerY = boxY + boxHeight + 20;
      doc.moveTo(15, footerY)
        .lineTo(385, footerY)
        .strokeColor('#000000')
        .stroke();

      // Barcode uses same Order ID as top of label
      try {
        const barcodeBuffer = await bwipjs.toBuffer({
          bcid: 'code128',
          text: displayOrderId,
          scale: 2,
          height: 10,
          includetext: true,
          textxalign: 'center',
        });
        doc.image(barcodeBuffer, (400 - 150) / 2, footerY + 10, { width: 150, height: 40 });
      } catch (err) {
        console.error('Barcode generation failed:', err);
        doc.fontSize(10).font('Helvetica-Bold').text(`*${displayOrderId}*`, 15, footerY + 15, { align: 'center', width: width });
      }

      doc.fontSize(7).font('Helvetica').text('LOOKFAME SHIPPING SERVICES', 15, footerY + 60, { align: 'center', width: width });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate ZIP file containing multiple shipping label PDFs
 * @param {Array<Buffer>} pdfBuffers - Array of PDF buffers
 * @param {Array<string>} orderIds - Array of order IDs for filenames
 * @returns {Promise<Buffer>} ZIP buffer
 */
function generateShippingLabelsZIP(pdfBuffers, orderIds) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const buffers = [];
    archive.on('data', (data) => buffers.push(data));
    archive.on('end', () => {
      const zipBuffer = Buffer.concat(buffers);
      resolve(zipBuffer);
    });
    archive.on('error', reject);

    pdfBuffers.forEach((pdfBuffer, index) => {
      const orderId = orderIds[index] || `order-${index + 1}`;
      archive.append(pdfBuffer, { name: `shipping-label-${orderId}.pdf` });
    });

    archive.finalize();
  });
}

module.exports = {
  generateShippingLabelPDF,
  generateShippingLabelsZIP,
};
