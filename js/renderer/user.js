$('#userInfo').html(`
    <div>Nome: ${loggedUser.name}</div>
    <div>Função: ${loggedUser.role}</div>
    <div>Usuário: ${loggedUser.login}</div>
`)

function logout(){
    $("#root").load("../views/signIn.html")
}

function changePassword () {
    console.log('mudando a senha')
}