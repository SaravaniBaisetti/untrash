const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setAdminRole = functions.https.onCall(async (data, context) => {
  const requesterUid = context.auth?.uid;
  const superAdminUid = "0nwsP7Rs7fNqPJYD8eTY1O9N8G72E"; // 🛑 Replace this with your Firebase UID!

  if (requesterUid !== superAdminUid) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only the super admin can assign admin roles."
    );
  }

  const { uid } = data;

  await admin.auth().setCustomUserClaims(uid, { role: "admin" });

  return { message: `✅ Admin role set for UID: ${uid}` };
});
