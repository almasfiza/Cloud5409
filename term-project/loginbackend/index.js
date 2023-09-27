const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const util = require('./utils/util');

const healthPath = "/health";
const registerPath = "/register";
const loginPath = "/login";
const verifyPath = "/verify";


const handler = async (event) => {
   console.log("Request Event: ", event);
   const method = event.httpMethod ?? event.requestContext.http.method;
   const path = event.path ?? event.rawPath;
   let response;
   switch(true) {
     case method === "GET" && path === healthPath:
       response = util.buildResponse(200);
       break;
     case method === "POST" && path === registerPath:
       //extract the request body from the event
       const registerBody = JSON.parse(event.body);
       response = await registerService.register(registerBody);
       break;
     case method === "POST" && path === loginPath:
       // extractt the request body
       console.log(event);
       const loginBody = JSON.parse(event.body);
       response = await loginService.login(loginBody);
       break;
     case method === "POST" && path === verifyPath:
       const verifyBody = JSON.parse(event.body);
       response = verifyService.verify(verifyBody);
       break;
     default:
       response = util.buildResponse(404, "Checking 404");
   } 
   return response;
};

module.exports.handler = handler;