import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('GenerateUploadUrl:')

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const eventsTable = process.env.EVENTS_TABLE
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const eventId = event.pathParameters.eventId
  const userId = getUserId(event)

  logger.info('userId', { userId, urlExpiration })
  const isValidEventId = await eventExists(eventId, userId)


  if (!isValidEventId) {
    return {
      statusCode: 404,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Event does not exist'
      })
    }
  }

  const imageId = uuid.v4()
  await createImage(eventId, imageId, event, userId)

  const url = getUploadUrl(imageId)

  return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}


async function eventExists(eventId: string, userId: string) {
  logger.info('userId', { userId, eventId })

  const result = await docClient
    .get({
      TableName: eventsTable,
      Key: {
        eventId,
        userId
      }
    })
    .promise()

  logger.info('Get event: ', result)
  return !!result.Item
}

async function createImage(eventId: string, imageId: string, event: any, userId: string) {
  const timestamp = new Date().toISOString()
  const newImage = JSON.parse(event.body)
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
  logger.info('eventItem', { eventId, imageId, userId, event})
  const key = {
    userId,
    eventId
  }
  const newItem = {
    eventId,
    timestamp,
    imageId,
    ...newImage,
    imageUrl
  }
  logger.info('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: imagesTable,
      Item: newItem
    })
    .promise()

  const updateUrlOnEvent = {
    TableName: eventsTable,
    Key: key,
    UpdateExpression: "set attachmentUrl = :a",
    ExpressionAttributeValues:{
      ":a": imageUrl
  },
  ReturnValues:"UPDATED_NEW"
  }
  await docClient.update(updateUrlOnEvent).promise()

  return newItem
}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: +urlExpiration
  })
}
