const AWS = require('aws-sdk');
exports.handler = async (event, context) => {
  // Specify your AWS Cognito user pool ID
  const userPoolId = 'ap-southeast-1_MDYWuz44c';
  
  // Create a Cognito service object
  const cognito = new AWS.CognitoIdentityServiceProvider();
  
  // Set the parameters for the listUsers API
  const params = {
    UserPoolId: userPoolId
  };
  try {
    // Call the listUsers API
    const response = await cognito.listUsers(params).promise();
    // Process the response
    const users = response.Users;
    
    console.log("line 19");
    
    users.forEach(user => {
      const username = user.Username;
      console.log('Username:', username);
    });
    // Return a response
    return {
      statusCode: 200,
      body: users
    };
  } catch (error) {
    // Handle the error
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'An error occurred while retrieving the user list.'
    };
  }
};