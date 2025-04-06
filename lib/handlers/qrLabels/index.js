
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import {randomUUID} from 'crypto';

// DIN-A4 dimensions in points (1cm = 28.35 points)
const cm = 28.35; // points per cm
const A4_WIDTH = 21 * cm;
const A4_HEIGHT = 29.7 * cm
const QR_SIZE = 3 * cm
const PADDING = .8 * cm;

// Calculate grid layout
const qrPerRow = Math.floor((A4_WIDTH - PADDING) / (QR_SIZE + PADDING));
const qrPerCol = Math.floor((A4_HEIGHT - PADDING) / (QR_SIZE + PADDING));
const qrPerPage = qrPerRow * qrPerCol;

const qrLabels_handler = async (req, res) => {

    try {
        // Parameters accepted by this handler
        const {
            list,           // list name
        } = req.params;
        const {
            pages = 1,      // number of pages to generate
        } = req.query;

        // baseUrl and (Sibling) path calculation
        const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl;

        // Filename generation
        const filename = `labels-${list}-${(new Date()).toISOString()}.pdf`;

        console.log({
            baseUrl,
            list,
            pages,
            filename,
        });

        // UUID driven QR links
        const qrData = Array.from({ length: pages * qrPerPage }, () => 
            `${baseUrl}/${list}/${randomUUID()}`
        );

        // Initialize PDF
        const doc = new PDFDocument({ size: 'A4', margin: 0 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);

        // Generate QR codes and place them on pages
        for (let i = 0; i < qrData.length; i++) {
            // Start new page if needed
            if (i > 0 && i % qrPerPage === 0) {
                doc.addPage();
            }

            // Calculate position
            const pageIndex = i % qrPerPage;
            const row = Math.floor(pageIndex / qrPerRow);
            const col = pageIndex % qrPerRow;
            const x = PADDING + col * (QR_SIZE + PADDING);
            const y = PADDING + row * (QR_SIZE + PADDING);

            // Generate QR code as buffer
            const qrBuffer = await QRCode.toBuffer(qrData[i], {
                width: QR_SIZE,
                margin: 1
            });

            // Add QR code to PDF
            doc.image(qrBuffer, x, y, { width: QR_SIZE });
        }

        // Finalize PDF
        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating PDF');
    }
};

export default qrLabels_handler;

