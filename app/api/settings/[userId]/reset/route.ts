// app/api/settings/[userId]/route.ts
import { resetAllSettings } from '../../../../services/settingServices/settingService';
import { resetGeneralSettings } from '../../../../services/settingServices/generalSettingService';
import { resetPrivacySettings } from '../../../../services/settingServices/privacySettingService';
import { resetUserPreferences } from '../../../../services/settingServices/userPreferenceService';
import { NextRequest } from 'next/server';


// Note - server side to only use fetch and not axios

export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params; // get id from params to comply with dyanmic routes

  // Check if the ID parameter is missing
  if (!userId) {
    return new Response('userId query parameter is required', { status: 400 });
  }

  try {
    let settings;
    const settingType = request.nextUrl.searchParams.get('type');

    if (!settingType) {
      settings = await resetAllSettings(userId);
    } else {
      switch (parseInt(settingType)) {
        case 0:
          settings = await resetGeneralSettings(userId);
          break;
        case 1:
          settings = await resetUserPreferences(userId);
          break;
        case 2:
          settings = await resetPrivacySettings(userId)
          break;
        default:
          return new Response('Specified Type is invalid', { status: 400 });
      }
    }


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
    return new Response('Failed to fetch settings', { status: 500 });
  }

}
