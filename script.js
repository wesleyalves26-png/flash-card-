// ========================================
// FLASH CAR
// Jogo de corrida sustentável
// ========================================


// ELEMENTOS DO HTML

const game = document.getElementById("game");
const road = document.querySelector(".road");
const player = document.getElementById("player");

const scoreElement = document.getElementById("score");
const speedElement = document.getElementById("speed");
const ecoElement = document.getElementById("ecoScore");

const message = document.getElementById("message");

const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const contrastBtn = document.getElementById("contrastBtn");
const motionBtn = document.getElementById("motionBtn");


// ========================================
// VARIÁVEIS DO JOGO
// ========================================

let score = 0;

let ecoScore = 100;

let speed = 1;

let playerPosition = 50;

let gameRunning = true;

let objects = [];

let objectTimer;

let gameLoop;


// ========================================
// POSIÇÃO DO CARRO
// ========================================

function updatePlayer() {

    player.style.left = playerPosition + "%";

}


// ========================================
// MOVER PARA ESQUERDA
// ========================================

function moveLeft() {

    if (!gameRunning) {
        return;
    }

    playerPosition -= 10;

    if (playerPosition < 10) {
        playerPosition = 10;
    }

    updatePlayer();

}


// ========================================
// MOVER PARA DIREITA
// ========================================

function moveRight() {

    if (!gameRunning) {
        return;
    }

    playerPosition += 10;

    if (playerPosition > 90) {
        playerPosition = 90;
    }

    updatePlayer();

}


// ========================================
// CONTROLE PELO TECLADO
// ========================================

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {

        event.preventDefault();

        moveLeft();

    }

    if (event.key === "ArrowRight") {

        event.preventDefault();

        moveRight();

    }

    if (event.key === " ") {

        event.preventDefault();

        togglePause();

    }

});


// ========================================
// BOTÕES DO CELULAR
// ========================================

leftBtn.addEventListener("click", moveLeft);

rightBtn.addEventListener("click", moveRight);


// ========================================
// CRIAR OBJETOS
// ========================================

function createObject() {

    if (!gameRunning) {
        return;
    }

    const object = document.createElement("div");

    object.classList.add("object");

    const random = Math.random();

    let type;

    /*
        70% de chance de aparecer
        algo positivo para sustentabilidade.
    */

    if (random < 0.7) {

        const sustainableObjects = [
            {
                emoji: "♻️",
                points: 10,
                eco: 5
            },
            {
                emoji: "🌳",
                points: 15,
                eco: 7
            },
            {
                emoji: "☀️",
                points: 20,
                eco: 10
            },
            {
                emoji: "🚲",
                points: 15,
                eco: 8
            }
        ];

        type =
            sustainableObjects[
                Math.floor(
                    Math.random() * sustainableObjects.length
                )
            ];

    } else {

        const pollutionObjects = [
            {
                emoji: "💨",
                points: -15,
                eco: -10
            },
            {
                emoji: "🗑️",
                points: -10,
                eco: -7
            },
            {
                emoji: "🏭",
                points: -20,
                eco: -15
            }
        ];

        type =
            pollutionObjects[
                Math.floor(
                    Math.random() * pollutionObjects.length
                )
            ];

    }

    object.textContent = type.emoji;

    object.dataset.points = type.points;

    object.dataset.eco = type.eco;

    // posição horizontal

    const position =
        Math.floor(Math.random() * 80) + 10;

    object.style.left = position + "%";

    // posição vertical

    object.style.top = "-60px";

    road.appendChild(object);

    objects.push(object);

}


// ========================================
// COLISÃO
// ========================================

function checkCollision(object) {

    const playerRect =
        player.getBoundingClientRect();

    const objectRect =
        object.getBoundingClientRect();

    return !(
        playerRect.right < objectRect.left ||
        playerRect.left > objectRect.right ||
        playerRect.bottom < objectRect.top ||
        playerRect.top > objectRect.bottom
    );

}


// ========================================
// ATUALIZAR OBJETOS
// ========================================

