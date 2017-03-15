module.exports = {
  defaultTemplate: (serviceName, serviceType, username) => {
    return {
      accountName: `public`,
      serviceName: `${serviceName}`,
      username: `${username}`,
      serviceDescription: 'A service that takes in bits and moves atoms',
      inputs: [
        {
          "name": "myVariable",
          "type": "text",
          "displayName": "Human Readable Variable",
          "description": "Description of variable"
        }
      ],
      serviceDisplayName: `${serviceName}`,
      serviceType: `${serviceType}`
    };
  },
  alexaTemplate: function(serviceName, serviceType, username) {
    return this.defaultTemplate(serviceName, serviceType, username)
  }
}
