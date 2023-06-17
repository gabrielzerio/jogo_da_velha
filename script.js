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

