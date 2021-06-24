import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'

import { CreateEventRequest } from '../../requests/CreateEventRequest'
import { createEvent } from '../../businessLogic/event'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newEvent: CreateEventRequest = JSON.parse(event.body)

  console.log('Processing event: ', event)
  const userId = getUserId(event)

  const item = await createEvent(newEvent, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}
