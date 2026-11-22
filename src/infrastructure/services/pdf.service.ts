import { IPdfService, PdfParties } from '@application/interfaces/services/pdf.service.interface';
import { AgreementEntity } from '@core/entities/agreement.entity';
import PDFDocument from 'pdfkit';

export class PdfService implements IPdfService {
    generateRentalAgreement(agreement: AgreementEntity, parties: PdfParties): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 60, size: 'A4' });
                const chunks: Buffer[] = [];

                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));

                const primaryColor = '#4F46E5';
                const lightGray = '#F3F4F6';
                const textGray = '#6B7280';
                const darkText = '#111827';

                const pageWidth = doc.page.width - 120;

                // ── Mock Indian Stamp Paper Header ────────────────────────────
                doc.rect(40, 40, doc.page.width - 80, 150).stroke('#6B7280');
                doc.rect(45, 45, doc.page.width - 90, 140).stroke('#6B7280');

                doc.fillColor('#111827')
                    .fontSize(16)
                    .font('Helvetica-Bold')
                    .text('INDIA NON JUDICIAL', 0, 55, { align: 'center' });
                
                doc.fontSize(12)
                    .font('Helvetica')
                    .text('Government of India', { align: 'center' });
                
                doc.moveDown(0.5);
                doc.fontSize(14)
                    .font('Helvetica-Bold')
                    .text('e-Stamp', { align: 'center' });

                const stampY = doc.y + 10;
                doc.fontSize(10)
                    .font('Helvetica-Bold')
                    .text('Certificate No.', 60, stampY)
                    .font('Helvetica')
                    .text(`: IN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, 180, stampY);
                
                doc.font('Helvetica-Bold')
                    .text('Certificate Issued Date', 60, stampY + 15)
                    .font('Helvetica')
                    .text(`: ${new Date().toLocaleDateString('en-IN')}`, 180, stampY + 15);
                
                doc.font('Helvetica-Bold')
                    .text('Stamp Duty Amount', 60, stampY + 30)
                    .font('Helvetica')
                    .text(': Rs. 20 (Rupees Twenty Only)', 180, stampY + 30);

                doc.y = stampY + 60;
                doc.moveDown(2);

                doc.fillColor(primaryColor)
                    .fontSize(18)
                    .font('Helvetica-Bold')
                    .text('RENTAL AGREEMENT', 60, doc.y, { align: 'center' });
                
                doc.moveDown(2);

                // ── Agreement meta row ───────────────────────────────────────
                doc.fillColor(darkText)
                    .fontSize(11)
                    .font('Helvetica-Bold')
                    .text('Agreement Number:', 60, doc.y)
                    .font('Helvetica')
                    .text(agreement.agreementNumber, 200, doc.y - 11);

                doc.moveDown(0.4);

                doc.font('Helvetica-Bold')
                    .text('Status:', 60)
                    .font('Helvetica')
                    .text(agreement.status.replace(/_/g, ' '), 200, doc.y - 11);

                doc.moveDown(0.4);

                doc.font('Helvetica-Bold')
                    .text('Generated:', 60)
                    .font('Helvetica')
                    .text(new Date().toLocaleDateString('en-IN'), 200, doc.y - 11);

                doc.moveDown(1.5);

                // ── Section helper ───────────────────────────────────────────
                const sectionHeader = (title: string) => {
                    doc.rect(60, doc.y, pageWidth, 22).fill(primaryColor);
                    doc.fillColor('#FFFFFF')
                        .fontSize(10)
                        .font('Helvetica-Bold')
                        .text(title.toUpperCase(), 68, doc.y - 17);
                    doc.moveDown(1);
                };

                const row = (label: string, value: string, y?: number) => {
                    const rowY = y ?? doc.y;
                    doc.fillColor(textGray)
                        .fontSize(9)
                        .font('Helvetica-Bold')
                        .text(label, 68, rowY, { width: 150 });
                    doc.fillColor(darkText)
                        .font('Helvetica')
                        .text(value || 'N/A', 225, rowY, { width: pageWidth - 165 });
                    doc.moveDown(0.55);
                };

                // ── Property ─────────────────────────────────────────────────
                sectionHeader('Property Details');
                row('Property Name', parties.propertyTitle);
                row('Address', parties.propertyAddress);
                doc.moveDown(0.5);

                // ── Parties ──────────────────────────────────────────────────
                sectionHeader('Parties to the Agreement');

                // Owner sub-heading
                doc.fillColor(primaryColor)
                    .fontSize(9)
                    .font('Helvetica-Bold')
                    .text('OWNER (LESSOR)', 68, doc.y);
                doc.moveDown(0.4);
                row('Full Name', parties.ownerName);
                row('Email', parties.ownerEmail);
                row('Phone', parties.ownerPhone);
                doc.moveDown(0.3);

                // Tenant sub-heading
                doc.fillColor(primaryColor)
                    .fontSize(9)
                    .font('Helvetica-Bold')
                    .text('TENANT (LESSEE)', 68, doc.y);
                doc.moveDown(0.4);
                row('Full Name', parties.tenantName);
                row('Email', parties.tenantEmail);
                row('Phone', parties.tenantPhone);
                doc.moveDown(0.5);

                // ── Tenancy Period ───────────────────────────────────────────
                sectionHeader('Tenancy Period');
                row('Start Date', new Date(agreement.startDate).toLocaleDateString('en-IN'));
                row('End Date', new Date(agreement.endDate).toLocaleDateString('en-IN'));
                row('Lock-in Period', `${agreement.lockInPeriodMonths} months`);
                row('Notice Period', `${agreement.noticePeriodMonths} months`);
                doc.moveDown(0.5);

                // ── Financial Terms ──────────────────────────────────────────
                sectionHeader('Financial Terms');
                row('Monthly Rent', `Rs. ${agreement.monthlyRent.toLocaleString('en-IN')}`);
                row('Security Deposit', `Rs. ${agreement.depositAmount.toLocaleString('en-IN')}`);
                row(
                    'Maintenance Charges',
                    agreement.maintenanceIncluded
                        ? 'Included in rent'
                        : `Rs. ${agreement.maintenanceCharges.toLocaleString('en-IN')} / month`,
                );
                row('Late Fee per Day', `Rs. ${agreement.lateFeePerDay.toLocaleString('en-IN')}`);
                row('Late Fee Grace Period', `${agreement.lateFeeGracePeriodDays} days`);
                row('Annual Rent Escalation', `${agreement.rentEscalationPercentage}%`);
                doc.moveDown(0.5);

                // ── Terms & Conditions ───────────────────────────────────────
                sectionHeader('Terms and Conditions');
                if (Array.isArray(agreement.termsAndConditions)) {
                    agreement.termsAndConditions.forEach((term: unknown, index: number) => {
                        const termObj = term as { text?: string };
                        const text = termObj?.text || String(term);
                        doc.fillColor(darkText)
                            .fontSize(9)
                            .font('Helvetica')
                            .text(`${index + 1}.  ${text}`, 68, doc.y, {
                                width: pageWidth - 8,
                                lineGap: 2,
                            });
                        doc.moveDown(0.3);
                    });
                }
                doc.moveDown(0.3);

                if (agreement.customClauses) {
                    doc.fillColor(primaryColor)
                        .fontSize(9)
                        .font('Helvetica-Bold')
                        .text('CUSTOM CLAUSES', 68, doc.y);
                    doc.moveDown(0.3);
                    doc.fillColor(darkText)
                        .font('Helvetica')
                        .fontSize(9)
                        .text(agreement.customClauses, 68, doc.y, {
                            width: pageWidth - 8,
                            lineGap: 2,
                        });
                    doc.moveDown(0.5);
                }

                if (agreement.tenantRemarks) {
                    doc.fillColor(primaryColor)
                        .fontSize(9)
                        .font('Helvetica-Bold')
                        .text('TENANT REMARKS', 68, doc.y);
                    doc.moveDown(0.3);
                    doc.fillColor(darkText)
                        .font('Helvetica')
                        .fontSize(9)
                        .text(agreement.tenantRemarks, 68, doc.y, {
                            width: pageWidth - 8,
                            lineGap: 2,
                        });
                    doc.moveDown(0.5);
                }

                // ── Payment Details Breakdown ──────────────────────────────────
                sectionHeader('Payment Details Breakdown');
                row('First Month Rent', `Rs. ${agreement.monthlyRent.toLocaleString('en-IN')}`);
                row('Security Deposit', `Rs. ${agreement.depositAmount.toLocaleString('en-IN')}`);
                const totalMoveIn = agreement.monthlyRent + agreement.depositAmount;
                row('Total Move-in Amount', `Rs. ${totalMoveIn.toLocaleString('en-IN')}`);
                doc.moveDown(0.5);

                // ── Signatures ───────────────────────────────────────────────
                sectionHeader('Signatures');

                const sigColWidth = (pageWidth - 20) / 2;
                const startSigY = doc.y;

                // Owner signature block
                doc.rect(68, startSigY, sigColWidth, 75).fill(lightGray);
                doc.fillColor(textGray)
                    .fontSize(8)
                    .font('Helvetica-Bold')
                    .text('OWNER / LESSOR', 76, startSigY + 8);
                doc.fillColor(darkText)
                    .font('Helvetica')
                    .fontSize(9)
                    .text('Signed Electronically', 76, startSigY + 24);
                doc.fillColor(textGray)
                    .fontSize(8)
                    .text(
                        `Date: ${agreement.ownerSignedAt ? new Date(agreement.ownerSignedAt).toLocaleDateString('en-IN') : 'N/A'}`,
                        76,
                        startSigY + 38,
                    );
                doc.fillColor(darkText)
                    .fontSize(8)
                    .font('Helvetica-Bold')
                    .text(parties.ownerName, 76, startSigY + 50);

                // Tenant signature block
                const tenantSigX = 68 + sigColWidth + 20;
                doc.rect(tenantSigX, startSigY, sigColWidth, 75).fill(lightGray);
                doc.fillColor(textGray)
                    .fontSize(8)
                    .font('Helvetica-Bold')
                    .text('TENANT / LESSEE', tenantSigX + 8, startSigY + 8);
                doc.fillColor(darkText)
                    .font('Helvetica')
                    .fontSize(9)
                    .text('Signed Electronically', tenantSigX + 8, startSigY + 24);
                doc.fillColor(textGray)
                    .fontSize(8)
                    .text(
                        `Date: ${agreement.tenantSignedAt ? new Date(agreement.tenantSignedAt).toLocaleDateString('en-IN') : 'N/A'}`,
                        tenantSigX + 8,
                        startSigY + 38,
                    );
                doc.fillColor(darkText)
                    .fontSize(8)
                    .font('Helvetica-Bold')
                    .text(parties.tenantName, tenantSigX + 8, startSigY + 50);

                doc.y = startSigY + 85;

                doc.moveDown(1.5);

                // ── Footer ───────────────────────────────────────────────────
                doc.moveTo(60, doc.y)
                    .lineTo(60 + pageWidth, doc.y)
                    .strokeColor('#E5E7EB')
                    .stroke();
                doc.moveDown(0.5);
                doc.fillColor(textGray)
                    .fontSize(8)
                    .font('Helvetica')
                    .text(
                        `This document is a legally binding rental agreement generated by the RentEase platform. Agreement ID: ${agreement.id}`,
                        60,
                        doc.y,
                        { align: 'center', width: pageWidth },
                    );

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}
