import nodemailer from "nodemailer";
import type { ContactInput } from "./validation";
import { SERVICE_LABELS } from "./validation";

/**
 * SMTP transport. Configured entirely from environment variables so no
 * credentials ever live in the codebase. Designed to work with Gmail SMTP
 * (the same provider the PCL system uses) or any standard SMTP server.
 */
let cached: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter {
  if (cached) return cached;
  const port = Number(process.env.SMTP_PORT ?? 465);
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // true for 465, false for 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return cached;
}

/** Escape user input before embedding it in HTML to prevent injection. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendLeadNotification(lead: ContactInput): Promise<void> {
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  if (!to || !from || !process.env.SMTP_HOST) {
    // Email is best-effort: if SMTP isn't configured, we don't crash the request.
    // The lead is still saved to the database.
    console.warn("[mailer] SMTP not fully configured; skipping notification.");
    return;
  }

  const serviceLabel = lead.service ? SERVICE_LABELS[lead.service] : "—";
  const company = lead.company?.trim() || "—";
  const phone = lead.phone?.trim() || "";
  const source = lead.source?.trim() || "direct";

  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a">
      <div style="background:#0a0f1d;padding:20px 24px;border-radius:12px 12px 0 0">
        <h2 style="margin:0;color:#e7edf6;font-size:18px">New contact request · DataHub</h2>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:20px 24px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#64748b;width:120px">Name</td><td style="padding:6px 0"><strong>${esc(lead.name)}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0"><a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></td></tr>
          ${
            phone
              ? `<tr><td style="padding:6px 0;color:#64748b">Phone</td><td style="padding:6px 0"><a href="tel:${esc(phone.replace(/[^0-9+]/g, ""))}">${esc(phone)}</a> · <a href="https://wa.me/${esc(phone.replace(/[^0-9]/g, ""))}">WhatsApp</a></td></tr>`
              : ""
          }
          <tr><td style="padding:6px 0;color:#64748b">Company</td><td style="padding:6px 0">${esc(company)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Interested in</td><td style="padding:6px 0">${esc(serviceLabel)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Came from</td><td style="padding:6px 0"><strong>${esc(source)}</strong></td></tr>
        </table>
        <div style="margin-top:14px;padding-top:14px;border-top:1px solid #e2e8f0">
          <div style="color:#64748b;font-size:13px;margin-bottom:6px">Message</div>
          <div style="white-space:pre-wrap;font-size:14px;line-height:1.6">${esc(lead.message)}</div>
        </div>
      </div>
    </div>`;

  const text = `New contact request · DataHub
Name: ${lead.name}
Email: ${lead.email}${phone ? `\nPhone: ${phone}` : ""}
Company: ${company}
Interested in: ${serviceLabel}
Came from: ${source}

Message:
${lead.message}`;

  await getTransport().sendMail({
    from: `"DataHub Website" <${from}>`,
    to,
    replyTo: lead.email,
    subject: `New lead: ${lead.name}${company !== "—" ? ` (${company})` : ""}`,
    text,
    html,
  });
}
