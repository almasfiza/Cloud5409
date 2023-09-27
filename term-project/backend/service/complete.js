const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1'
});

const util = require("../utils/util");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'aahshaikh-habitsdb';

async function complete(userInfo) {
    const usermail = userInfo.usermail;
    const habit = userInfo.habit;
    const habitID = usermail + "_" + habit;
  
    const params = {
      TableName: userTable,
      Key: {
        habitID: habitID,
        usermail: usermail
      },
      UpdateExpression: "SET #days = #days + :increment",
      ExpressionAttributeNames: {
        "#days": "days"
      },
      ExpressionAttributeValues: {
        ":increment": 1
      },
      ReturnValues: "ALL_NEW"
    };
  
    try {
      const result = await dynamodb.update(params).promise();
      const updatedDays = result.Attributes.days;
  
      return util.buildResponse(200, {
        message: "Habit days incremented successfully.",
        days: updatedDays
      });
    } catch (error) {
      console.error(error);
      return util.buildResponse(500, { error: 'Failed to increment habit days' });
    }
  }

  module.exports.complete = complete;
  