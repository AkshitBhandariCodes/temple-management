// backend/routes/api/send-broadcast.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const emailTransporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { channel, recipients, subject, content } = req.body;

  if (!channel || !recipients || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const results = {
    successful: 0,
    failed: 0,
    errors: [] as any[],
  };

  try {
    if (channel === 'email') {
      // Send emails
      for (const recipient of recipients) {
        try {
          await emailTransporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
            to: recipient.email,
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #FF6B35;">${subject}</h2>
                <p>Dear ${recipient.name || 'Devotee'},</p>
                <div style="margin: 20px 0;">
                  ${content.replace(/\n/g, '<br>')}
                </div>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666;">
                  Best regards,<br>
                  <strong>Temple Administration</strong>
                </p>
              </div>
            `,
          });
          results.successful++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({ recipient: recipient.email, error: error.message });
        }
      }
    } else if (channel === 'sms') {
      // Send SMS
      for (const recipient of recipients) {
        try {
          await twilioClient.messages.create({
            body: content,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: recipient.phone,
          });
          results.successful++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({ recipient: recipient.phone, error: error.message });
        }
      }
    } else {
      return res.status(400).json({ error: 'Invalid channel' });
    }

    res.status(200).json({
      success: true,
      ...results,
    });
  } catch (error: any) {
    console.error('Broadcast error:', error);
    res.status(500).json({
      error: 'Failed to send broadcast',
      details: error.message,
    });
  }
}
