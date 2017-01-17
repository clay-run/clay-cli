module.exports = {
  defaultTemplate: (serviceName) => {
    return {
      accountName: `public`,
      serviceName: `${serviceName}`,
      serviceDescription: 'A service that takes in bits and moves atoms',
      inputs: [
        {
          "name": "varNameInCode",
          "type": "text",
          "displayName": "Human Readable Name of Variable"
        }
      ],
      serviceDisplayName: `${serviceName}`
    };
  },
  alexaTemplate: function(serviceName) {
    return this.defaultTemplate(serviceName)
  }
}
