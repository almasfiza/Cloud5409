function buildResponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
      },
      body: JSON.stringify(body)
    }
  }

module.exports.buildResponse = buildResponse;