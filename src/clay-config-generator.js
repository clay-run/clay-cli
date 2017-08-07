module.exports = {
  defaultTemplate: (serviceName, serviceType, serviceInputs, serviceDescription, username) => {
    return {
      serviceName: `${serviceName}`,
      username: `${username}`,
      serviceDescription: `${serviceDescription}`,
      inputs: serviceInputs,
      serviceDisplayName: `${serviceName}`,
      serviceType: `${serviceType}`
    };
  },
  alexaTemplate: function(serviceName, serviceType, username) {
    return this.defaultTemplate(serviceName, serviceType, username)
  }
}
