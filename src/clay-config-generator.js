module.exports = {
  defaultTemplate: (serviceName, serviceType, serviceInputs, username) => {
    return {
      accountName: `public`,
      serviceName: `${serviceName}`,
      username: `${username}`,
      serviceDescription: 'A service that takes in bits and moves atoms',
      inputs: serviceInputs,
      serviceDisplayName: `${serviceName}`,
      serviceType: `${serviceType}`
    };
  },
  alexaTemplate: function(serviceName, serviceType, username) {
    return this.defaultTemplate(serviceName, serviceType, username)
  }
}
