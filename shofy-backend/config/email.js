require('dotenv').config();
const nodemailer = require('nodemailer');
const { secret } = require('./secret');

function getTransporterConfig() {
  const auth = {
    user: secret.email_user,
    pass: secret.email_pass,
  };
  if (secret.email_service) {
    return {
      service: secret.email_service,
      auth,
      secure: true,
    };
  }
  const port = secret.email_port != null ? secret.email_port : 465;
  return {
    host: secret.email_host,
    port,
    secure: port === 465,
    auth,
  };
}

// sendEmail
module.exports.sendEmail = (body, res, message) => {
  const transporter = nodemailer.createTransport(getTransporterConfig());

  transporter.verify(function (err, success) {
    if (err) {
      res.status(403).send({
        message: `Error happen when verify ${err.message}`,
      });
      console.log(err.message);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  transporter.sendMail(body, (err, data) => {
    if (err) {
      res.status(403).send({
        message: `Error happen when sending email ${err.message}`,
      });
    } else {
      res.send({
        message: message,
      });
    }
  });
};

/**
 * Send email without using res. Returns a Promise for use in controllers
 * that must update DB only after successful send (e.g. support reply).
 * Uses same Nodemailer setup as sendEmail.
 */
module.exports.sendEmailPromise = (body) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(getTransporterConfig());
    transporter.sendMail(body, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

