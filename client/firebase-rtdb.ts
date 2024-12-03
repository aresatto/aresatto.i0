import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCgmBNvqHauM0A68ikDlFsYGCZKBjPSxh8",
  authDomain: "piedra-papel-o-tijeras-97acf.firebaseapp.com",
  databaseURL: "https://piedra-papel-o-tijeras-97acf-default-rtdb.firebaseio.com",
  projectId: "piedra-papel-o-tijeras-97acf",
  storageBucket: "piedra-papel-o-tijeras-97acf.firebasestorage.app",
  messagingSenderId: "401328611115",
  appId: "1:401328611115:web:9801abf21f6b25ad412f6e",
  measurementId: "G-7LQ6ZBYFMZ"
};

const app = initializeApp(firebaseConfig);
const RTDB = getDatabase(app);

export { RTDB };
