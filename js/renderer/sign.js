// login related code
module.exports = {

    login: ()=> {

        let user = Users

        user.login = $("#login").val()
        user.password = $('#password').val()
        
        const {ipcRenderer} = require('electron')
        
        // send username to main.js 
        ipcRenderer.send('asynchronous-message', user )
        
        // receive message from main.js
        ipcRenderer.on('asynchronous-reply', (event, arg) => {
            console.log(arg)
        })
    },
    
    signUp: ()=>{

        let user = Users
        
        user.name = $('#signUpName').val()
        user.role = $('#signUpRole').val()
        user.login = $("#signUpLogin").val()
        user.password = $('#signUpPassword').val()
        
        const {ipcRenderer} = require('electron')
        
        // send user object to main.js 
        ipcRenderer.send('asynchronous-message', user )
        
        // receive message from main.js
        ipcRenderer.on('asynchronous-reply', (event, arg) => {
            console.log(arg)
        })
    }
    
};