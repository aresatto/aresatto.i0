"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_1 = require("./components/home.js");
const entrance_room_1 = require("./components/entrance-room.js");
const create_room_1 = require("./components/create-room.js");
const published_code_1 = require("./components/published-code.js");
const start_game_1 = require("./components/start-game.js");
const room_waiting_1 = require("./components/room-waiting.js");
const game_timer_1 = require("./components/game-timer.js");
const show_animation_results_1 = require("./components/show-animation-results.js");
const hands_component_1 = require("./components/hands-component.js");
const results_1 = require("./components/results.js");
const error_1 = require("./components/error.js");
require("./router.js");

function main() {
    (0, hands_component_1.handsComponent)();
    (0, home_1.initHomePage)();
    (0, create_room_1.initCreateRoom)();
    (0, entrance_room_1.initEntranceRoom)();
    (0, published_code_1.initPublishedRoomCode)();
    (0, room_waiting_1.initRoomWaiting)();
    (0, start_game_1.initStartGame)();
    (0, game_timer_1.initGameTimer)();
    (0, show_animation_results_1.initShowAnimationResults)();
    (0, results_1.initResults)();
    (0, error_1.initErrorPage)();
}
main();
