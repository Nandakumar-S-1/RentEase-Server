import { IGeneratePdfUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { AgreementEntity } from '@core/entities/agreement.entity';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import PDFDocument from 'pdfkit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import { TokenTypes } from '@shared/types/tokens';
import {
    AgreementNotFoundError,
    AgreementSignatureRequiredError,
} from '@shared/errors/agreement-errors';

interface PdfParties {
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    tenantName: string;
    tenantEmail: string;
    tenantPhone: string;
    propertyTitle: string;
    propertyAddress: string;
}

@injectable()
export class GenerateAgreementPdfUseCase implements IGeneratePdfUseCase {
    private _s3Client: S3Client;

    constructor(
        @inject(TokenTypes.IAgreementRepository) private agreementRepository: IAgreementRepository,
        @inject(TokenTypes.IUserRepository) private userRepository: IUserRepository,
        @inject(TokenTypes.IPropertyRepository) private propertyRepository: IPropertyRepository,
    ) {
        this._s3Client = new S3Client({
            region: process.env.AWS_REGION || 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY || '',
                secretAccessKey: process.env.AWS_SECRET_KEY || '',
            },
        });
    }

    async execute(id: string): Promise<string> {
        logger.info({ agreementId: id }, 'Generating PDF for agreement');

        const agreement = await this.agreementRepository.findById(id);
        if (!agreement) throw new AgreementNotFoundError();

        if (!agreement.ownerSignatureUrl || !agreement.tenantSignatureUrl) {
            throw new AgreementSignatureRequiredError();
        }

        const [owner, tenant, property] = await Promise.all([
            this.userRepository.findById(agreement.ownerId),
            this.userRepository.findById(agreement.tenantId),
            this.propertyRepository.findById(agreement.propertyId),
        ]);

        const parties: PdfParties = {
            ownerName: owner?.fullname ?? 'N/A',
            ownerEmail: owner?.email ?? 'N/A',
            ownerPhone: owner?.phone ?? 'N/A',
            tenantName: tenant?.fullname ?? 'N/A',
            tenantEmail: tenant?.email ?? 'N/A',
            tenantPhone: tenant?.phone ?? 'N/A',
            propertyTitle: property?.title ?? 'N/A',
            propertyAddress: property
                ? [property.fullAddress, property.locationCity, property.locationDistrict, property.locationPincode]
                      .filter(Boolean)
                      .join(', ')
                : 'N/A',
        };

        const pdfBuffer = await this.generatePdfBuffer(agreement, parties);
        const fileKey = `agreements/${agreement.agreementNumber}-${crypto.randomUUID()}.pdf`;

        await this._s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME || 'rentease-bucket',
                Key: fileKey,
                Body: pdfBuffer,
                ContentType: 'application/pdf',
            }),
        );

        const pdfUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

        agreement.setPdfUrl(pdfUrl);
        await this.agreementRepository.update(agreement);

        return pdfUrl;
    }

    private generatePdfBuffer(agreement: AgreementEntity, parties: PdfParties): Promise<Buffer> {
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

                const pageWidth = doc.page.width - 120; // account for margins

                // ── Header bar ──────────────────────────────────────────────
                doc.rect(0, 0, doc.page.width, 80).fill(primaryColor);
                doc
                    .fillColor('#FFFFFF')
                    .fontSize(22)
                    .font('Helvetica-Bold')
                    .text('RENTAL AGREEMENT', 60, 25, { align: 'center' });
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text('RentEase Platform', 60, 52, { align: 'center' });

                doc.moveDown(3);

                // ── Agreement meta row ───────────────────────────────────────
                doc
                    .fillColor(darkText)
                    .fontSize(11)
                    .font('Helvetica-Bold')
                    .text('Agreement Number:', 60, doc.y)
                    .font('Helvetica')
                    .text(agreement.agreementNumber, 200, doc.y - 11);

                doc.moveDown(0.4);

                doc
                    .font('Helvetica-Bold')
                    .text('Status:', 60)
                    .font('Helvetica')
                    .text(agreement.status.replace(/_/g, ' '), 200, doc.y - 11);

                doc.moveDown(0.4);

                doc
                    .font('Helvetica-Bold')
                    .text('Generated:', 60)
                    .font('Helvetica')
                    .text(new Date().toLocaleDateString('en-IN'), 200, doc.y - 11);

                doc.moveDown(1.5);

                // ── Section helper ───────────────────────────────────────────
                const sectionHeader = (title: string) => {
                    doc
                        .rect(60, doc.y, pageWidth, 22)
                        .fill(primaryColor);
                    doc
                        .fillColor('#FFFFFF')
                        .fontSize(10)
                        .font('Helvetica-Bold')
                        .text(title.toUpperCase(), 68, doc.y - 17);
                    doc.moveDown(1);
                };

                const row = (label: string, value: string, y?: number) => {
                    const rowY = y ?? doc.y;
                    doc
                        .fillColor(textGray)
                        .fontSize(9)
                        .font('Helvetica-Bold')
                        .text(label, 68, rowY, { width: 150 });
                    doc
                        .fillColor(darkText)
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
                doc
                    .fillColor(primaryColor)
                    .fontSize(9)
                    .font('Helvetica-Bold')
                    .text('OWNER (LESSOR)', 68, doc.y);
                doc.moveDown(0.4);
                row('Full Name', parties.ownerName);
                row('Email', parties.ownerEmail);
                row('Phone', parties.ownerPhone);
                doc.moveDown(0.3);

                // Tenant sub-heading
                doc
                    .fillColor(primaryColor)
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
                        doc
                            .fillColor(darkText)
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
                    doc
                        .fillColor(primaryColor)
                        .fontSize(9)
                        .font('Helvetica-Bold')
                        .text('CUSTOM CLAUSES', 68, doc.y);
                    doc.moveDown(0.3);
                    doc
                        .fillColor(darkText)
                        .font('Helvetica')
                        .fontSize(9)
                        .text(agreement.customClauses, 68, doc.y, {
                            width: pageWidth - 8,
                            lineGap: 2,
                        });
                    doc.moveDown(0.5);
                }

                if (agreement.tenantRemarks) {
                    doc
                        .fillColor(primaryColor)
                        .fontSize(9)
                        .font('Helvetica-Bold')
                        .text('TENANT REMARKS', 68, doc.y);
                    doc.moveDown(0.3);
                    doc
                        .fillColor(darkText)
                        .font('Helvetica')
                        .fontSize(9)
                        .text(agreement.tenantRemarks, 68, doc.y, {
                            width: pageWidth - 8,
                            lineGap: 2,
                        });
                    doc.moveDown(0.5);
                }

                // ── Signatures ───────────────────────────────────────────────
                sectionHeader('Signatures');

                const sigColWidth = (pageWidth - 20) / 2;

                // Owner signature block
                doc
                    .rect(68, doc.y, sigColWidth, 60)
                    .fill(lightGray);
                doc
                    .fillColor(textGray)
                    .fontSize(8)
                    .font('Helvetica-Bold')
                    .text('OWNER / LESSOR', 76, doc.y - 52);
                doc
                    .fillColor(darkText)
                    .font('Helvetica')
                    .fontSize(9)
                    .text('Signed Electronically', 76, doc.y - 36);
                doc
                    .fillColor(textGray)
                    .fontSize(8)
                    .text(
                        `Date: ${agreement.ownerSignedAt ? new Date(agreement.ownerSignedAt).toLocaleDateString('en-IN') : 'N/A'}`,
                        76,
                        doc.y - 22,
                    );
                doc
                    .fillColor(darkText)
                    .fontSize(8)
                    .font('Helvetica-Bold')
                    .text(parties.ownerName, 76, doc.y - 10);

                // Tenant signature block
                const tenantSigX = 68 + sigColWidth + 20;
                doc
                    .rect(tenantSigX, doc.y - 60, sigColWidth, 60)
                    .fill(lightGray);
                doc
                    .fillColor(textGray)
                    .fontSize(8)
                    .font('Helvetica-Bold')
                    .text('TENANT / LESSEE', tenantSigX + 8, doc.y - 52);
                doc
                    .fillColor(darkText)
                    .font('Helvetica')
                    .fontSize(9)
                    .text('Signed Electronically', tenantSigX + 8, doc.y - 36);
                doc
                    .fillColor(textGray)
                    .fontSize(8)
                    .text(
                        `Date: ${agreement.tenantSignedAt ? new Date(agreement.tenantSignedAt).toLocaleDateString('en-IN') : 'N/A'}`,
                        tenantSigX + 8,
                        doc.y - 22,
                    );
                doc
                    .fillColor(darkText)
                    .fontSize(8)
                    .font('Helvetica-Bold')
                    .text(parties.tenantName, tenantSigX + 8, doc.y - 10);

                doc.moveDown(1.5);

                // ── Footer ───────────────────────────────────────────────────
                doc
                    .moveTo(60, doc.y)
                    .lineTo(60 + pageWidth, doc.y)
                    .strokeColor('#E5E7EB')
                    .stroke();
                doc.moveDown(0.5);
                doc
                    .fillColor(textGray)
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
