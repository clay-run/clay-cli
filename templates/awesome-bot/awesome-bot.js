// Require your files or libraries here. You can use npm to install libraries.
var Alexa = require('clay-alexa-sdk');

// Array of possible Awesome things that Alexa can respond with.
const awesomeSayings = [
  "You are a force of nature.",
  "You are an inspiration to everyone that meets you.",
  "You are my Arnold",
  "You are incredible!",
  "Bill Gates wanted to know if you have any tips for him?",
  "how are you so fucking good at what you do?",
  "Boom-shacklaka You're on Fire",
  "I marvel at your accomplishments on an hourly basis",
  "Who is the most awesome person today? You. You are.",
  "I'm obsessed with you",
  "When you code, it's like you don't write code, you paint it. It's incredible.",
  "Everything is awesome. Everything is cool when you're part of a team"
]

exports.handler = function(event, context, callback) {

  // Write your Skill handler code here. This is where you
  // specify how your skill should respond. Make sure to write
  // a handler for each of your Intent types.

  var handlers = {

    // Intent: GetAwesomeSaying returns a random saying from the
    // array of possible sayings awesomeSayings
    'GetAwesomeSaying': function(){

      // Choose a random saying from the awesomeSayings array.
      const randomSayingIndex = Math.floor(Math.random() * awesomeSayings.length);
      const randomSaying = awesomeSayings[randomSayingIndex ];

      // Tell Alexa to speak that saying.
      this.emit(':tell', randomSaying);
    },

    // Intent: GetAwesomeSaying returns a random saying from the
    // array of possible sayings awesomeSayings
    'GetAwesomeNumber': function(){
      // Choose a random number between 1-100
      const randomNumber = Math.floor(Math.random() * 100);

      // Tell Alexa to speak that number
      this.emit(':tell', "The best number is " + randomNumber);
    },

    'Unhandled': function(){
      this.emit(':tell', "I'm not sure what you're asking for");
    }
  };

// The event.body is the request object that has come in via HTTPS.
// We need to JSON parse the body which holds the object since it's
// been sent over HTTP. That object has information about what intent was passed.
// You can see a sample of what the event body looks like in test-data.json
var alexa = Alexa.handler(JSON.parse(event.body), context);


// The register handler function sets up the handlers you specified above,
// and then alexa.execute() calls the appropriate handler based on the Intent
// passed in the Alexa request object (which here is in the event.body)
alexa.registerHandlers(handlers);
alexa.execute();

}
