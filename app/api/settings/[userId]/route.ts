// app/api/settings/[userId]/route.ts
import { getSettings, updateSettings } from '../../../services/settingServices/settingService';
import { NextRequest } from 'next/server';

// Note - server side to only use fetch and not axios

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params; // get id from params to comply with dyanmic routes


  // Check if the ID parameter is missing
  if (!userId) {
    return new Response('userId query parameter is required', { status: 400 });
  }

  try {
    const settings = await getSettings(userId);

    // If user not found
    if (!settings) {
      return new Response('User not found', { status: 404 });
    }

    // Return the user data a
    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return new Response(`Failed to fetch settings: \n${error}`, { status: 500 });
  }

}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params; // get id from params to comply with dyanmic routes


  // Check if the ID parameter is missing
  if (!userId) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const updatedSettingData = await request.json(); // Get the updated message data from the request body
    const settingType = request.nextUrl.searchParams.get('type');
    if (!settingType) {
      return new Response('Setting Type Not Defined', { status: 400 });
    }
    const Setting = await updateSettings(userId, parseInt(settingType), updatedSettingData);

    // If message not found
    if (!Setting) {
      return new Response(JSON.stringify({ error: 'Setting not found or invalid ID' }), { status: 404 });
    }

    // Return the updated message data 
    return new Response(JSON.stringify(Setting), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating Setting:', error);
    return new Response('Failed to update Setting', { status: 500 });
  }
}