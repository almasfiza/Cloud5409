const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
})
const util = require("../utils/util");
const bcrypt = require("bcryptjs");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "aahshaikh-usersdb";

// const snsTopicArn = "arn:aws:sns:us-east-1:673619607849:ScoreNotification";
const snsTopicArn = process.env.SNS_TOPIC_ARN;

async function register(userInfo) {
    const fname = userInfo.fname;
    const lname = userInfo.lname;
    const usermail = userInfo.usermail;
    const password = userInfo.password;
    const confirmpassword = userInfo.confirmpassword;
    const score = 0;
    // all the fields should be defined
    if(!fname || !lname || !usermail || !password || !confirmpassword ) {
        return util.buildResponse(401, {
            message: "All fields are required."
        })
    }
    if(password !== confirmpassword ) {
        return util.buildResponse(401, {
            message: "Confirm password does not match with password."
        })
    }

    // check if the user is already registered
    const dynamoUser = await getUser(usermail);
    if(dynamoUser && dynamoUser.usermail) {
        return util.buildResponse(401, {
            message: "User already exists with this email."
        })
    }

    // encrypt the password  using bcrypt
    const encryptedPW = bcrypt.hashSync(password.trim(), 10);
    const user = {
        fname: fname,
        lname: lname,
        usermail: usermail,
        password: encryptedPW,
        score: score
    }

    const saveUserResponse = await saveUser(user);
    if(!saveUserResponse){
        return util.buildResponse(503, {
            message:"Server error. Please try again later."
        })
    }

    // adding the usermail as a subscriber to SNS topic.
    await addSubscriberToSnsTopic(user.usermail);

    return util.buildResponse(200, {usermail: usermail})

}


//dynamo operations
async function getUser(usermail) {
    const params = {
        TableName: userTable,
        Key: {
            usermail: usermail
        }
    }
    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error("There is an error in getting the user: ", error);
    })
}

async function saveUser(user) {
    const params = {
        TableName: userTable,
        Item: user
    }
    return await dynamodb.put(params). promise().then(() => {
        return true;
    }, error => {
        console.error("There is an error in saving the user: ", error);
    })

}

async function addSubscriberToSnsTopic(email) {
    const sns = new AWS.SNS();
    const subscribeParams = {
        Protocol: 'email',
        TopicArn: snsTopicArn,
        Endpoint: email
    };

    try {
        await sns.subscribe(subscribeParams).promise();
        console.log("Successfully added ${email} to SNS topic.");
    } catch (error) {
        console.error("Error in subscribing to SNS:", error);
    }
}

module.exports.register = register;