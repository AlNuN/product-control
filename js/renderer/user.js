$('#userInfo').html(`
    <div>Nome: ${loggedUser.name}</div>
    <div>Função: ${loggedUser.role}</div>
    <div>Usuário: ${loggedUser.login}</div>
`)

function logout(){
    $("#root").load("../views/signIn.html")
}

function changePassword () {
    $('#passwordFields').html(`

            <div class="container mb-1">
                <div class="row mb-1">
                    <div class="col-sm-12">
                        <h4>Alterar Senha<h4>
                    </div>
                </div>
                <div class="row mb-1">
                    <div class="col-sm-4">
                        <div>Senha Antiga</div>
                        <input class="form-control" type="password" id="oldPassword">
                    </div>
                </div>
                <div class="row mb-1">
                    <div class="col-sm-4">
                        <div>Senha Nova</div>
                        <input class="form-control" type="password" id="newPassword">
                    </div>
                </div>
                <div class="row mb-1">
                    <div class="col-sm-4">
                        <div>Repita a Senha Nova</div>
                        <input class="form-control" type="password" id="newPasswordAgain">
                    </div>
                </div>
                <div class="row mb-1">
                    <div class="col-sm-4">
                    <button class="btn btn-secondary" type="button" id="confirmPasswordChanging">Confirmar</button>
                    </div>
                </div>
                <div class="row">
                    <small class="text-danger" id="passwordChangeFail"></small>
                </div>
            </div>
    `)
    $('#confirmPasswordChanging').on('click', ()=>{
        let oldPassword = $('#oldPassword').val()
        let newPassword = $('#newPassword').val()
        if (newPassword != $('#newPasswordAgain').val() || oldPassword == '' || newPassword == '' ){
            $('#passwordChangeFail').html('Os campos não coincidem ou não foram preenchidos')
        } else {
            $('#passwordChangeFail').html('')
            ipcRenderer.send('changePassword-message', oldPassword, newPassword, loggedUser.login)
        }

    })
}
