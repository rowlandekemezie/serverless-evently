/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateEventRequest {
  name: string
  date: string
  done: boolean
}
