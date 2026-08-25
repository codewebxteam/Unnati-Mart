import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from '../assets/foundation/legacy/Logo.webp';

// Helper to convert image URL/path to base64 PNG
const getLogoBase64 = () => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = logoImg;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            try {
                resolve(canvas.toDataURL('image/png'));
            } catch (e) {
                resolve(null);
            }
        };
        img.onerror = () => {
            resolve(null);
        };
    });
};

export const downloadInvoice = async (order) => {
    if (!order) return;

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const logoBase64 = await getLogoBase64();
    const safeOrderId = String(order.id || order.orderId || order.firebaseId || 'UNKNOWN');

    // 1. Header background / Accent bar
    doc.setFillColor(26, 26, 26); // Dark Charcoal
    doc.rect(0, 0, 210, 8, 'F');

    // 2. Unnati Mart Logo / Title
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 15, 15, 20, 20);
    }
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(26, 26, 26);
    doc.text('UNNATI MART', 38, 25);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(115, 115, 115);
    doc.text('Your Trusted Grocery Partner', 38, 30);

    // 3. Invoice Header Meta on Right
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(217, 119, 6); // Amber color
    doc.text('TAX INVOICE', 145, 25);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(64, 64, 64);
    doc.text(`Invoice No: INV-${safeOrderId.slice(-8).toUpperCase()}`, 145, 32);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString('en-IN')}`, 145, 37);
    doc.text(`Status: Paid`, 145, 42);

    // 4. Divider Line
    doc.setDrawColor(229, 229, 229);
    doc.line(15, 48, 195, 48);

    // 5. Vendor vs Billing details
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 26);
    doc.text('Sold By:', 15, 56);
    doc.text('Bill To:', 110, 56);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(82, 82, 82);

    // Seller details
    doc.text('Unnati Mart Retail Private Limited', 15, 62);
    doc.text('Patna, Bihar, India', 15, 67);
    doc.text('Email: support@unnatimart.com', 15, 72);
    doc.text('GSTIN: 10AAAAA1111A1Z1', 15, 77);

    // Buyer details
    const address = order.address || order.shippingAddress || {};
    const fullName = order.fullName || address.fullName || order.customer || 'Customer';
    const mobile = order.mobile || address.mobile || 'N/A';
    const street = order.street || address.street || '';
    const locality = order.locality || address.locality || '';
    const city = order.city || address.city || '';
    const state = order.state || address.state || '';
    const pincode = order.pincode || address.pincode || '';

    doc.text(fullName, 110, 62);
    doc.text(`Phone: +91 ${mobile}`, 110, 67);
    doc.text(`${street}, ${locality}`, 110, 72, { maxWidth: 85 });
    doc.text(`${city}, ${state} - ${pincode}`, 110, 77);

    // 6. Table of Items
    const tableColumn = ["#", "Product Details", "Price", "Qty", "Total"];
    const tableRows = [];

    (order.items || []).forEach((item, index) => {
        const itemData = [
            index + 1,
            item.name,
            `INR ${item.price.toFixed(2)}`,
            item.quantity,
            `INR ${(item.price * item.quantity).toFixed(2)}`
        ];
        tableRows.push(itemData);
    });

    autoTable(doc, {
        startY: 87,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: {
            fillColor: [217, 119, 6], // Amber background
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [64, 64, 64]
        },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 95 },
            2: { cellWidth: 25 },
            3: { cellWidth: 20 },
            4: { cellWidth: 30, halign: 'right' }
        },
        margin: { left: 15, right: 15 }
    });

    // 7. Summary & Total Section
    let finalY = doc.lastAutoTable.finalY + 10;
    
    // Check page boundaries
    if (finalY > 240) {
        doc.addPage();
        finalY = 20;
    }

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 26);
    doc.text('Payment Information:', 15, finalY);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(82, 82, 82);
    doc.text(`Method: ${order.payment === 'online' ? 'Online Payment' : 'Cash on Delivery'}`, 15, finalY + 6);
    doc.text(`Payment Status: ${order.paymentStatus || 'Paid'}`, 15, finalY + 11);
    if (order.razorpayPaymentId) {
        doc.text(`Txn ID: ${order.razorpayPaymentId}`, 15, finalY + 16, { maxWidth: 85 });
    }

    // Right side Summary calculations
    const subtotal = order.subtotal || (order.grandTotal - (order.tax || 0));
    const tax = order.tax || 0;
    const shipping = 0; // Free
    const total = order.grandTotal || order.amount || 0;

    doc.setFont('Helvetica', 'normal');
    doc.text(`Subtotal:`, 130, finalY);
    doc.text(`INR ${subtotal.toFixed(2)}`, 195, finalY, { align: 'right' });

    doc.text(`GST & Taxes:`, 130, finalY + 6);
    doc.text(`INR ${tax.toFixed(2)}`, 195, finalY + 6, { align: 'right' });

    doc.text(`Delivery Fee:`, 130, finalY + 11);
    doc.text('FREE', 195, finalY + 11, { align: 'right' });

    // Accent line above total
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.5);
    doc.line(130, finalY + 15, 195, finalY + 15);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    doc.text(`Grand Total:`, 130, finalY + 21);
    doc.text(`INR ${total.toFixed(2)}`, 195, finalY + 21, { align: 'right' });

    // 8. Footer block
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(163, 163, 163);
    doc.text('This is a computer-generated invoice and does not require a physical signature.', 105, 280, { align: 'center' });
    doc.text('Thank you for shopping with Unnati Mart!', 105, 284, { align: 'center' });

    // Download file
    doc.save(`Invoice_${safeOrderId.slice(-8).toUpperCase()}.pdf`);
};
