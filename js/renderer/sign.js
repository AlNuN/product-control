// login related code

module.exports = {
    
    login: ()=> {

        let user = Users

        user.login = $("#login").val()
        user.password = $('#password').val()
        
        // send username to main.js 
        ipcRenderer.send('signIn-message', user )
    },
    
    signUp: ()=>{

        let user = Users
        
        user.name = $('#signUpName').val()
        user.role = $('#signUpRole').val()
        user.login = $("#signUpLogin").val()
        user.password = $('#signUpPassword').val()
        
        // send user object to main.js 
        ipcRenderer.send('signUp-message', user )
    },

    loadSignIn: () => {
        $("#root").load("../views/signIn.html")
    }
    
};