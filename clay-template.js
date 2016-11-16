exports.handler = function(event, context, callback) {
  // Require your files
  // Write code
  // Use variables
  // context.body
  // Success return
  var eventVars = JSON.parse(event.body);
  context.succeed({"body": JSON.stringify(eventVars),
                  "statusCode": 200,
                  "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                  }
  });
}



