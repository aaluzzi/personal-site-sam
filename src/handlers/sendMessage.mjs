import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient();

export const sendMessageHandler = async (event) => {
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

  const email = body.email;
  const message = body.message;
  
  if (!email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid JSON format'
      }),
    };
  }

  const params = {
    Destination: {
      ToAddresses: ['austinaluzzi@gmail.com']
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `From: ${email}\n\n${message}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Contact form message from ${email}`
      }
    },
    Source: 'contact@austinaluzzi.com',
  };

  try {
    //name is from honeypot field
    if (!body.name) {
        await ses.send(new SendEmailCommand(params));
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Message sent!',
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to send message.',
        error: err.message
      }),
    };
  }
};
