import { IGeneratePdfUseCase } from '@application/interfaces/agreement/agreement.usecase.interface';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { AgreementEntity } from '@core/entities/agreement.entity';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import PDFDocument from 'pdfkit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

@injectable()
export class GenerateAgreementPdfUseCase implements IGeneratePdfUseCase {
    private s3Client: S3Client;

    constructor(
        @inject('IAgreementRepository') private agreementRepository: IAgreementRepository,
    ) {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
    }

    async execute(id: string): Promise<string> {
        logger.info({ agreementId: id }, 'Generating PDF for agreement');

        const agreement = await this.agreementRepository.findById(id);
        if (!agreement) throw new Error('Agreement not found');

        if (!agreement.ownerSignatureUrl || !agreement.tenantSignatureUrl) {
            throw new Error('Both parties must sign before PDF generation');
        }

        const pdfBuffer = await this.generatePdfBuffer(agreement);
        const fileKey = `agreements/${agreement.agreementNumber}-${crypto.randomUUID()}.pdf`;

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME || 'rentease-bucket',
                Key: fileKey,
                Body: pdfBuffer,
                ContentType: 'application/pdf',
                // ACL: 'public-read', // Depends on your bucket policy, omit if blocked
            }),
        );

        const pdfUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

        agreement.setPdfUrl(pdfUrl);
        await this.agreementRepository.update(agreement);

        return pdfUrl;
    }

    private generatePdfBuffer(agreement: AgreementEntity): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const chunks: Buffer[] = [];

                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));

                // Document Header
                doc.fontSize(20).text('Rental Agreement', { align: 'center' });
                doc.moveDown();

                // Details
                doc.fontSize(12).text(`Agreement Number: ${agreement.agreementNumber}`);
                doc.text(`Start Date: ${new Date(agreement.startDate).toLocaleDateString()}`);
                doc.text(`End Date: ${new Date(agreement.endDate).toLocaleDateString()}`);
                doc.moveDown();

                // Financials
                doc.text(`Monthly Rent: ₹${agreement.monthlyRent}`);
                doc.text(`Deposit Amount: ₹${agreement.depositAmount}`);
                doc.text(`Lock-in Period: ${agreement.lockInPeriodMonths} months`);
                doc.moveDown();

                // Terms
                doc.text('Terms and Conditions:', { underline: true });
                if (Array.isArray(agreement.termsAndConditions)) {
                    agreement.termsAndConditions.forEach((term: unknown, index: number) => {
                        const termObj = term as { text?: string };
                        doc.text(`${index + 1}. ${termObj?.text || String(term)}`);
                    });
                }
                if (agreement.customClauses) {
                    doc.moveDown().text('Custom Clauses:', { underline: true });
                    doc.text(agreement.customClauses);
                }
                doc.moveDown(2);

                // Signatures (Assuming URLs are accessible, normally we'd fetch the image buffer, 
                // but for simplicity we just print the text, or we can use pdfkit image fetching if needed)
                doc.text('Owner Signature: Signed Electronically');
                doc.text(`Timestamp: ${agreement.ownerSignedAt ? new Date(agreement.ownerSignedAt).toLocaleDateString() : 'N/A'}`);
                doc.moveDown();

                doc.text('Tenant Signature: Signed Electronically');
                doc.text(`Timestamp: ${agreement.tenantSignedAt ? new Date(agreement.tenantSignedAt).toLocaleDateString() : 'N/A'}`);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}
