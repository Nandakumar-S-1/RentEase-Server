export class BusinessRuleError extends Error {
    public readonly code: string;
    public readonly statusCode: number;

    constructor(message: string, code: string = 'BUSINESS_RULE_VIOLATION', statusCode: number = 403) {
        super(message);
        this.name = 'BusinessRuleError';
        this.code = code;
        this.statusCode = statusCode;
        
        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, BusinessRuleError);
    }
}