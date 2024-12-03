"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewUser = createNewUser;
exports.createPlayroom = createPlayroom;
exports.enterThePlayRoom = enterThePlayRoom;
exports.playerCreatorName = playerCreatorName;
exports.incomingPlayer = incomingPlayer;
exports.existRoom = existRoom;
exports.gameStateReset = gameStateReset;
exports.moveOption = moveOption;
exports.resetMatchGame = resetMatchGame;
exports.getData = getData;
exports.resetOnline = resetOnline;
exports.savePointsInDataBase = savePointsInDataBase;
exports.resetAllGame = resetAllGame;
async function createNewUser(name) {
    const promise = await fetch('/player', {
        method: 'post',
        body: JSON.stringify({ name }),
        headers: { 'Content-Type': 'application/json' },
    });
    return promise.json();
}
async function createPlayroom(userId) {
    const promise = await fetch('/playroom', {
        method: 'post',
        body: JSON.stringify({ userId }),
        headers: { 'Content-Type': 'application/json' },
    });
    return promise.json();
}
async function enterThePlayRoom(userId, keyRoom) {
    const promise = await fetch(`/playroom/${keyRoom}?userId=${userId}`, {
        method: 'get',
    });
    return promise.json();
}
async function playerCreatorName(name, rtdb_Id) {
    const promise = await fetch('/player-creator', {
        method: 'post',
        body: JSON.stringify({ name, rtdb_Id }),
        headers: { 'Content-Type': 'application/json' },
    });
    return promise.json();
}
async function incomingPlayer(name, rtdb_Id) {
    const promise = await fetch('/incoming-player', {
        method: 'post',
        body: JSON.stringify({ name, rtdb_Id }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (promise.status == 404) {
        return 'this player is Undefined in this room';
    }
    else {
        return promise.json();
    }
}
async function existRoom(roomId) {
    const promise = await fetch('/existRoom/' + roomId, {
        method: 'get',
    });
    if (promise.status == 404) {
        return 'This room does not exist';
    }
    else {
        return 'ok';
    }
}
async function gameStateReset(player, rtdb_Id) {
    const promise = await fetch('/start-player', {
        method: 'post',
        body: JSON.stringify({ player, rtdb_Id }),
        headers: { 'Content-Type': 'application/json' },
    });
    return promise.json();
}
async function resetAllGame(rtdb_Id) {
    const promise = await fetch('/reset-all-match', {
        method: 'post',
        body: JSON.stringify({ rtdb_Id }),
        headers: { 'Content-Type': 'application/json' },
    });
    return promise.json();
}
async function moveOption(player, rtdb_Id, move) {
    const promise = await fetch('/move', {
        method: 'post',
        body: JSON.stringify({ move, player, rtdb_Id }),
        headers: { 'Content-Type': 'application/json' },
    });
    return promise.json();
}
async function resetMatchGame(rtdb_Id, player) {
    const promise = await fetch('/reset', {
        method: 'post',
        body: JSON.stringify({ rtdb_Id, player }),
        headers: { 'Content-Type': 'application/json' },
    });
    return promise.json();
}
async function getData(rtdb_Id, player) {
    const promise = await fetch('/getdata', {
        method: 'post',
        body: JSON.stringify({ rtdb_Id, player }),
        headers: { 'Content-Type': 'application/json' },
    });
    return promise.json();
}
async function resetOnline(rtdb, player) {
    const promise = await fetch('/online', {
        method: 'post',
        body: JSON.stringify({ rtdb, player }),
        headers: { 'Content-Type': 'application/json' },
    });
    return promise.json();
}
async function savePointsInDataBase(rtdb_Id, player1, points1, player2, points2) {
    const promise = await fetch('/set-points', {
        method: 'post',
        body: JSON.stringify({ rtdb_Id, player1, player2, points1, points2 }),
        headers: { 'Content-Type': 'application/json' },
    });
    return promise.json();
}
