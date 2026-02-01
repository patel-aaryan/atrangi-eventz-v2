import Mailgun from "mailgun.js";
import FormData from "form-data";

const apikey = process.env.MAILGUN_API_KEY;

if (!apikey) throw new Error("MAILGUN_API_KEY is not set");

const mailgun = new Mailgun(FormData);

export const mg = mailgun.client({ username: "api", key: apikey });
