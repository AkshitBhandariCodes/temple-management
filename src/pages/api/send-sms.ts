// backend/routes/api/send-sms.ts
import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, message } = req.body;

  // Validate inputs
  if (!to || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate phone number format (should start with +)
  if (!to.startsWith('+')) {
    return res.status(400).json({ 
      error: 'Phone number must include country code (e.g., +919876543210)' 
    });
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log('SMS sent:', result.sid);
    res.status(200).json({ 
      success: true, 
      sid: result.sid 
    });
  } catch (error: any) {
    console.error('SMS error:', error);
    res.status(500).json({ 
      error: 'Failed to send SMS',
      details: error.message 
    });
  }
}
