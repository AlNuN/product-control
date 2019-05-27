function loadProducts (){
    ipcRenderer.send('findProducts-message', {})
}

function loadProductLots (code, idx) {
    ipcRenderer.send('findLots-message', code, idx)
}

function addLot (code, idx){
    $(`#variableContentDiv-${idx}`).html('')
    $(`#variableContentDiv-${idx}`).append(
        ` 
        <div class="container mb-1">
            <div class="row mb-1">
                <div class="col-sm-12">
                    <h4>Adicionar novo lote<h4>
                </div>
            </div>
            <div class="row align-items-center">
        
                <div class="col-sm-2">
                    <input class="form-control" type="text" id="addLotLot" placeholder="Lote">
                </div>
        
                <div class="col-sm-3">
                    <input class="form-control" type="date" id="addLotValidity" placeholder="Validade">
                </div>
        
                <div class="col-sm-2">
                    <input class="form-control" type="text" id="addLotUnit" placeholder="Unidade">
                </div>
        
                <div class="col-sm-2">
                    <input class="form-control" type="number" id="addLotAmount" placeholder="Quant.">
                </div>

                <div class="col-sm-1">
                    <button class="btn btn-success btn-sm" type="button" id="addLotProducts">Adicionar</button>
                </div>
            </div>
            <div class="row">
                <small class="text-danger" id="addLotFail"></small>
                <small class="text-success" id="addLotSuccess"></small>
            </div>
        </div>
        `
    )
    $('#addLotProducts').on('click', ()=>{
        let lotItem = new Product()
        lotItem.code = code.toString()
        lotItem.lot = $('#addLotLot').val()
        lotItem.validity = ($('#addLotValidity').val() + 'T00:00:00.000Z')
        lotItem.date = new Date()
        lotItem.unit = $('#addLotUnit').val()
        lotItem.amount = Number($('#addLotAmount').val())
        lotItem.user = loggedUser.login

        ipcRenderer.send('addLot-message', lotItem)

    })
}
    
$(()=>{
    if($('#productsList').html() == ''){
        loadProducts()
    }
})