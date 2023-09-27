const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1'
});

const util = require("../utils/util");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'aahshaikh-habitsdb';


async function gethabit(userInfo) {
  const usermail = userInfo.usermail;

  const params = {
    TableName: userTable,
    FilterExpression: "begins_with(habitID, :usermail)",
    ExpressionAttributeValues: {
      ":usermail": usermail + "_"
    }
  };

  try {
    const result = await dynamodb.scan(params).promise();
    const habits = result.Items;

    return util.buildResponse(200, {
      habits: habits
    });
  } catch (error) {
    console.error(error);
    return util.buildResponse(500, { error: 'Failed to retrieve user habits' });
  }
}

module.exports.gethabit = gethabit;