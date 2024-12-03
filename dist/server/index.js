"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const cors = __importStar(require("cors"));
const firestore_1 = require("./firestore");
const uuid_1 = require("uuid");
const APP = express();
APP.use(cors());
APP.use(express.json());
const PORT = process.env.PORT || 3000;
function main() {
    APP.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
    APP.use(express.static('dist'));
    const playersCollection = firestore_1.DATA_BASE.collection('players');
    const playRoomsCollection = firestore_1.DATA_BASE.collection('playrooms');
    // Create or get player
    APP.post('/player', async (req, res) => {
        try {
            const { name } = req.body;
            const result = await playersCollection.where('name', '==', name).get();
            if (result.empty) {
                const newUser = await playersCollection.add({ name });
                res.json({ id: newUser.id, message: 'User created' });
            }
            else {
                res.json({
                    id: result.docs[0].id,
                    message: 'User exists',
                });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Create playroom
    APP.post('/playroom', async (req, res) => {
        try {
            const { userId } = req.body;
            const userDoc = await playersCollection.doc(userId).get();
            if (userDoc.exists) {
                const roomRef = firestore_1.RTDB.ref('playrooms/' + (0, uuid_1.v4)());
                await roomRef.set({
                    currentGame: {
                        Player1: {
                            choice: '',
                            name: '',
                            online: false,
                            start: false,
                            points: 0,
                        },
                        Player2: {
                            choice: '',
                            name: '',
                            online: false,
                            start: false,
                            points: 0,
                        },
                    },
                });
                const longID = roomRef.key;
                const roomId = (10000 + Math.floor(Math.random() * 89999)).toString();
                await playRoomsCollection.doc(roomId).set({ rtdbRoomId: longID });
                res.json({ id: roomId });
            }
            else {
                res.status(404).json({ error: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Get playroom data
    APP.get('/playroom/:playRoomId', async (req, res) => {
        try {
            const { userId } = req.query;
            const { playRoomId } = req.params;
            const userDoc = await playersCollection.doc(userId?.toString()).get();
            if (userDoc.exists) {
                const roomDoc = await playRoomsCollection.doc(playRoomId).get();
                if (roomDoc.exists) {
                    res.json(roomDoc.data());
                }
                else {
                    res.status(404).json({ error: 'Playroom not found' });
                }
            }
            else {
                res.status(404).json({ error: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Assign Player1
    APP.post('/player-creator', async (req, res) => {
        try {
            const { name, rtdb_Id } = req.body;
            const choiceRoomRef = firestore_1.RTDB.ref(`playrooms/${rtdb_Id}/currentGame/Player1/name`);
            await choiceRoomRef.set(name);
            res.json({ player: 'Player1' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Assign Player2 or verify players
    APP.post('/incoming-player', async (req, res) => {
        try {
            const { name, rtdb_Id } = req.body;
            const player1Ref = firestore_1.RTDB.ref(`playrooms/${rtdb_Id}/currentGame/Player1/name`);
            const player2Ref = firestore_1.RTDB.ref(`playrooms/${rtdb_Id}/currentGame/Player2/name`);
            const player2Snap = await player2Ref.get();
            if (player2Snap.val() === '') {
                await player2Ref.set(name);
                res.json({ player: 'Player2' });
            }
            else if (player2Snap.val() === name) {
                res.json({ player: 'Player2' });
            }
            else {
                const player1Snap = await player1Ref.get();
                if (player1Snap.val() === name) {
                    res.json({ player: 'Player1' });
                }
                else {
                    res.status(404).json({ error: 'Player not recognized in this room' });
                }
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Start or toggle player's readiness
    APP.post('/start-player', async (req, res) => {
        try {
            const { player, rtdb_Id } = req.body;
            const playerRef = firestore_1.RTDB.ref(`playrooms/${rtdb_Id}/currentGame/${player}/start`);
            const snap = await playerRef.get();
            await playerRef.set(!snap.val());
            res.json({ message: 'ok' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Check if playroom exists
    APP.get('/existRoom/:idRoom', async (req, res) => {
        try {
            const { idRoom } = req.params;
            const doc = await playRoomsCollection.doc(idRoom).get();
            if (doc.exists) {
                res.json({ message: 'This room exists' });
            }
            else {
                res.status(404).json({ error: 'Room does not exist' });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Set a player's move
    APP.post('/move', async (req, res) => {
        try {
            const { move, player, rtdb_Id } = req.body;
            const choiceRoomRef = firestore_1.RTDB.ref(`playrooms/${rtdb_Id}/currentGame/${player}/choice`);
            await choiceRoomRef.set(move);
            res.json({ message: 'Move registered' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Reset a single player's state
    APP.post('/reset', async (req, res) => {
        try {
            const { rtdb_Id, player } = req.body;
            await firestore_1.RTDB.ref(`playrooms/${rtdb_Id}/currentGame/${player}/choice`).set('');
            await firestore_1.RTDB.ref(`playrooms/${rtdb_Id}/currentGame/${player}/start`).set(false);
            res.json({ message: 'Player reset' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Reset all players
    APP.post('/reset-all-match', async (req, res) => {
        try {
            const { rtdb_Id } = req.body;
            const updates = {
                'Player1/choice': '',
                'Player2/choice': '',
                'Player1/start': false,
                'Player2/start': false,
            };
            await firestore_1.RTDB.ref(`playrooms/${rtdb_Id}/currentGame`).update(updates);
            res.json({ message: 'Match reset' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
main();