export interface EmailAttachment {
  filename: string;
  data: Buffer | string;
  contentType?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  attachments?: EmailAttachment[];
}
