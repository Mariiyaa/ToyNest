var admin = require("firebase-admin");

import serviceAccountKey from './serviceAccountKey';

console.log(serviceAccountKey)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

module.exports=admin