/* Google cloud project oauth credentials */
exports.CLIENT_ID = '';
exports.CLIENT_SECRET = '';

/* The token for gmail permission
 * 1. Open Chrome in guest mode or incognito
 * 2. Go to https://developers.google.com/oauthplayground
 * 3. Click the gear icon on the top right, choose "Use your own OAuth credentials", and fill in the two values above
 * 4. On the left side, put "https://mail.google.com/" in the input box, and click "Authorize API"
 * 5. In the prompt, login to the sender email (e.g. 'noreply@example.com'). This is a real email, a real user.
 * 6. Then click "Exchange authorization code for tokens", and copy the refresh token here
 * 7. Update the `EMAIL_SENDER` value in `/functions/index.js` with the account logged in in step 5.
 */
exports.REFRESH_TOKEN = '';
