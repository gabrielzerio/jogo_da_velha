const form = document.querySelector("#myForm");
const winningCondition = () => {
    let posicoesVitoria = [[0, 1, 2],
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
    //previnir o envio do formulario
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    document.querySelector(".modal-wrapper").setAttribute("hidden", true);
    // console.log(data);
    initilizeGame(data);
}
form.addEventListener('submit', getPlayersNames);

const initilizeVariables = (data) => {
    data.choice = +data.choice;
    data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    data.player1 = 'X';
    data.player2 = 'O';
    data.round = 0;
    data.currentPlayer = 'X';
    data.gameOver = false;
}

const gameBoardEventListeners = (data) => {
    document.querySelectorAll(".box").forEach(box => {
        box.addEventListener("click", (e) => {
            playMove(e.target, data);
        });
    });
};

const initilizeGame = (data) => {
    adjustDom("displayTurn", `${data.player1Name}'s turn`);
    initilizeVariables(data);
    gameBoardEventListeners(data);
}

const playMove = (box, data) => {
    if (data.gameOver || data.round > 8) { //se a variavel gameOver for true o jogo não continua
        return;
    }
    if (data.board[box.id] === "X" || data.board[box.id] === "O") { //se o array não tiver um X ou O no vetor indicado pelo box.id
        return;
    }
    data.board[box.id] = data.currentPlayer;
    box.textContent = data.currentPlayer;
    box.dataset.player = data.currentPlayer === "X" ? "player1" : "player2";
    data.round++;
    // console.log(box,data);
    if (endConditions(data)) {
        return true;
    }
    //muda o player atual
    changePlayer(data);
}

const endConditions = (data) => {
    if (checkWinner(data)) {
        let winnerName = currentPlayerFunc(data);
        adjustDom("displayTurn", winnerName + " has won the game");
        return true;
    } else if (data.round === 9) {
        adjustDom("displayTurn", "It's a Tie!");
        data.gameOver = true;
        return true;
    }
    return false;
};

const checkWinner = (data) => {
    let result = false;
    const getWC = winningCondition();
    let winningConditions = getWC.getWinConditions();
    console.log(data.board);
    winningConditions.forEach(condition => {

        if (data.board[condition[0]] === data.board[condition[1]] && data.board[condition[1]] === data.board[condition[2]]) {
            data.gameOver = true;
            result = true;
        }

    });
    return result;
}

function adjustDom(className, textContent){
    const elem = document.querySelector(`.${className}`);
    elem.textContent = textContent;
}

function changePlayer(data){
    data.currentPlayer = (data.currentPlayer === "X") ? "O" : "X" //vse o player atual for o 1(x) muda para o player 2(o)
    adjustDom("displayTurn", `${currentPlayerFunc(data)}'s turn`);
}

function currentPlayerFunc(data){ //DEVE RECEBER O OBJETO DATA
    return (data.currentPlayer === "X" ? data.player1Name : data.player2Name);
}