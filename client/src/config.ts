// Serverless API id
const apiId = 'uhxxaw5vk3'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-2.amazonaws.com/dev`

// auth0 configurations
export const authConfig = {
  domain: 'rownet.auth0.com',            // Auth0 domain
  clientId: '1MxNWC6vwgXtFhz6qFeGPK2Xv81CbasZ',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
