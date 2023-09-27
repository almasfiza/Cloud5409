const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});
const util = require('../utils/util');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'aahshaikh-usersdb';

const sns = new AWS.SNS(); 
const snsTopicArn = process.env.SNS_TOPIC_ARN;

async function updatescore(userInfo) {
  const usermail = userInfo.usermail;
  const score = userInfo.score;

  // Check if the user is already registered
  const dynamoUser = await getUser(usermail);
  if (!dynamoUser || !dynamoUser.usermail) {
    return util.buildResponse(404, {
      message: 'User does not exist with this email.'
    });
  }

  // Update the score in the DynamoDB table
  const updatedUser = {
    ...dynamoUser,
    score: score
  };

  const saveUserResponse = await saveUser(updatedUser);
  if (!saveUserResponse) {
    return util.buildResponse(503, {
      message: 'Server error. Please try again later.'
    });
  }

  if ((score-dynamoUser.score) === 1000) {
    try {
      const subject = 'Productivity: Completed a habit!';
      const message = `Dear user,\n\nCongratulations! You have scored 1000 points. Consistency is the key! Keep working. \n\nBest regards,\nThe Score Team`;

      const params = {
        Message: message,
        Subject: subject,
        TopicArn: snsTopicArn // Replace with the actual ARN of your SNS topic
      };

      await sns.publish(params).promise();
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }

  return util.buildResponse(200, { usermail: usermail, score: score });
}

// Dynamo operations
async function getUser(usermail) {
  const params = {
    TableName: userTable,
    Key: {
      usermail: usermail
    }
  };

  try {
    const response = await dynamodb.get(params).promise();
    return response.Item;
  } catch (error) {
    console.error('Error getting the user: ', error);
    throw error;
  }
}

async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user
  };

  try {
    await dynamodb.put(params).promise();
    return true;
  } catch (error) {
    console.error('Error saving the user: ', error);
    throw error;
  }
}

module.exports.updatescore = updatescore;
