module.exports = {
  defaultTemplate: (serviceName) => {
    return {
      accountName: `public`,
      serviceName: `${serviceName}`,
      serviceDescription: 'A service that takes in bits and moves atoms',
      inputs: [
        {
          "name": "myVariable",
          "type": "text",
          "displayName": "Human Readable Variable",
          "descriptipn": "Description of variable"
        }
      ],
      serviceDisplayName: `${serviceName}`
    };
  },
  alexaTemplate: function(serviceName) {
    return this.defaultTemplate(serviceName)
  }
}
