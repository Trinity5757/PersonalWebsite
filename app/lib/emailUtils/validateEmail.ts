import dns from 'dns';
import { toASCII } from 'punycode'; // Use the npm package for IDN handling

const validateEmail = (email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Step 1: Validate email format
        if (!emailRegex.test(email)) {
            return reject(new Error('Invalid email format. Please check and try again.'));
        }

        // Step 2: Extract domain and validate
        const domain = email.split('@')[1];
        try {
            const punycodeDomain = toASCII(domain); // Convert to ASCII for IDN domains
            const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!domainRegex.test(punycodeDomain)) {
                return reject(new Error('The domain part of the email is invalid. Make sure it is a properly formatted domain like "example.com".'));
            }
        } catch (err) {
            console.error('Error processing domain:', err);
            return reject(new Error('Could not process the domain part of the email. Please ensure it is valid.'));
        }

        // Step 3: Check MX records
        dns.resolveMx(domain, (err, addresses) => {
            if (err) {
                return reject(new Error(`We couldn't verify the email domain. DNS lookup failed: ${err.message}`));
            }
            if (!addresses || addresses.length === 0) {
                return reject(new Error('The email domain does not have valid mail servers (MX records). Please check the domain.'));
            }

            resolve(true);
        });
    });
};

export default validateEmail;
