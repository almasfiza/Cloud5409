
const updatescoreService = require('./service/updatescore');
const util = require('./utils/util');

const healthPath = "/health";
const updatescorePath = "/updatescore";


const handler = async (event) => {
   console.log("Request Event: ", event);
   const method = event.httpMethod ?? event.requestContext.http.method;
   const path = event.path ?? event.rawPath;
   let response;
   switch(true) {
     case method === "GET" && path === healthPath:
       response = util.buildResponse(200);
       break;
     case method === "POST" && path === updatescorePath:
       //extract the request body from the event
       const scoreBody = JSON.parse(event.body);
       response = await updatescoreService.updatescore(scoreBody);
       break;
   
     default:
       response = util.buildResponse(404, "404 Not Found");
   } 
   return response;
};

module.exports.handler = handler;