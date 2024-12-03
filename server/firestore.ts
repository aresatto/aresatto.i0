import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as any),
	databaseURL: 'https://piedra-papel-o-tijeras-97acf-default-rtdb.firebaseio.com/',
});
const DATA_BASE = admin.firestore();
const RTDB = admin.database();

export { DATA_BASE, RTDB };
