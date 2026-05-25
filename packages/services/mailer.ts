import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer";
import { env } from "./env";
import { logger } from "../logger";
import { handleServiceError } from "./errors";

const hasEmailSettings = Boolean(
  env.EMAIL_HOST && env.EMAIL_PORT && env.EMAIL_USER && env.EMAIL_PASS && env.EMAIL_FROM,
);

function createTransporter() {
  if (!hasEmailSettings) return null;

  return nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT),
    secure:
      env.EMAIL_SECURE !== undefined ? env.EMAIL_SECURE === "true" : Number(env.EMAIL_PORT) === 465,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
}

export async function sendEmail(options: SendMailOptions): Promise<void> {
  try {
    if (!hasEmailSettings) {
      logger.warn("[mailer] email settings are not configured. Skipping email send.", {
        to: options.to,
        subject: options.subject,
      });
      return;
    }

    const transporter = createTransporter();
    if (!transporter) {
      logger.warn("[mailer] failed to initialize transporter. Skipping email send.");
      return;
    }

    await transporter.sendMail({
      from: env.EMAIL_FROM,
      ...options,
    });
  } catch (error) {
    handleServiceError(error, "Failed to send email");
  }
}
