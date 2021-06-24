

import * as uuid from 'uuid'

import { EventItem } from '../models/EventItem'
import { EventUpdate } from '../models/EventUpdate'
import { Event } from '../dataLayer/event'
import { CreateEventRequest } from '../requests/CreateEventRequest'
import { UpdateEventRequest } from '../requests/UpdateEventRequest'

const event = new Event()

export async function getAllEvents(userId: string): Promise<EventItem[]> {
  return event.getAllEvents(userId)
}

export async function createEvent(
  createEventRequest: CreateEventRequest,
  userId: string
): Promise<EventItem> {

  const eventId = uuid.v4()

  return await event.createEvent({
    eventId,
    userId,
    done: false,
    createdAt: new Date().toISOString(),
    ...createEventRequest
  })
}

export async function updateEvent(
  updateEventRequest: UpdateEventRequest,
  eventId: string,
  userId: string
): Promise<EventUpdate> {

  return await event.updateEvent(
    eventId,
    userId,
    updateEventRequest
  )
}

export async function deleteEvent(
  eventId: string,
  userId: string
): Promise<Record<string, boolean>> {
  return await event.deleteEvent(eventId, userId)
}
