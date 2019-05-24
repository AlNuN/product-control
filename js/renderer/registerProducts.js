
$('#addProduct').on('click', ()=>{
    $(".popup-overlay, .popup-content").addClass("active")
})

$('#addProductsDb').on('click', () =>{
    product.code = $('#addCode').val()
    product.name = $('#addName').val()
    product.lot.lot = $('#addLot').val()
    product.lot.validity = ($('#addValidity').val() + 'T00:00:00.000Z')
    product.lot.date = new Date()
    product.lot.unit = $('#addUnit').val() 
    product.lot.amount = Number($('#addAmount').val())
    product.lot.user = loggedUser.login

    ipcRenderer.send('addProduct-message', product )
})

