import * as XAWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { EventItem } from '../models/EventItem'
import { EventUpdate } from '../models/EventUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('EventClass')
export class Event {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly eventsTable = process.env.EVENTS_TABLE) {
  }

  async getAllEvents(userId: string): Promise<EventItem[]> {
    logger.info('Getting all events', { userId })

    const result = await this.docClient.query({
      TableName : this.eventsTable,
      IndexName: "UserIdIndex",
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
  
    const items = result.Items
    return items as EventItem[]
  }

  async createEvent(event: EventItem): Promise<EventItem> {
    await this.docClient.put({
      TableName: this.eventsTable,
      Item: event
    }).promise()

    return event
  }

  async updateEvent(eventId: string, userId: string, updatedEvent: EventUpdate): Promise<EventUpdate> {
    logger.info('eventItem', eventId)
    
    const key = { 
      userId,
      eventId
    }
   await this.docClient.update({
      TableName: this.eventsTable,
      Key: key,  
      UpdateExpression: "SET #n = :n, date = :date, done = :done",
      ExpressionAttributeValues: {
        ":n": updatedEvent.name,
        ":date": updatedEvent.date,
        ":done": updatedEvent.done,
      },
      ExpressionAttributeNames:{
        "#n": "name"
      },
      ReturnValues:"UPDATED_NEW"
    }).promise()
    
    return updatedEvent;
  }

  async deleteEvent(eventId: string, userId: string): Promise<Record<string, boolean>> {
  
    const key = {
      userId,
      eventId
    }
    await this.docClient.delete({
      TableName: this.eventsTable,
      Key: key
    }).promise()

    return {
      message: true
    }
  }
}


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')

    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
