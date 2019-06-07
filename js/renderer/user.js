$('#userInfo').html(`
    <p class="card-text">Nome: ${loggedUser.name}</p>
    <p class="card-text">Função: ${loggedUser.role}</p>
    <p class="card-text">Usuário: ${loggedUser.login}</p>
`)

function logout(){
    $("#root").load("../views/signIn.html")
}

$('#confirmPasswordChanging').on('click', ()=>{
    let oldPassword = $('#oldPassword').val()
    let newPassword = $('#newPassword').val()
    if (newPassword != $('#newPasswordAgain').val() || oldPassword == '' || newPassword == '' ){
        $('#passwordChangeInfo').html('Os campos não coincidem ou não foram preenchidos')
    } else {
        $('#passwordChangeInfo').html('')
        ipcRenderer.send('changePassword-message', oldPassword, newPassword, loggedUser.login)
    }
})

function userDelete(){
    if ($('#tdu').hasClass('tdu')){
    } else{ 
        $('#userDelete').html('')
        $('#userDelete').html(`
            <div id="tdu" class="tdu"></div>
            <div><strong>Tem certeza que quer remover este usuário?</strong></div>
            <div>Seus dados serão apagados do sistema<div>
            <button class="btn btn-sm btn-success" id="yesRemoveUser" title="Confirmar remoção"><i class="fas fa-check"></i></button>
            <button class="btn btn-sm btn-danger" id="noRemoveUser" title="Cancelar remoção"><i class="fas fa-times"></i></button>
            <small class="text-info" id="removeUserMsg"></small>
        `)
        $('#yesRemoveUser').on('click', () =>{
            ipcRenderer.send('removeUser-message', loggedUser._id)
        })
        $('#noRemoveUser').on('click', () =>{
            $('#userDelete').html('')
        })

    }
}