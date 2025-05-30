import validateEmail from '../../app/lib/emailUtils/validateEmail'; // Adjust path as necessary
import * as dns from 'dns';

// Mock DNS module
jest.mock('dns', () => ({
    resolveMx: jest.fn(),
}));

const mockedDns = dns as jest.Mocked<typeof dns>;

describe('validateEmail', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should validate a correctly formatted email with valid MX records', async () => {
        mockedDns.resolveMx.mockImplementation((_, callback) => {
            callback(null, [{ exchange: 'mail.example.com', priority: 10 }]);
        });

        const validEmail = 'user@example.com';
        await expect(validateEmail(validEmail)).resolves.toBe(true);
    });

    test('should reject an email with invalid format (missing @)', async () => {
        const invalidEmail = 'userexample.com';
        await expect(validateEmail(invalidEmail)).rejects.toThrow(
            'Invalid email format. Please check and try again.'
        );
    });

    test('should reject an email with invalid domain syntax', async () => {
        const invalidDomainEmail = 'user@invalid_domain';
        await expect(validateEmail(invalidDomainEmail)).rejects.toThrow(
            'Invalid email format. Please check and try again.'
        );
    });

    test('should reject an email if domain has no MX records', async () => {
        mockedDns.resolveMx.mockImplementation((_, callback) => {
            callback(null, []); // Return an empty array for no MX records
        });

        const noMxRecordsEmail = 'user@nomx.example';
        await expect(validateEmail(noMxRecordsEmail)).rejects.toThrow(
            'The email domain does not have valid mail servers (MX records). Please check the domain.'
        );
    });

    test('should reject an email if DNS lookup fails', async () => {
        mockedDns.resolveMx.mockImplementation((_, callback) => {
            callback(new Error('DNS error'), []); // Ensure `addresses` is still an array
        });

        const dnsErrorEmail = 'user@dns-error.example';
        await expect(validateEmail(dnsErrorEmail)).rejects.toThrow(
            "We couldn't verify the email domain. DNS lookup failed: DNS error"
        );
    });

    test('should reject an email with empty domain part after @', async () => {
        const invalidEmail = 'user@';
        await expect(validateEmail(invalidEmail)).rejects.toThrow(
            'Invalid email format. Please check and try again'
        );
    });

    test('should validate an email with subdomains', async () => {
        mockedDns.resolveMx.mockImplementation((_, callback) => {
            callback(null, [{ exchange: 'mail.sub.example.com', priority: 10 }]);
        });

        const validSubdomainEmail = 'user@sub.example.com';
        await expect(validateEmail(validSubdomainEmail)).resolves.toBe(true);
    });
});
