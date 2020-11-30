const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const SECRET = require('./SECRET.js');
const app = admin.initializeApp();

// Owner of the `SECRET.REFRESH_TOKEN`. Need to update the token when updating the email.
const EMAIL_SENDER = 'noreply@example.com';
const SCHEDULE = '05 * * * *';  // Format: https://crontab.guru/

exports.scheduledFunctionCrontab = functions.runWith({timeoutSeconds: 540, memory: '1GB'}).pubsub.schedule(SCHEDULE)
  .onRun(async () => {
    // Do something
  });

// https://github.com/akshaybhange/firebase-functions-sendMail-Google-OAuth2
// https://android.jlelse.eu/firebase-functions-send-email-using-google-oauth2-20c552da6b3e
async function sendemails(list) {
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    SECRET.CLIENT_ID, //client Id
    SECRET.CLIENT_SECRET, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: SECRET.REFRESH_TOKEN
  });
  const tokens = await oauth2Client.refreshAccessToken();
  const accessToken = tokens.credentials.access_token;

  const smtpTransport = nodemailer.createTransport({
    // https://nodemailer.com/usage/bulk-mail/
    pool: true,
    maxConnections: 20,
    maxMessages: Infinity,
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL_SENDER,
      clientId: SECRET.CLIENT_ID,
      clientSecret: SECRET.CLIENT_SECRET,
      refreshToken: SECRET.REFRESH_TOKEN,
      accessToken: accessToken
    }
  });

  return Promise.all(list.map((content) => {
    if (!content) {
      return null;
    }
    const {to, subject, htmlBody} = content;
    const mailOptions = {
      from: EMAIL_SENDER,
      to,
      subject,
      html: htmlBody,
    };
    return new Promise((resolve, reject) => {
      smtpTransport.sendMail(mailOptions, (error, info) => error ? reject(error) : resolve(info));
    }).then((info) => {
      functions.logger.log(`Email sent to ${to}: ${subject}`);
    }).catch((error) => {
      functions.logger.error(`Failed to send to ${to}: ${subject}. ${error.message}`);
    });
  }));
}
