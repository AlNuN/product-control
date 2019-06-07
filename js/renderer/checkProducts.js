function loadProducts (btn){
    let query = {}
    if(btn){
        let code = $('#checkCode').val()
        let name = $('#checkName').val()
        if (code != '') { query.code = code } 
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
            let dateEnd = new Date().toISOString().substr(10, 14)
            lotItem.code = code.toString()
            lotItem.lot = $('#addLotLot').val()
            lotItem.validity = ($('#addLotValidity').val() + 'T00:00:00.000Z')
            lotItem.date = (date != '') ? date + dateEnd : new Date()
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
            <div id="tdf" class="tdf"></div>
            <div>Quantidade*</div>
            <input type="number" onkeydown="return false" value="${value}" 
            class="form-control-sm mb-1" id="inputTableData" max="${value}" min="0"
            title="Clique nas setas para reduzir o estoque">
            <div>Destino</div>
            <input type="text" class="form-control-sm mb-1" id="destinationTableData"
             title="Informe o destino" placeholder="Destino (opcional)">
            <div>Data Saída</div>
            <input type="date" class="form-control-sm mb-1" id="outputDateTableData"
             title="Opcional, se estiver em branco, a data de saída será a atual" >
            <button class="btn btn-sm btn-success" id="btnInputTableData" 
            title="Confirmar retirada"><i class="fas fa-check"></i></button>
            <button class="btn btn-sm btn-danger" id="btnCancelTableData" 
            title="Cancelar operação"><i class="fas fa-times"></i></button>
            <br>
            <small class="text-info" id="outputFail"></small>
        `)
        $('#btnInputTableData').on('click', () =>{
            let outputDate = $('#outputDateTableData').val()
            outputDate = (outputDate != '') ? outputDate + new Date().toISOString().substr(10, 14) : new Date()
            let newValue = $('#inputTableData').val()
            let destination = $('#destinationTableData').val()
            ipcRenderer.send('output-message', id, value, newValue, index, loggedUser.login, unit, date, code, lot, destination, outputDate )
        })
        $('#btnCancelTableData').on('click', () =>{
            $(`#tableData-${index}`).html(`${value}`)
        })

    }
}

function removeLot (id, index, lot, date){
    if ($('#tdf').hasClass('tdf')){
    } else{ 
        let value = $(`#tableData-${index}`).html()
        $(`#tableData-${index}`).html('')
        $(`#tableData-${index}`).html(`
            <div id="tdf" class="tdf"></div>
                <div title="Esta opção é somente para corrigir erros. Ela apaga os dados do banco de dados e não pode ser utilizada para lotes que tiveram produtos retirados">
                <div><strong>Tem certeza que quer remover este lote?</strong></div>
                <div>Os dados não serão guardados<div>
                <button class="btn btn-sm btn-success" id="yesRemove" title="Confirmar remoção"><i class="fas fa-check"></i></button>
                <button class="btn btn-sm btn-danger" id="noRemove" title="Cancelar remoção"><i class="fas fa-times"></i></button>
                <small class="text-info" id="removeMsg"></small>
            </div>
        `)
        $('#yesRemove').on('click', () =>{
            ipcRenderer.send('removeLot-message', id, index, lot, date)
        })
        $('#noRemove').on('click', () =>{
            $(`#tableData-${index}`).html(`${value}`)
        })

    }
}

function addProducts (){
    products.code = $('#checkCode').val()
    products.name = $('#checkName').val()
    ipcRenderer.send('addProducts-message', products)
}

$(()=>{
    if($('#productsList').html() == ''){
        loadProducts(false)
    }
})
