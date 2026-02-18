const PDFDocument = require('pdfkit');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

/**
 * Generate a shipping label PDF for a single order
 * @param {Object} order - Order object with shipping details
 * @returns {Promise<Buffer>} PDF buffer
 */
function generateShippingLabelPDF(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: [400, 300], // 4x3 inches (shipping label size)
        margins: { top: 10, bottom: 10, left: 10, right: 10 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text('SHIPPING LABEL', { align: 'center' })
         .moveDown(0.5);

      // Order Information
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text(`Order #${order.invoice}`, { align: 'left' })
         .font('Helvetica')
         .fontSize(9)
         .text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, { align: 'left' })
         .moveDown(0.5);

      // Shipping Address Section
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('SHIP TO:', { align: 'left' })
         .font('Helvetica')
         .fontSize(10)
         .text(order.name || '', { align: 'left' })
         .text(order.address || '', { align: 'left' })
         .text(`${order.city || ''}, ${order.zipCode || ''}`, { align: 'left' })
         .text(order.country || '', { align: 'left' })
         .moveDown(0.3)
         .text(`Phone: ${order.contact || ''}`, { align: 'left' })
         .text(`Email: ${order.email || ''}`, { align: 'left' })
         .moveDown(0.5);

      // Order Items Summary
      if (order.cart && order.cart.length > 0) {
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text('ITEMS:', { align: 'left' })
           .font('Helvetica')
           .fontSize(9);
        
        const totalQty = order.cart.reduce((sum, item) => sum + (item.orderQuantity || 0), 0);
        doc.text(`Total Items: ${totalQty}`, { align: 'left' });
        
        order.cart.forEach((item, index) => {
          if (index < 3) { // Show first 3 items
            doc.text(`- ${item.title || 'Item'} (Qty: ${item.orderQuantity || 0})`, { align: 'left' });
          }
        });
        if (order.cart.length > 3) {
          doc.text(`... and ${order.cart.length - 3} more item(s)`, { align: 'left' });
        }
        doc.moveDown(0.5);
      }

      // Footer
      doc.fontSize(8)
         .font('Helvetica')
         .text(`Status: ${order.status?.toUpperCase() || 'PENDING'}`, { align: 'left' })
         .text(`Payment: ${order.paymentMethod || 'N/A'}`, { align: 'left' })
         .moveDown(0.3)
         .fontSize(7)
         .text(`Order ID: ${order._id}`, { align: 'left' });

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
      zlib: { level: 9 } // Maximum compression
    });

    const buffers = [];
    archive.on('data', (data) => buffers.push(data));
    archive.on('end', () => {
      const zipBuffer = Buffer.concat(buffers);
      resolve(zipBuffer);
    });
    archive.on('error', reject);

    // Add each PDF to the ZIP
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
