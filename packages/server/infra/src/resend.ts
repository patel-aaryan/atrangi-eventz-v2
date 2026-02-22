import { Resend } from "resend";

const apikey = process.env.RESEND_API_KEY;

if (!apikey) throw new Error("RESEND_API_KEY is not set");

export const resend = new Resend(apikey);
