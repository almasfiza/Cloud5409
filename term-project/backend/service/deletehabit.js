const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const util = require("../utils/util");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'aahshaikh-habitsdb';

async function deletehabit(userInfo) {
  const usermail = userInfo.usermail;
  const habit = userInfo.habit;
  const habitID = usermail + "_" + habit;

  const params = {
    TableName: userTable,
    Key: {
      habitID: habitID,
      usermail: usermail
    },
    ReturnValues: "ALL_OLD"
  };

  try {
    const result = await dynamodb.delete(params).promise();
    if (result.Attributes) {
      return util.buildResponse(200, {
        message: "Habit deleted successfully.",
        deletedItem: result.Attributes
      });
    } else {
      return util.buildResponse(404, {
        error: 'Habit not found for deletion.'
      });
    }
  } catch (error) {
    console.error(error);
    return util.buildResponse(500, { error: 'Failed to delete user habit' });
  }
}

module.exports.deletehabit = deletehabit;
