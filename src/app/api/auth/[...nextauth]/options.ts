import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Email or Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });
                    if (!user) {
                        console.error('No user found with this email or username');
                        throw new Error('No user found with this email or username');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        console.log('User authenticated successfully:', user);
                        return user;
                    } else {
                        console.error('Incorrect password');
                        throw new Error('Incorrect password');
                    }
                } catch (err: any) {
                    console.error('Error in authorize:', err.message);
                    throw new Error(err.message);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log('JWT Callback - token before:', token, 'user:', user);
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.email = user.email;
            }
            console.log('JWT Callback - token after:', token);
            return token;
        },
        async session({ session, token }) {
            console.log('Session Callback - session before:', session, 'token:', token);
            if (token) {
                session.user = {
                    _id: token._id,
                    username: token.username,
                    email: token.email,
                };
            }
            console.log('Session Callback - session after:', session);
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/sign-in',
    },
};
