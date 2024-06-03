import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/model/user'; // Assuming you have a User model

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  console.log(body);
  try {
    await dbConnect();

    const { id } = params;
    console.log(id);

    if (!id) {
      return NextResponse.json({ message: 'Missing user ID in request parameters' }, { status: 400 });
    }

    // Validate data (optional, based on your needs)
    const { newPassword } = body;
    if (!newPassword) {
      return NextResponse.json({ message: 'New password is required' }, { status: 400 });
    }

    // Hash the new password before saving it (make sure to import and use a proper hashing library, e.g., bcrypt)
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true }
    );

    if (updatedUser) {
      return NextResponse.json({ success: true, message: 'Password updated successfully.' }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ success: false, message: 'Error updating password' }, { status: 500 });
  }
}
