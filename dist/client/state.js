"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
const api_play_room_1 = require("./api-play-room");
const router_1 = require("@vaadin/router");
const firebase_rtdb_1 = require("./firebase-rtdb");
const database_1 = require("firebase/database");
const map_1 = require("lodash/map");
const state = {
    data: {
        name: '',
        meChoice: '',
        otherChoice: '',
        otherConnection: false,
        userId: '',
        numberPlayers: {
            me: '',
            other: '',
        },
        namePlayers: {
            me: '',
            other: '',
        },
        rtdbRoomId: 0,
        keyRoom: 0,
        points: {
            me: 0,
            other: 0,
        },
        result: '',
        error: '',
        otherOnline: false,
        flagStart: false,
        meReady: true,
    },
    getData() {
        return this.data;
    },
    howWin(meMove, otherMove) {
        let meWin = (meMove == 'papel' && otherMove == 'piedra') ||
            (meMove == 'piedra' && otherMove == 'tijera') ||
            (meMove == 'tijera' && otherMove == 'papel');
        if (meMove == otherMove) {
            return 'tie';
        }
        if (meWin) {
            this.data.points.me++;
            return 'winner';
        }
        if (!meWin) {
            this.data.points.other++;
            return 'loser';
        }
    },
    initPoints() {
        (0, api_play_room_1.getData)(this.data.rtdbRoomId, this.data.numberPlayers.me).then((res) => {
            this.data.namePlayers.me = res.me.meName;
            this.data.namePlayers.other = res.me.otherName;
            this.data.points.me = res.me.mePoints;
            this.data.points.other = res.other.otherPoints;
        });
        (0, api_play_room_1.resetOnline)(this.data.rtdbRoomId, this.data.numberPlayers.me);
        this.resetAllMatch();
    },
    resetAllMatch() {
        (0, api_play_room_1.resetAllGame)(this.data.rtdbRoomId).then((res) => {
            router_1.Router.go('/start-game');
        });
    },
    createRoom(name) {
        this.data.name = name;
        this.data.numberPlayers.me = 'Player1';
        this.data.numberPlayers.other = 'Player2';
        (0, api_play_room_1.createNewUser)(name).then((newPlayer) => {
            this.data.userId = newPlayer.id;
            const userId = this.getData().userId;
            (0, api_play_room_1.createPlayroom)(userId).then((idRoom) => {
                this.data.keyRoom = parseInt(idRoom.id);
                router_1.Router.go('/code-public');
                (0, api_play_room_1.enterThePlayRoom)(this.data.userId, this.data.keyRoom).then((result) => {
                    this.data.rtdbRoomId = result.rtdbRoomId;
                    this.listenerChange();
                    (0, api_play_room_1.playerCreatorName)(this.data.name, this.data.rtdbRoomId).then((res) => {
                        console.log(res);
                    });
                });
            });
        });
    },
    createUser(name, codeId) {
        this.data.name = name;
        this.data.keyRoom = codeId;
        this.existRoomState(codeId).then((existRoomRes) => {
            if (existRoomRes) {
                (0, api_play_room_1.createNewUser)(name).then((result) => {
                    const userId = result.id;
                    (0, api_play_room_1.enterThePlayRoom)(userId, codeId).then((res) => {
                        this.data.rtdbRoomId = res.rtdbRoomId;
                        (0, api_play_room_1.incomingPlayer)(this.data.name, this.data.rtdbRoomId).then((typeOfPlayer) => {
                            const userAndRoomNotMatch = 'this player is Undefined in this room' == typeOfPlayer;
                            if (userAndRoomNotMatch) {
                                this.data.error = 'error player';
                                router_1.Router.go('/error');
                            }
                            else {
                                this.typeOfPlayers(typeOfPlayer.player);
                                this.initPoints();
                                this.listenerChange();
                            }
                        });
                    });
                });
            }
            else {
                this.data.error = 'error playroom';
                router_1.Router.go('/error');
            }
        });
    },
    async existRoomState(idRoom) {
        const promise = await (0, api_play_room_1.existRoom)(idRoom);
        if (promise == 'ok') {
            return true;
        }
        else {
            return false;
        }
    },
    typeOfPlayers(me) {
        if (me == 'Player1') {
            this.data.numberPlayers.me = 'Player1';
            this.data.numberPlayers.other = 'Player2';
        }
        else {
            this.data.numberPlayers.me = 'Player2';
            this.data.numberPlayers.other = 'Player1';
        }
    },
    listenerChange() {
        const currentGame = (0, database_1.ref)(firebase_rtdb_1.RTDB, `playrooms/${this.data.rtdbRoomId}/currentGame`);
        (0, database_1.onValue)(currentGame, (snapshot) => {
            const data = snapshot.val();
            let player = (0, map_1.default)(data);
            const mePlayer = player[0].name == this.data.name;
            let meConnected = false;
            let meOnline = false;
            let otherConnected = false;
            let otherOnline = false;
            if (mePlayer) {
                meConnected = player[0].start;
                meOnline = player[0].online;
                otherConnected = player[1].start;
                otherOnline = player[1].online;
                this.data.meChoice = player[0].choice;
                this.data.otherChoice = player[1].choice;
                this.data.namePlayers.me = player[0].name;
                this.data.namePlayers.other = player[1].name;
            }
            else {
                meConnected = player[1].start;
                meOnline = player[1].online;
                otherConnected = player[0].start;
                otherOnline = player[0].online;
                this.data.meChoice = player[1].choice;
                this.data.otherChoice = player[0].choice;
                this.data.namePlayers.me = player[1].name;
                this.data.namePlayers.other = player[0].name;
            }
            const playersConnected = meConnected && otherConnected;
            const playerChoiced = this.data.meChoice == '' && this.data.otherChoice == '';
            const player2Login = player[1].name == '';
            if (!player2Login &&
                !meConnected &&
                !otherConnected &&
                state.data.meReady) {
                router_1.Router.go('/start-game');
            }
            if (player2Login) {
                router_1.Router.go('/code-public');
            }
            if (playersConnected && !player2Login && playerChoiced) {
                router_1.Router.go('/game');
            }
            const twoOptionsStart = this.data.meChoice == '' || this.data.otherChoice == '';
            if (meConnected &&
                otherConnected &&
                !twoOptionsStart &&
                this.data.flagStart) {
                router_1.Router.go('/show-animation');
                this.data.flagStart = false;
            }
            if (meOnline && otherOnline) {
                const rtdb = this.data.rtdbRoomId;
                const me = this.data.numberPlayers.me;
                const other = this.data.numberPlayers.other;
                (0, api_play_room_1.resetOnline)(rtdb, me);
                (0, api_play_room_1.resetOnline)(rtdb, other);
            }
        });
    },
    resetStartGame() {
        const player = this.data.numberPlayers.me;
        const roomId = this.data.rtdbRoomId;
        (0, api_play_room_1.gameStateReset)(player, roomId);
    },
    countPoints() {
        const meMove = this.data.meChoice;
        const otherMove = this.data.otherChoice;
        const result = this.howWin(meMove, otherMove);
        this.data.result = result;
    },
    setMove(move) {
        const rtdb = this.data.rtdbRoomId;
        const player = this.data.numberPlayers.me;
        (0, api_play_room_1.moveOption)(player, rtdb, move).then((res) => { });
    },
    resetMatch() {
        (0, api_play_room_1.resetMatchGame)(this.data.rtdbRoomId, this.data.numberPlayers.me).then((res) => { });
    },
    savePointsInrtdb() {
        (0, api_play_room_1.savePointsInDataBase)(this.data.rtdbRoomId, this.data.numberPlayers.me, this.data.points.me, this.data.numberPlayers.other, this.data.points.other).then((res) => {
            console.log(res);
        });
    },
};
exports.state = state;
