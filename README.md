<img src="http://i.imgur.com/MJjxLOv.png" width="474px">

---

**This repo is the command line tool for using Clay - The fastest way to create and deploy microservices.**

You can learn more here: <https://www.clay.run>

## What is Clay?
[Clay](https://www.clay.run) is:

1. A set of tools that allow you to create and deploy API endpoints (microservices) in seconds.
2. A community and registry for those microservices.

Think of it like Github if the code at each repository was running and not static. The benefit of this is that your code is a living service that:
- Can be used in any language - every function you write instantly becomes an API that can be used by someone in whatever language they work in.
- People can test out via our microservice UI
- Provides you a way to see how people use your service via our logs & helps you catch errors you might hit.

We're in early days. Get involved or ask questions by opening up Github issues or chatting with us on [Gitter](https://gitter.im/clay-run/Lobby?source=github).

## What Kinds of Things Can I Use Clay For
- Building an app powered entirely by microservices
- Programmable Web Hooks
- Power Your Alexa Skill or Slack Bot
- Data Processing & Enrichment
- Scraping, Screenshoting & other things that require Headless Browsers

Build your own microservices or browse our list of [publicly available microservices](https://www.clay.run/public/services)

## Whatever You Wish There Was an API or Microservice For - just leave it in the Issues!

## Introduction

Clay-Cli is a command line tool that allows you to quickly create microservices using Clay.

We currently support nodejs and the code is hosted as an Amazon Lambda cloud function. This means that the microservices are auto-scaling and production ready.


## Install

```
$npm install -g clay-run
```


## Usage - Creating microservices
### Signup
The first thing to do is to signup:

```
$ clay signup
```

Follow the interactive instructions. You just need an email, username and a password.

### Create first service
Now you're ready to create your first service

```
$ clay new <your-service-name>
```

Replace <serviceName> with the name of your service. This will create a folder in your current directory with the name of your service. 

if you want to build an Alexa Skill simply run the following

```
$ clay new <your-service-name> -t alexa
```

Next change to your service directory:

```
$ cd your-service-name
```

It should look like this:

```
- your-service-name
	- your-service-name.js
	- package.json
	- node_modules
	- clay-config.json
	- test-data.json
```
### Edit Code
You can now edit the nodejs code in ```your-service-name.js```

Here is what it looks like by default:

```
 // Require your files or libraries here. You can use npm to install libraries.

exports.handler = function(event, context, callback) {
  // Write your code here
  
  // Your service only responds to POST requests
  // Any variables passed are found in event.body
  // eventVars is a convenience that parses any JSON
  // objects that were passed in the POST request
  
  var eventVars = JSON.parse(event.body);
  
  // JSON Stringify the result of the service call
  // In this case we simply pass back whatever parameters
  // were sent to the service
  
  var result = JSON.stringify(eventVars)
  
  // Do not change this: This ends the service call with the results, HTTP 200 status code and headers to allow cross origin requests and to indicate that the result is JSON.
  
  context.succeed({"body": result,
                  "statusCode": 200,
                  "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                  }
  });
}

```
Manage packages with npm and require them the way you would in any regular nodejs project.

### Deploy
To deploy simply run while in the service directory:

```
$ clay deploy
```

###Clay Config File
The config file looks like this:

```
{
  "accountName": "eau",
  "serviceName": "eau",
  "serviceDescription": "A service that takes in bits and moves atoms",
  "inputs": [
    {
      "name": "varNameInCode",
      "type": "text",
      "displayName": "Human Readable Name of Variable"
    }
  ],
  "serviceDisplayName": "eau"
}
```

This is used by Clay to automatically created a visual interface that you can use to run your service and test it. It will also facilitate many features that will help in developing microservices in the future.

```accountName```: is a string that identifies the type of account. Do not change this.

```serviceName```: is a string that identifies your service. Do not change this.

```serviceDescription```: is a description of what your service does.

```inputs```: is an array of JSON objects with a

  - ```name```: variable name that you use in the code
  - ```type```: type of variable. Currently supported are ```text```, ```date```, ```image```, ```file```, ```json```
  - ```displayName```: this is the name that shows up in the Clay's UI to idenitfy this variable
  
```serviceDisplayName```: this is the name that shows up in Clay's UI to identify this service 
  
 


### Run Locally
To run locally call:

```
$ clay run
```
This will run your code and use the ```test-data.json``` file as the key-value pairs that get passed to the function's ```event.body``` variable.

Logging will work normally and output to STDOUT.

### Run on Production from the CLI
Coming soon
### Run on Production from code
Make an HTTP POST call to:

<https://www.clay.run/your_username/your_service_name>

Pass any key-value arguments in the body of your POST call
### Run on Production using the Clay visual interface
You can also view your service at:

<https://www.clay.run/your_username/your_service_name>

Login with your credentials and you will be able to run your service with any parameters that you specified in the clay config file. You will also be able to see the logs.

### See Production Logs
Use:

```
$ clay logs
```

or view the logs at:

<https://www.clay.run/your_username/your_service_name>
 

### List All of Your Services
```
$ clay list
```

### Get info about service
```
$ clay info
```
### Login
```
$ clay login
```

## Create an Alexa Skill

Create a new account using

```
$ clay signup
```

Then

```
$ clay new my-alexa-skill -t alexa
```

For a complete walk through check out [this blog
post](https://medium.com/@nicolaerusan/code-your-first-alexa-skill-in-30-ish-seconds-using-clay-ready-go-8293ee1761ac)



## FAQ
Coming soon
## License
The MIT License (MIT)

Copyright (c) 2016-2017 Clay Labs Inc
