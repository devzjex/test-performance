import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('accessToken');

    return NextResponse.json({ code: 200, message: 'Logout successful' });
  } catch (error) {
    console.error('Error clearing cookies:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
