const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Aviv Eldad <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    //use sendGrid
  }

  async send(template, subject) {
    //need to add pug.renderFile()
    const html = "<h1> text </h1>";
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to your WishList");
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Reset your password");
  }
};
