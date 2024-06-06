import VerificationEmail from "../../../app/(ui)/email";
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import dbConnect from '@/lib/dbConnect';
import User from '@/model/user';  // Adjust the path according to your project structure
import { randomBytes } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email } = await request.json();
    console.log(email);

    // Generate a random OTP
    const otp = randomBytes(3).toString('hex'); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Save the OTP and expiry to the user record
    const user = await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { new: true, upsert: true } // Create a new user if not found
    );
    console.log(user);

    // Send OTP email
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: "OTP for password reset",
      react: VerificationEmail({ email, otp }) as React.ReactElement,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}