const admin = require('firebase-admin');
try {
  admin.initializeApp();
  console.log("Admin initialized");
} catch(e) {
  console.log("Error", e);
}
