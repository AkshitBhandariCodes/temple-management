// backend/routes/api/send-email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, content, recipientName } = req.body;

  // Validate inputs
  if (!to || !subject || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Configure nodemailer transporter
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #FF6B35;">${subject}</h2>
          <p>Dear ${recipientName || 'Devotee'},</p>
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

    console.log('Email sent:', info.messageId);
    res.status(200).json({ 
      success: true, 
      messageId: info.messageId 
    });
  } catch (error: any) {
    console.error('Email error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}
