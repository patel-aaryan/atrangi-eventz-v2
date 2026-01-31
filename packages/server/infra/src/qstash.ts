import { Client } from "@upstash/qstash";

const qstashToken = process.env.QSTASH_TOKEN;

if (!qstashToken) throw new Error("Missing QSTASH_TOKEN environment variable");

export const qstash = new Client({ token: qstashToken });
