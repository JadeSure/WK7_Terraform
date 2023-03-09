// Load the AWS SDK for Node.js
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
// Create the DynamoDB service object
const client = new DynamoDBClient({
  region: 'ap-southeast-2',
});
('use strict');

export const handler = async (event) => {
  let name = 'you';
  let city = 'World';
  let time = 'day';
  let day = '';
  let responseCode = 200;
  let response = {
    statusCode: responseCode,
    body: undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  console.log('request: ' + JSON.stringify(event));

  /*    if (event.queryStringParameters && event.queryStringParameters.name) {
            console.log("Received name: " + event.queryStringParameters.name);
            name = event.queryStringParameters.name;
        }
        if (event.queryStringParameters && event.queryStringParameters.city) {
            console.log("Received city: " + event.queryStringParameters.city);
            city = event.queryStringParameters.city;
        }
        if (event.headers && event.headers['day']) {
            console.log("Received day: " + event.headers.day);
            day = event.headers.day;
        }
    */

  //1.1 all four attributes passed in from API call body, and not query parameter or header.
  if (event.body) {
    let body = JSON.parse(event.body);
    if (body.name) name = body.name;
    else {
      response.statusCode = 400;
      response.body = 'Missing name';
      return response;
    }

    if (body.city) city = body.city;
    else {
      response.statusCode = 400;
      response.body = 'Missing city';
      return response;
    }

    if (body.day) day = body.day;
    else
      day = new Date(
        new Date().toLocaleString('en-us', { timeZone: 'Australia/Brisbane' })
      ).toLocaleString('en-us', { weekday: 'long' });

    if (body.time) time = body.time;
    else {
      let hour = new Date(
        new Date().toLocaleString('en-us', { timeZone: 'Australia/Brisbane' })
      ).getHours();
      if (hour < 6 || hour > 18) time = 'evening';
      else if (hour < 12) time = 'morning';
      else time = 'afternoon';
    }
  } else {
    response.statusCode = 400;
    response.body = 'Must have body';
    return response;
  }

  let greeting = `Good ${time}, ${name} of ${city}.`;
  if (day) greeting += ` Happy ${day}!`;

  let responseBody = {
    message: greeting,
    input: event,
  };

  // The output from a Lambda proxy integration must be
  // in the following JSON object. The 'headers' property
  // is for custom response headers in addition to standard
  // ones. The 'body' property  must be a JSON string. For
  // base64-encoded payload, you must also set the 'isBase64Encoded'
  // property to 'true'.
  response.body = JSON.stringify(responseBody);

  console.log('response: ' + JSON.stringify(response));

  let params = {
    TableName: 'HelloWorldTable',
    Item: {
      id: { N: new Date().valueOf().toString() },
      name: { S: name },
      city: { S: city },
    },
  };
  console.log('params: ', params);
  const putItemCommand = new PutItemCommand(params);

  try {
    const data = await client.send(putItemCommand);
    console.log('Item added successfully:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error adding item:', err);
  }

  return response;
};
