const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASSWORD
  ) {
    throw new Error(
      "EMAIL_USER and EMAIL_PASSWORD must be configured"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  if (!to) {
    throw new Error("Recipient email is required");
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  if (html) {
    mailOptions.html = html;
  }

  return transporter.sendMail(mailOptions);
};

const sendPractitionerRegistrationEmail = async (
  email,
  name
) => {
  return sendEmail({
    to: email,
    subject: "Practitioner Registration Received",
    text: `Hello ${name},

Your practitioner registration has been received successfully.

Your account is currently pending admin verification.

You will be notified once your documents have been reviewed.

Thank you.`,
  });
};

const sendPractitionerApprovalEmail = async (
  email,
  name
) => {
  return sendEmail({
    to: email,
    subject: "Practitioner Account Approved",
    text: `Hello ${name},

Your practitioner documents have been verified successfully.

Your practitioner account is now approved and active.

You can now log in to your practitioner account.

Thank you.`,
  });
};

const sendPractitionerRejectionEmail = async (
  email,
  name,
  reason
) => {
  return sendEmail({
    to: email,
    subject: "Practitioner Verification Rejected",
    text: `Hello ${name},

Your practitioner verification was not approved.

Reason:
${reason || "The submitted documents did not meet the verification requirements."}

Please review your documents and submit the required information again.

Thank you.`,
  });
};

module.exports = {
  sendEmail,
  sendPractitionerRegistrationEmail,
  sendPractitionerApprovalEmail,
  sendPractitionerRejectionEmail,
};