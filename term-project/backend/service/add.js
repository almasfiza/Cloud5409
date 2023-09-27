const AWS = require('aws-sdk');
const uuid = require('uuid');
AWS.config.update({
  region: 'us-east-1'
});

const util = require("../utils/util");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'aahshaikh-habitsdb';

async function add(userInfo) {
  const usermail = userInfo.usermail;
  const habit = userInfo.habit;
  const habitID = usermail+"_"+habit; // Generate a unique habit ID

  // Set the initial value of days to 0
  const days = 0;

  const params = {
    TableName: userTable,
    Item: {
      habitID: habitID,
      usermail: usermail,
      habit: habit,
      days: days
    }
  };

  try {
    await dynamodb.put(params).promise();
    return util.buildResponse(200, {
        message: "Habit added successfully."

    })
  } catch (error) {
    console.error(error);
    return util.buildResponse(500, { error: 'Failed to add user habit' });
  }
}

module.exports.add = add;
