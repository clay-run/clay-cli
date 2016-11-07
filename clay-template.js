exports.handler = function(event, context, callback) {
  // Require your files
  // Write code
  // Use variables
  // context.body
  // Success return
  context.succeed({"body": JSON.stringify(gamesOfWeek), "statusCode": 200, "headers": {"Content-Type": "application/json"}});
}



