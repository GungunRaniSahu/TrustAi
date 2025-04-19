const tls = require('tls');

function checkSSL(domain) {
  return new Promise((resolve, reject) => {
    const options = {
      host: domain,
      port: 443,
      servername: domain
    };

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate();
      if (!cert || !Object.keys(cert).length) {
        reject(new Error('No certificate retrieved'));
      }

      const now = new Date();
      const validFrom = new Date(cert.valid_from);
      const validTo = new Date(cert.valid_to);
      const isValid = now >= validFrom && now <= validTo;

      resolve({
        domain,
        valid: isValid,
        validFrom,
        validTo,
        issuer: cert.issuer,
        subject: cert.subject
      });

      socket.end();
    });

    socket.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = { checkSSL };
