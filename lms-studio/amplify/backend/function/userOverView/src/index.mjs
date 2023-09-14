// const AWS = require('aws-sdk');
// exports.handler = async (event, context) => {
//   // Specify your AWS Cognito user pool ID
//   const userPoolId = 'ap-southeast-1_Q7OqQx1fX';
  
//   // Create a Cognito service object
//   const cognito = new AWS.CognitoIdentityServiceProvider();
  
//   // Set the parameters for the listUsers API
//   const params = {
//     UserPoolId: userPoolId
//   };
//   try {
//     // Call the listUsers API
//     const response = await cognito.listUsers(params).promise();
//     // Process the response
//     const users = response.Users;
    
//     console.log("line 19");
    
//     users.forEach(user => {
//       const username = user.Username;
//       console.log('Username:', username);
//     });
//     // Return a response
//     return {
//       statusCode: 200,
//       body: users
//     };
//   } catch (error) {
//     // Handle the error
//     console.error('Error:', error);
//     return {
//       statusCode: 500,
//       body: 'An error occurred while retrieving the user list.'
//     };
//   }
// };

import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

// const SOUTHEAST_REGION = "ap-southeast-1:";

export const handler = async(event) => {
  const client = new CognitoIdentityProviderClient({ });
  const userPoolId = 'ap-southeast-1_Q7OqQx1fX';
  const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
    };
  const input = {
    UserPoolId: userPoolId,
  }
  
  const command = new ListUsersCommand(input);
  try {
    const response = await client.send(command);
    // console.log('response:', response);
    const users = response.Users;

    // users.forEach((user) => {
    //   user.Attributes[0].Value = SOUTHEAST_REGION + user.Attributes[0].Value
    // });

    return {
      statusCode: 200,
      body: JSON.stringify(users),
      headers
    };

  } catch(error) {
    // Handle the error
    console.log('Error:', error);
    return {
      statusCode: 500,
      body: 'An error occurred while retrieving the user list.',
      headers
    };
  }
}
