const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
})
const util = require("../utils/util");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "aahshaikh-usersdb";

async function login(user) {
    if(!user) {
        return util.buildResponse(401, {
            message: "Email and password should be provided."
        })
    }
    const usermail = user.usermail;
    const password = user.password;

    if(!usermail || !password) {
        return util.buildResponse(401, {
            message: "Email and password should be provided."
        })
    }

    const dynamoUser = await getUser(usermail);
    // if the user is not in the db
    if(!dynamoUser || !dynamoUser.usermail) {
        return util.buildResponse(403, { 
            message: 'No such user in the DB.'
        });
    }

    // password check
    if(!bcrypt.compareSync(password, dynamoUser.password)) {
        return util.buildResponse(403, {
            message: "Incorrect Password."
        })
    }

    // if the credentials are correct
    const userInfo = {
        fname: dynamoUser.fname,
        lname: dynamoUser.lname,
        usermail: dynamoUser.usermail,
        score: dynamoUser.score
    }

    const token = auth.generateToken(userInfo)
    const response = {
        user: userInfo,
        token: token
    }
    return util.buildResponse(200, response);
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


module.exports.login = login;