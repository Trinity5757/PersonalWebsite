// app/lib/emailUtils/verfiyDomain.ts
// to do - check if email is valid domain
import dns from 'dns';

const verifyEmailDomain = (email: string): Promise<boolean> => {
  const domain = email.split('@')[1];

  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses.length) {
        reject('No MX records found for domain');
      } else {
        resolve(true);
      }
    });
  });
};

export default verifyEmailDomain;
