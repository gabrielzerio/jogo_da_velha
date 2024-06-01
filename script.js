document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelector("#modal").showModal();
});
document.querySelector("#modal").addEventListener('cancel', (e) => e.preventDefault());

document.querySelector("#myForm").addEventListener('submit', getPlayersNames);

const winningCondition = () => {
    let posicoesVitoria = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]];
    const getWinConditions = () => posicoesVitoria;
    return { getWinConditions };
}

function getPlayersNames(e) {
    e.preventDefault();
    document.querySelector("#modal").close();
    const form = document.querySelector("#myForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    capitalizeUsersName(data);
    initilizeGame(data);
}

const initilizeGame = (data) => {
    adjustDom("displayTurn", `vez do(a) ${data.player1Name}`);
    initilizeVariables(data);
    gameBoardEventListeners(data);
}

const initilizeVariables = (data) => {
    data.choice = +data.choice;
    data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    data.player1 = 'X';
    data.player2 = 'O';
    data.round = 0;
    data.currentPlayer = 'X';
    data.gameOver = false;
}

function gameBoardEventListeners(data) {
    document.querySelectorAll(".box").forEach(box => {
        box.addEventListener("click", (e) => {
            if (data.currentPlayer === 'O' && data.choice !== 0) { //se for a opção human x human
                return;
            }
            playMove(e.target, data);
        });
    });
    const resetGameBtn = document.querySelector("#resetBtn");
    resetGameBtn.addEventListener("click", () => {
        initilizeVariables(data);
        resetDom();
        adjustDom("displayTurn", `vez do(a) ${data.player1Name}`);
        clearInterval(timer);
    });

    const newGameBtn = document.querySelector("#restartBtn");
    newGameBtn.addEventListener("click", () => {
        window.location.reload(false);
    });

};

const playMove = (box, data) => {
    if (data.gameOver || data.round > 8) {
        return;
    }
    if (data.board[box.id] === "X" || data.board[box.id] === "O") {
        return;
    }
    data.board[box.id] = data.currentPlayer;
    box.textContent = data.currentPlayer;
    data.round++;
    if (endConditions(data)) {
        return;
    }
    changePlayer(data);
    if (data.currentPlayer === 'O' && data.choice !== 0) {
        machineMove(data);
    }
}

const machineMove = (data) => {
    setTimeout(() => {
        let availableMoves = data.board.filter(position => position !== 'X' && position !== 'O');
        let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        let box = document.getElementById(move);
        playMove(box, data);
    }, 500);
}

const endConditions = (data) => {
    if (checkWinner(data)) {
        let winnerName = currentPlayerFunc(data);
        adjustDom("displayTurn", winnerName + " Ganhou o jogo");
        data.gameOver = true;
        gameStatusAlert(winnerName);
        autoRestart();
        return true;
    } else if (data.round === 9) {
        adjustDom("displayTurn", "O jogo empatou!");
        data.gameOver = true;
        gameStatusAlert();
        autoRestart();
        return true;
    }
    return false;
};

const checkWinner = (data) => {
    let result = false;
    const getWC = winningCondition();
    let winningConditions = getWC.getWinConditions();

    winningConditions.forEach(condition => {
        if (data.board[condition[0]] === data.board[condition[1]] && data.board[condition[1]] === data.board[condition[2]]) {
            result = true;
        }
    });
    return result;
}

function adjustDom(className, textContent) {
    const elem = document.querySelector(`.${className}`);
    elem.textContent = textContent;
}

function changePlayer(data) {
    data.currentPlayer = (data.currentPlayer === "X") ? "O" : "X";
    adjustDom("displayTurn", `vez do(a) ${currentPlayerFunc(data)}`);
}

function currentPlayerFunc(data) {
    return (data.currentPlayer === "X" ? data.player1Name : data.player2Name);
}

function resetDom() {
    document.querySelectorAll(".box").forEach(box => {
        box.textContent = "";
        box.dataset.player = "";
    });
    adjustDom("timeRemaining", "");
}

function capitalizeUsersName(data) {
    data.player1Name = data.player1Name[0].toUpperCase() + data.player1Name.substring(1);
    data.player2Name = data.player2Name[0].toUpperCase() + data.player2Name.substring(1);
}

function gameStatusAlert(name) {
    setTimeout(function () {
        if (name !== undefined) {
            alert(`${name} ganhou o jogo`);
            return
        }
        alert("o jogo empatou");
    }, 100)
}

function autoRestart() {
    let i = 7;
    timer = setInterval(function () {
        adjustDom("timeRemaining", `o jogo vai reiniciar automaticamente em ${i} segundos`);
        if (i == 0) {
            const resetGameBtn = document.querySelector("#resetBtn");
            resetGameBtn.click();
            clearInterval(timer);
        }
        i--;
    }, 1000)
}
