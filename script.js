const form = document.querySelector("#myForm");

function getPlayersNames(e){
    //previnir o envio do formulario
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    document.querySelector(".modal-wrapper").setAttribute("hidden", true);
    // console.log(data);
    initilizeGame(data);
}
form.addEventListener('submit', getPlayersNames);

const initilizeVariables = (data) =>{
    data.choice = +data.choice;
    data.board = [0,1,2,3,4,5,6,7,8];
    data.player1 = 'X';
    data.player2 = 'O';
    data.round = 0;
    data.currentPlayer = 'X';
    data.gameOver = false;
}

const initilizeGame = (data) =>{
    initilizeVariables(data);
    console.log(data);
}
