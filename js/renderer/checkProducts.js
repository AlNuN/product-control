function loadProducts (btn){
    let query = {}
    if(btn){
        let code = $('#checkCode').val()
        let name = $('#checkName').val()
        if(code != ''){ query.code = code } 
        if (name != '') { query.name = name }
    }
    ipcRenderer.send('findProducts-message', query)
}

function loadProductLots (code, idx) {
    ipcRenderer.send('findLots-message', code, idx)
}

function addLot (code, idx){
    if($('#ldf').hasClass('ldf')){
        $(`#variableContentDiv-${idx}`).html('')
    } else{
        $(`#variableContentDiv-${idx}`).html('')
        $(`#variableContentDiv-${idx}`).append(
            ` 
            <div id="ldf" class="ldf"></div>
            <div class="container mb-1">
                <div class="row mb-1">
                    <div class="col-sm-12">
                        <h4>Adicionar novo lote<h4>
                    </div>
                </div>
                <div class="row align-items-center">
            
                    <div class="col-sm-2" title='Lote'>
                        <div>Lote*</div>
                        <input class="form-control" type="text" id="addLotLot" placeholder="Lote">
                        </div>
                        
                    <div class="col-sm-2" title="Válido até">
                        <div>Validade</div>
                        <input class="form-control" type="date" id="addLotValidity" placeholder="Validade">
                        </div>
                        
                    <div class="col-sm-2" title="Data de entrada">
                        <div>Entrada</div>
                        <input class="form-control" type="date" id="addLotDate">
                        </div>
                        
                    <div class="col-sm-2" title="Tipo de unidade. Ex: 'cx'">
                        <div>Unidade</div>
                        <input class="form-control" type="text" id="addLotUnit" placeholder="Unidade">
                        </div>
                        
                    <div class="col-sm-2" title="Quantidade">
                        <div>Quantidade*</div>
                        <input class="form-control" type="number" id="addLotAmount" placeholder="Quant." min='1'>
                    </div>
    
                    <div class="col-sm-1">
                        <button class="btn btn-success btn-sm" type="button" id="addLotProducts">Adicionar</button>
                    </div>
                </div>
                <div class="row">
                    <small class="text-danger" id="addLotFail"></small>
                    <small class="text-success" id="addLotSuccess"></small>
                </div>
                    <small>*Campos obrigatórios</small>
            </div>
            `
        )
        $('#addLotProducts').on('click', ()=>{
            let lotItem = new Product()
            let date = $('#addLotDate').val()
            lotItem.code = code.toString()
            lotItem.lot = $('#addLotLot').val()
            lotItem.validity = ($('#addLotValidity').val() + 'T00:00:00.000Z')
            lotItem.date = (date != '') ? date + 'T00:00:00.000Z' : new Date()
            lotItem.unit = $('#addLotUnit').val()
            lotItem.amount = Number($('#addLotAmount').val())
            lotItem.user = loggedUser.login
    
            ipcRenderer.send('addLot-message', lotItem)
    
        })
    }
}

function output (id, index, unit, date, code, lot){
    if ($('#tdf').hasClass(`tdf`)){
    } else{ 
        let value = $(`#tableData-${index}`).html()
        $(`#tableData-${index}`).html('')
        $(`#tableData-${index}`).html(`
            <div id="tdf" class="tdf">
            <input type="number" onkeydown="return false" value="${value}" class="form-control-sm" id="inputTableData" max="${value}" min="0" title="Clique nas setas para reduzir o estoque">
            <button class="btn btn-sm btn-success" id="btnInputTableData" title="Confirmar retirada"><i class="fas fa-check"></i></button>
            <button class="btn btn-sm btn-danger" id="btnCancelTableData" title="Cancelar operação"><i class="fas fa-times"></i></button>
            <small class="text-danger" id="outputFail"></small>
        `)
        $('#btnInputTableData').on('click', () =>{
            let newValue = $(`#inputTableData`).val()
            ipcRenderer.send('output-message', id, value, newValue, index, loggedUser.login, unit, date, code, lot )
        })
        $('#btnCancelTableData').on('click', () =>{
            $(`#tableData-${index}`).html(`${value}`)
        })

    }
}

function addProducts (){
    products.code = $('#checkCode').val()
    products.name = $('#checkName').val()
    ipcRenderer.send('addProducts-message', products)
}

function searchProducts (){

}
    
$(()=>{
    if($('#productsList').html() == ''){
        loadProducts(false)
    }
})