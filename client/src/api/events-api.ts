import { apiEndpoint } from '../config'
import { Event } from '../types/Event';
import { CreateEventRequest } from '../types/CreateEventRequest';
import Axios from 'axios'
import { UpdateEventRequest } from '../types/UpdateEventRequest';

export async function getEvents(idToken: string): Promise<Event[]> {
  console.log('Fetching events')

  const response = await Axios.get(`${apiEndpoint}/events`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Events:', response.data)
  return response.data.items
}

export async function createEvent(
  idToken: string,
  newEvent: CreateEventRequest
): Promise<Event> {
  const response = await Axios.post(`${apiEndpoint}/events`,  JSON.stringify(newEvent), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchEvent(
  idToken: string,
  eventId: string,
  updatedEvent: UpdateEventRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/events/${eventId}`, JSON.stringify(updatedEvent), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteEvent(
  idToken: string,
  eventId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/events/${eventId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  eventId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/events/${eventId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
