# Activate phone verification

Pluto first authenticates with Google. A saved profile can then verify ownership of its phone number. Phone-only login is not enabled by this step.

1. Create a Twilio Verify service with six-digit SMS codes. Enable Fraud Guard and restrict SMS geographic permissions to the countries you intend to support. SMS delivery is a paid external service; review Twilio's current pricing and any trial-account restrictions before activating it.
2. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID as secret runtime values in Pluto's Sites settings. Do not paste credentials into source files, GitHub, or chat.
3. Redeploy Pluto to apply the values. The profile's Send verification code control automatically becomes available.
4. Sign in, save a phone number with country code, request a real SMS, and submit its six-digit code. Verify incorrect codes, expiry, resend cooldown, and changing the saved phone number.

The server requires a Google session and a saved profile. It limits sends to five per hour per account and phone number, with a 60-second cooldown. Checks expire after ten minutes and stop after five attempts. Changing the saved number resets its verified status. Only a successful provider response marks the number verified. There are no test-code bypasses.

Google name and email are read only. Each Google account has independent Client and Talent profiles. DOB and phone are returned only to that signed-in account; there is no public profile endpoint.

Documentation: https://www.twilio.com/docs/verify/api
