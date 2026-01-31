import Mailgun from "mailgun.js";
import FormData from "form-data";

if (!process.env.MAILGUN_API_KEY) {
  throw new Error("MAILGUN_API_KEY environment variable is not set");
}

const mailgun = new Mailgun(FormData);

export const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});
