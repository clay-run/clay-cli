module.exports = {
  defaultTemplate: (clayConfigJson, username) => {
    return {
      "name": `${clayConfigJson.serviceName}`,
      "description": `${clayConfigJson.serviceDescription}`,
      "authors": `${username}`,
      "version": "0.0.1",
      "private": true,
      "dependencies": {
      },
      "scripts": {
        "start": `node ${clayConfigJson.serviceName}`
      }
    }
  },
  alexaTemplate:  (clayConfigJson, username) => {
    return {
      "name": `${clayConfigJson.serviceName}`,
      "description": `${clayConfigJson.serviceDescription}`,
      "authors": `${username}`,
      "version": "0.0.1",
      "private": true,
      "dependencies": {
        "clay-alexa-sdk" : "*"
      },
      "scripts": {
        "start": `node ${clayConfigJson.serviceName}`
      }
    }
  }
}

