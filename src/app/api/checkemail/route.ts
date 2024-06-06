import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';
import { z } from 'zod';
import { passwordresetSchema } from '@/schemas/passwordresetSchema';

const EmailQuerySchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    console.log(request.url)
    console.log(searchParams)
    const queryParams = {
      email: searchParams.get('email'),
    };

    console.log(queryParams)

    const result = EmailQuerySchema.safeParse(queryParams);
    console.log(result)

    if (!result.success) {
      const emailErrors = result.error.format().email?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            emailErrors?.length > 0
              ? emailErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    const { email } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      email,
      });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: true,
          message: 'Email verified',
        },
        { status: 200 }
      );
    }
    
    if (!existingVerifiedUser) {
        return Response.json(
          {
            success: false,
            message: 'Email not verified',
          },
          { status: 200 }
        );
      }
  } catch (error) {
    console.error('Error checking email:', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking email',
      },
      { status: 500 }
    );
  }
}
