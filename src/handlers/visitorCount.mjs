import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const visitorCountHandler = async (event) => {
  try {
    const result = await dynamo.send(new ScanCommand({
      TableName: "Visitors",
      Select: "COUNT"  
    }));
    return {
      statusCode: 200,
      body: JSON.stringify({
        count: result.Count 
      }),
    };
  } catch (err) {
    console.error('Error getting visitor count:', err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to get visitor count',
        error: err.message,
      }),
    };
  }
};
