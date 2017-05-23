// Require your files or libraries here. You can use npm to install libraries.

exports.handler = function (event, context, callback) {
    // Write your code here

    /*
     Your service only responds to POST requests
     any variables passed are found in event.body
     eventVars is a convenience that parses any JSON
     objects that were passed in the POST request
     */

    var eventVars = JSON.parse(event.body);

    /*
     JSON Stringify the result of the service call
     In this example we simply pass back whatever parameters
     were sent to the service
     */

    var result = JSON.stringify(eventVars)

    // Do not change this: This ends the service call with the results, HTTP 200 status code and headers to allow cross origin requests and to indicate that the result is JSON.
    success(result);
}

/**
 * Sends back a JSON object and ends the microservice.
 * @param {*JSON} result
 */
function success(result) {
    context.succeed({
        "body": result,
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}
