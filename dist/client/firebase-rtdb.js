"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RTDB = void 0;
const app_1 = require("firebase/app");
const database_1 = require("firebase/database");
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
const app = (0, app_1.initializeApp)(firebaseConfig);
const RTDB = (0, database_1.getDatabase)(app);
exports.RTDB = RTDB;
