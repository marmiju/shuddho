export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, category, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Read RESEND_API_KEY strictly from environment variables (.env / Vercel Environment Variables)
  const apiKey = process.env.RESEND_API_KEY;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f8fafc; color: #0f172a; border-radius: 14px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #2563eb; margin: 0; font-size: 1.3rem;">🚀 New Project Inquiry Received</h2>
        <span style="font-size: 0.8rem; background-color: #eff6ff; color: #2563eb; padding: 4px 10px; border-radius: 20px; font-weight: bold;">SHUDDHO</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.95rem;">
        <tr>
          <td style="padding: 10px 12px; font-weight: bold; width: 140px; border-bottom: 1px solid #e2e8f0; color: #475569;">Client Name:</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #475569;">Client Email:</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #475569;">Project Category:</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;"><span style="background-color: #f1f5f9; padding: 4px 10px; border-radius: 6px; font-weight: 600;">${category}</span></td>
        </tr>
      </table>
      <h3 style="color: #0f172a; margin-bottom: 10px; font-size: 1rem;">Project Details & Goals:</h3>
      <div style="background: #ffffff; padding: 16px; border-radius: 10px; border: 1px solid #cbd5e1; white-space: pre-wrap; line-height: 1.65; color: #1e293b; font-size: 0.95rem;">${message}</div>
      <p style="font-size: 0.8rem; color: #64748b; margin-top: 24px; text-align: center;">Sent via Shuddho Portfolio Engine • Resend Serverless Dispatcher</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Shuddho Portfolio <onboarding@resend.dev>',
        to: ['azizarrahman558@gmail.com', 'mar.miju.dev@gmail.com'],
        subject: `🚀 New Project Inquiry: ${name} [${category}]`,
        html: emailHtml,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
