var chalk    = require('chalk')
 ,  print    = console.log
 ,  fs       = require('fs-extra')
 ,  path     = require('path')
 ,  decompress  = require('decompress')
 ,  rp       = require('request-promise-native');


module.exports = function(serviceName) {

  const dir                          = path.resolve(process.cwd(), `${serviceName}`)
  var getFunctionOptions = {
    uri: this.apis.downloadApi,
    method: 'POST',
    body: {
      apiToken: this.credentials.token,
      functionName: serviceName
    },
    timeout: 0,
    json: true
  }


  rp(getFunctionOptions)
  .then((response) => {
    console.log(response);
    var downloadOptions = {
      uri: response.Code.Location,
      method: 'GET',
      timeout: 0,
      encoding: null,
      json: true
    }
    return rp(downloadOptions)
  })
  .then((downloadedCode) => {
    fs.writeFile(`${dir}.zip`, downloadedCode, (err) => {
      console.log(err);
      return decompress(`${dir}.zip`, `${dir}`)
    });
  })
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    if(err.statusCode == 401) print(USER_NOT_AUTHORIZED_ERR)
    process.exit();
  })

}


