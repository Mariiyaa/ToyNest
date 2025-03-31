var admin = require("firebase-admin");

import serviceAccountKey from './serviceAccountKey';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

module.exports=admin