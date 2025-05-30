// app/api/teams/route.ts

import { getAllEvents, createEvent } from '@/app/services/eventService';

export async function GET() {

  try {
    const events = await getAllEvents();
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },

    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response('Failed to fetch events', { status: 500 });
  }
}

export async function POST(request: Request) {

  try {
    const { title, description, location, startDate, endDate,
      organizer, organizerType, category, capacity } = await request.json();

    const newEvent = await createEvent(title, description, location, startDate, endDate,
      organizer, organizerType, category, capacity);

    return new Response(JSON.stringify({
      "message": "Event created successfully with id: " + newEvent._id,
      "event": newEvent
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response('Failed to create event', { status: 500 });
  }
}