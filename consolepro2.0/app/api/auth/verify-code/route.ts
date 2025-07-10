import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();
  if (!phone || !code) {
    return NextResponse.json({ error: 'Phone and code required' }, { status: 400 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    return NextResponse.json({ error: 'Twilio env vars missing' }, { status: 500 });
  }

  const client = twilio(accountSid, authToken);
  try {
    const verificationCheck = await client.verify.v2.services(serviceSid).verificationChecks.create({ to: phone, code });
    if (verificationCheck.status === 'approved') {
      // You may want to set a cookie or session here
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, status: verificationCheck.status, twilio: verificationCheck });
    }
  } catch (error: any) {
    console.error('Twilio verify error:', error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }
} 