function updateObjects() {

    for (
        let i = objects.length - 1;
        i >= 0;
        i--
    ) {

        const object = objects[i];

        let top =
            parseFloat(object.style.top);

        top += 3 * speed;

        object.style.top = top + "px";


        // verifica colisão

        if (checkCollision(object)) {

            const points =
                Number(object.dataset.points);

            const eco =
                Number(object.dataset.eco);

            score += points;

            ecoScore += eco;


            // limites

            if (score < 0) {
                score = 0;
            }

            if (ecoScore > 100) {
                ecoScore = 100;
            }

            if (ecoScore < 0) {
                ecoScore = 0;
            }


            updateInterface();


            if (points > 0) {

                message.textContent =
                    "🌱 Boa escolha! Você ajudou o meio ambiente.";

            } else {

                message.textContent =
                    "⚠️ Cuidado! Esse elemento prejudica o meio ambiente.";

            }


            object.remove();

            objects.splice(i, 1);

            continue;

        }


        // remove objeto quando sai da pista

        if (top > road.offsetHeight) {

            object.remove();

            objects.splice(i, 1);

        }

    }

}


// ========================================
// ATUALIZAR INTERFACE
// ========================================

function updateInterface() {

    scoreElement.textContent = score;

    ecoElement.textContent =
        ecoScore + "%";

    speedElement.textContent =
        speed.toFixed(1);

}


// ========================================
// LOOP DO JOGO
// ========================================

function startGameLoop() {

    gameLoop =
        setInterval(function() {

            if (!gameRunning) {
                return;
            }

            updateObjects();

        }, 20);

}


// ========================================
// AUMENTAR VELOCIDADE
// ========================================

function increaseSpeed() {

    setInterval(function() {

        if (!gameRunning) {
            return;
        }

        speed += 0.1;

        if (speed > 3) {
            speed = 3;
        }

        updateInterface();

    }, 5000);

}


// ========================================
// CRIAR OBJETOS PERIODICAMENTE
// ========================================

function startObjectCreation() {

    objectTimer =
        setInterval(function() {

            createObject();

        }, 1200);

}


// ========================================
// PAUSAR / CONTINUAR
// ========================================

function togglePause() {

    gameRunning = !gameRunning;

    if (gameRunning) {

        pauseBtn.textContent =
            "⏸️ Pausar";

        message.textContent =
            "▶️ Jogo retomado!";

    } else {

        pauseBtn.textContent =
            "▶️ Continuar";

        message.textContent =
            "⏸️ Jogo pausado.";

    }

}

pauseBtn.addEventListener(
    "click",
    togglePause
);


// ========================================
// ALTO CONTRASTE
// ========================================

contrastBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "high-contrast"
        );

        if (
            document.body.classList.contains(
                "high-contrast"
            )
        ) {

            contrastBtn.textContent =
                "Desativar alto contraste";

        } else {

            contrastBtn.textContent =
                "Ativar alto contraste";

        }

    }
);


// ========================================
// REDUZIR ANIMAÇÕES
// ========================================

motionBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "reduce-motion"
        );

        if (
            document.body.classList.contains(
                "reduce-motion"
            )
        ) {

            motionBtn.textContent =
                "Ativar animações";

        } else {

            motionBtn.textContent =
                "Reduzir animações";

        }

    }
);


// ========================================
// REINICIAR
// ========================================

function restartGame() {

    score = 0;

    ecoScore = 100;

    speed = 1;

    playerPosition = 50;

    gameRunning = true;

    updatePlayer();

    updateInterface();


    // remove objetos

    objects.forEach(function(object) {

        object.remove();

    });

    objects = [];


    pauseBtn.textContent =
        "⏸️ Pausar";

    message.textContent =
        "🔄 Jogo reiniciado! Boa corrida sustentável.";

}

restartBtn.addEventListener(
    "click",
    restartGame
);


// ========================================
// INICIAR JOGO
// ========================================

updatePlayer();

updateInterface();

startGameLoop();

startObjectCreation();

increaseSpeed();
