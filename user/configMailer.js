
const nodemailer = require('nodemailer')
const { host, port, user, pass } = require('./passwords.json')

function createTransport() {
  return nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });
}

function createMessage(user, confirmLink) {
  return {
    from: "rfldruzian@gmail.com",
    to: user.email,
    subject: "Confirm Email",
    text: `Confirm your email using the following link: ${confirmLink}`,
    html: `<p>Confirm your email using the following link: <a href="${confirmLink}">${confirmLink}</a></p>`
  };
}

function  resetMessage(user, resetLink)  {
  return {
    from: "rfldruzian@gmail.com",
    to: user.email,
    subject: "Reset Password",
    text: `Reset your password using the following link: ${resetLink}`,
    html: `<p>Reset your password using the following link: <a href="${resetLink}">${resetLink}</a></p>`
  }
};

module.exports = { createTransport, createMessage, resetMessage };

