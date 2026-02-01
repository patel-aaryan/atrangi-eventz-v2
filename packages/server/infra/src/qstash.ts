import { Client } from "@upstash/qstash";

const qstashToken = process.env.QSTASH_TOKEN;
const qstashUrl = process.env.QSTASH_URL;

if (!qstashToken) throw new Error("QSTASH_TOKEN is not set");

if (!qstashUrl) throw new Error("QSTASH_URL is not set");

export const qstash = new Client({ baseUrl: qstashUrl, token: qstashToken });
