import { Resend } from "resend";

/**
 * Send the welcome email via Resend. Used by auth callback and by POST /api/send-welcome.
 * With onboarding@resend.dev you can only send to your own Resend account email.
 * To send to any user, verify a domain at resend.com/domains and set RESEND_FROM to that domain.
 */
export async function sendWelcomeEmail(email: string): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not set" };
  }

  const from = process.env.RESEND_FROM ?? "Loadforge <onboarding@resend.dev>";
  const subject = "Welcome to Loadforge";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://loadforge.org";
  const dashboardUrl = `${baseUrl}/dashboard`;

  const html = `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f6f7f9; padding: 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; padding: 40px; border-radius: 8px;">
      <tr>
        <td align="center">
          <h2 style="margin-bottom: 10px;">Welcome to Loadforge</h2>
          <p style="color: #555; font-size: 15px;">
            The most accurate database of roofing contractors in Canada.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 30px 0;">
          <p style="font-size: 16px; color: #333;">
            You're all set. Search, filter, and export verified roofing contractor leads.
          </p>

          <p style="font-size: 16px; color: #333;">
            Go to your dashboard to explore the database and upgrade for full access and CSV exports.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}"
               style="background-color: #111; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>

          <p style="font-size: 14px; color: #777;">
            Need help? Check our <a href="${baseUrl}/faq">FAQ</a> or <a href="${baseUrl}/contact">contact us</a>.
          </p>
        </td>
      </tr>

      <tr>
        <td style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999;" align="center">
          © Loadforge — One niche. One country. Verified.
        </td>
      </tr>
    </table>
  </body>
</html>`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject,
      html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
