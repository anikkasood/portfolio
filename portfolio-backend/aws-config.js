const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
require('dotenv').config();

// Initialize the DynamoDB Client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  // While developing locally, the SDK will automatically find your 
  // credentials in ~/.aws/credentials or your environment variables
});

const docClient = DynamoDBDocumentClient.from(client);

module.exports = { docClient };