const jwt = require('jsonwebtoken');

function generateToken(userInfo) {
    console.log("userinfo in auth:",userInfo)
    if (!userInfo) {
        return null;
    }
    
    // returning the secret for the token- we will define this in the lambda function
    console.log("envsecret:",process.env.JWT_SECRET)
    return jwt.sign(userInfo, process.env.JWT_SECRET ?? "not found", {
        expiresIn: '1h'
    })
}

function verifyToken(usermail, token) {
    return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
        if(error) {
            return {
                verified: false,
                message: "Invalid token"
            }
        }
        if (response.usermail !== usermail) {
            return {
                verified: false,
                message: "Invalid user"
            }
        }

        return {
            verified: true,
            message: "Verified"
        }
    })
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;