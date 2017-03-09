module.exports = {
  defaultTemplate: () => {
    return {
      "myVariable": "testValueOfVar"
    }
  },
  alexaTemplate: () => {
    return {
      "session": {
        "sessionId": "SessionId.82cd75e0-bbde-40b4-946a-1a0b1d03c6ed",
        "application": {
          "applicationId": "amzn1.ask.skill.f3ebaad1-a551-4064-9b00-af8a0df7dc59"
        },
        "attributes": {},
        "user": {
          "userId": "amzn1.ask.account.AG6GL5W4XLRRXHNUVFRCTMIHBA6B7SGSXOCKUO2D4DBF52JFZCGPYVYSJAGV5ZVGGR3COMF4OBQL5I2PXKMUDLAZJXP3URUBX2JBUSDTELNBHT7P4JLC45JTGE2ME34MGBGOQZHGYTORDXXPLT45OGXSRDLFYZT7XU2FJVL47SLWB3KROWAZKAD5UGORK3QRQMXUZBSP5Y2QIPQ"
        },
        "new": true
      },
      "request": {
        "type": "IntentRequest",
        "requestId": "EdwRequestId.e5805e4f-9bf0-4868-99f0-db2d92d01739",
        "locale": "en-US",
        "timestamp": "2017-01-14T18:34:13Z",
        "intent": {
          "name": "GetAwesomeSaying",
          "slots": {}
        }
      },
      "version": "1.0"
    }
  }
}
