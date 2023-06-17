const form = document.querySelector("#myForm");

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
    data.currentPlayer = 'O';
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
    
}