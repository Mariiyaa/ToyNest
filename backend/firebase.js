var admin = require("firebase-admin");

import firebaseConfig from './firebaseConfig.js';

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});

module.exports=admin