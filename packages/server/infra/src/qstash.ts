import { Client } from "@upstash/qstash";

const qstashToken = process.env.QSTASH_TOKEN;

if (!qstashToken) throw new Error("QSTASH_TOKEN is not set");

export const qstash = new Client({ token: qstashToken });
