//PAREI EM 1:06:31
document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelector("#modal").showModal();
});
document.querySelector("#modal").addEventListener('cancel', (e) => e.preventDefault());
document.querySelector("#myForm").addEventListener('submit', getPlayersNames); //tudo começa aqui

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
    //aqui vou usar a API FormData pra pegar todos as infos dos inputs mais rapido.
    const form = document.querySelector("#myForm");
    const formData = new FormData(form); //criei o objeto do tipo FormData
    const data = Object.fromEntries(formData); //
    capitalizeUsersName(data);
    // console.log(data);
    initilizeGame(data);
}

const initilizeGame = (data) => {
    adjustDom("displayTurn", `vez do(a) ${data.player1Name}`);
    initilizeVariables(data);
    gameBoardEventListeners(data);
}

const initilizeVariables = (data) => {
    data.choice = +data.choice; //força a variável a ser um tipo numero tornando ela positiva
    data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8]; //numero das boxes
    data.player1 = 'X'; //escolha do player 1 é X
    data.player2 = 'O';
    data.round = 0; //precisa de uma variavel que vai controlar os rounds pois pode dar empate(maximo de round são 8)
    data.currentPlayer = 'X';
    data.gameOver = false; //game over so será verdadeiro quando um dos players fazer uma sequência
}

function gameBoardEventListeners(data) {
    document.querySelectorAll(".box").forEach(box => {
        box.addEventListener("click", (e) => {
            playMove(e.target, data); // chama a função das jogadas.
        });
    });
    const resetGameBtn = document.querySelector("#resetBtn"); //BOTÃO DE RESETAR AS JOGADAS
    resetGameBtn.addEventListener("click", () => {
        initilizeVariables(data);
        resetDom();
        adjustDom("displayTurn", `vez do(a) ${data.player1Name}`);
    });

    const newGameBtn = document.querySelector("#restartBtn"); //BOTÃO DE REINICIAR O JOGO
    newGameBtn.addEventListener("click", () => {
        window.location.reload(false);
    });

};

const playMove = (box, data) => {
    if (data.gameOver || data.round > 8) { //se a variavel gameOver for true o jogo não continua
        return;
    }
    if (data.board[box.id] === "X" || data.board[box.id] === "O") { //vai verificar se o array board na posição do box(o atributo id tem numeração 0-8)
        return;                                                     //ja foi alterado com algum x ou o ex [0,X,2,3,O,X,6...];    
    }                                                               //se sim, ele retorna para não sobrescrever.    
    data.board[box.id] = data.currentPlayer; //vai mudar o array com o token (X ou O) do jogador atual;
    box.textContent = data.currentPlayer;    //vai preencher a div com x ou y (interface somente);
    data.round++;               //incrementa o round                                  
    // console.log(box,data);   
    if (endConditions(data)) { //função que verifica se de acord com as informações o jogo terminaria
        return; //se for verdadeira retorna
    }
    //muda o player atual se o jogo continuar
    changePlayer(data);
}

const endConditions = (data) => {
    if (checkWinner(data)) { //verifica em outra função
        let winnerName = currentPlayerFunc(data);
        adjustDom("displayTurn", winnerName + " Ganhou o jogo");
        data.gameOver = true;
        return true;
    } else if (data.round === 9) {
        adjustDom("displayTurn", "O jogo empatou!");
        data.gameOver = true;
        return true;
    }
    return false;
};

const checkWinner = (data) => {
    let result = false;
    const getWC = winningCondition();                  //resgata a variável
    let winningConditions = getWC.getWinConditions();  //das sequencias de vitoria

    winningConditions.forEach(condition => { // vai iterar todas as linha da variavel de condição de vitoria
        // console.log(data.board);
        if (data.board[condition[0]] === data.board[condition[1]] && data.board[condition[1]] === data.board[condition[2]]) {
            //vai verificar os sequencias de vitoria da variavel winningCondition com os tokens marcados no array board
            //cada iteração vai pegar uma linha do array ( que vai estar na variável condition )
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
    data.currentPlayer = (data.currentPlayer === "X") ? "O" : "X" //vse o player atual for o 1(x) muda para o player 2(o)
    adjustDom("displayTurn", `vez do(a) ${currentPlayerFunc(data)}`);
}

function currentPlayerFunc(data) { //DEVE RECEBER O OBJETO DATA
    return (data.currentPlayer === "X" ? data.player1Name : data.player2Name);
}

function resetDom() {
    document.querySelectorAll(".box").forEach(box => {
        box.textContent = "";
        box.dataset.player = "";
    });
}
function capitalizeUsersName(data){
    data.player1Name = data.player1Name[0].toUpperCase() + data.player1Name.substring(1);
    data.player2Name = data.player2Name[0].toUpperCase() + data.player2Name.substring(1);
}