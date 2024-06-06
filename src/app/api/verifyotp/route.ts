import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModal from '@/model/user';  // Adjust the path according to your project structure

export async function POST(request: NextRequest) {
  await dbConnect();

  const { email, otp } = await request.json();

  try {
    // Find the user by email
    const user = await UserModal.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.otp === otp && user.otpExpiry && user.otpExpiry > Date.now()) {
      // OTP is valid and not expired
      return NextResponse.json({ message: 'OTP verified' }, { status: 200 });
    } else {
      // OTP is invalid or expired
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}