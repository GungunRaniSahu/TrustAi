const tls = require('tls');

const checkSSL = (req, res) => {
  const domain = req.params.domain || req.query.domain;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  const options = {
    host: domain,
    port: 443,
    servername: domain,
    rejectUnauthorized: false,
  };

  const socket = tls.connect(options, () => {
    const cert = socket.getPeerCertificate();

    if (!cert || Object.keys(cert).length === 0) {
      return res.json({
        domain,
        sslStatus: 'invalid',
        message: 'No certificate found',
      });
    }

    const validTo = new Date(cert.valid_to);
    const validFrom = new Date(cert.valid_from);
    const now = new Date();

    const isValid = now >= validFrom && now <= validTo;
    const daysRemaining = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24));

    return res.json({
      domain,
      sslStatus: isValid ? 'valid' : 'invalid',
      details: {
        validFrom,
        validTo,
        daysRemaining,
      },
    });
  });

  socket.on('error', (err) => {
    return res.json({
      domain,
      sslStatus: 'unreachable',
      error: err.message,
    });
  });
};

module.exports = {
  checkSSL,
};
