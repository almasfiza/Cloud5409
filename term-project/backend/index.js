const addhabitService = require('./service/add');
const completeService = require('./service/complete');
const gethabitService = require('./service/gethabit');
const deletehabitService = require('./service/deletehabit');
const util = require('./utils/util');

const healthPath = '/health';
const addhabitPath = '/addhabit';
const completePath = '/complete';
const gethabitPath = '/gethabit';
const deletehabitPath = "/deletehabit";

const handler = async (event) => {
  const method = event.httpMethod ?? event.requestContext.http.method;
  const path = event.path ?? event.rawPath;
  console.log("Request Event: ", event);
  let response;
  switch(true) {
    case method === "GET" && path === healthPath:
      response = util.buildResponse(200);
      break;
    case method === 'POST' && path == addhabitPath:
      const habitBody = JSON.parse(event.body);
      response = await addhabitService.add(habitBody);
      console.log("Habit added");
      break;
      case method === 'POST' && path == gethabitPath:
        const gethabitBody = JSON.parse(event.body);
        response = await gethabitService.gethabit(gethabitBody);
        console.log("Getting habits");
        break;
    case method === "POST" && path == completePath:
      const completehabitBody = JSON.parse(event.body);
      response = await completeService.complete(completehabitBody);
      console.log("Habit completed for today.");
      break;
    case method === "POST" && path == deletehabitPath:
      const deletehabitBody = JSON.parse(event.body);
      response = await deletehabitService.deletehabit(deletehabitBody);
      console.log("Habit deleted.");
      break;
    default:
      response = util.buildResponse(404, "404 Not Found");
  }
  return response;
};

module.exports.handler = handler;