var admin = require("firebase-admin");

var serviceAccountKey =require ('./serviceAccountKey')

console.log(serviceAccountKey)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

module.exports=admin