import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamo = DynamoDBDocumentClient.from(client);

export const insertVisitorHandler = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid JSON format',
        error: err.message
      }),
    };
  }

  const visitorId = body.visitor_id;
  
  if (!visitorId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid JSON format'
      }),
    };
  }

  try {
    await dynamo.send(new PutCommand({
      TableName: "Visitors",
      Item: {
        id: visitorId
      }
    }));
    
    console.log(`Successfully inserted visitor with id: ${visitorId}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Visitor inserted successfully!',
        id: visitorId
      }),
    };
  } catch (err) {
    console.error('Error inserting visitor:', err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to insert visitor',
        error: err.message
      }),
    };
  }
};
