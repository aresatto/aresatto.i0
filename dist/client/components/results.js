"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initResults = initResults;
const optionResults = [
    {
        title: 'Ganaste',
        result: 'winner',
        urlImage: require('url:./star/win.png'),
    },
    {
        title: 'Perdiste',
        result: 'loser',
        urlImage: require('url:./star/lose.png'),
    },
    {
        title: 'Empate',
        result: 'tie',
        urlImage: require('url:./star/lose.png'),
    },
];
const state_1 = require("../state");
const router_1 = require("@vaadin/router");
function initResults() {
    customElements.define('x-points-results', class Results extends HTMLElement {
        shadow = this.attachShadow({ mode: 'open' });
        meResult = 'loser';
        me = state_1.state.data.namePlayers.me;
        another = state_1.state.data.namePlayers.other;
        constructor() {
            super();
            this.render();
            state_1.state.data.meReady = false;
        }
        listener() {
            const buttonEl = this.shadow.querySelector('.container-btn__button');
            buttonEl.addEventListener('click', () => {
                state_1.state.resetMatch();
                state_1.state.data.meReady = true;
                router_1.Router.go('/start-game');
            });
        }
        render() {
            state_1.state.data.flagStart = false;
            state_1.state.countPoints();
            state_1.state.savePointsInrtdb();
            this.meResult = state_1.state.data.result;
            this.me = state_1.state.data.name;
            const imgResult = optionResults.find((item) => item.result == this.meResult);
            this.shadow.innerHTML = `
                <div class='container'>
                    <header class='header'>
                        <div class='header__image'>
                            <h1 class='header__image__title' >${imgResult.title}</h1>
                        </div>
                    </header>
                    <section class='container-results'>
                        <h2 class='container-results__title'>Score</h2>
                        <p class='container-results__me'>${this.me}: ${state_1.state.data.points.me}</p>
                        <p class='container-results__another'>${this.another}: ${state_1.state.data.points.other}</p>
                    </section>
                    <div class='container-btn'>
                        <button class='container-btn__button'>Volver a Jugar</button>
                    </div>
                </div>
                `;
            const styleEl = document.createElement('style');
            styleEl.innerHTML = `
                .container {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                    height: 100vh;
                    gap: 5px;
                }
                .header__image {
                    width: 400px;
                    height: 300px;
                    background-image: url('${imgResult.urlImage}');
                    background-size: 300px;
                    background-repeat: no-repeat;
                    background-position-x: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .header__image__title {
                    margin: 0;
                    text-align: center;
                    font-family: 'Odibee Sans', cursive;
                    font-size: 80px;
                    color: white;
                }
                .container-results {
                    width: 350px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    padding: 10px;
                    gap: 10px;
                    background-color: white;
                    font-family: 'Odibee Sans', cursive;
                    font-size: 45px;
                    border: solid 10px;
                    border-radius: 10px;
                }
                .container-results__title {
                    margin: 0;
                    font-size: 55px;
                    align-self: start;
                }
                .container-results__me {
                    margin: 0;
                }
                .container-results__another {
                    margin: 0;
                }
                .container-btn {
                    display: flex;
                    justify-content: center;
                }
                .container-btn__button {
                    width: 330px;
                    color: white;
                    background-color: #006CFC;
                    border: solid #001997 10px;
                    border-radius: 10px;
                    font-family: 'Odibee Sans', cursive;
                    font-size: 45px;
                    cursor: pointer;
                }
                `;
            this.shadow.appendChild(styleEl);
            this.listener();
        }
    });
}
