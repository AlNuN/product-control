class Products {
    constructor(code, name, options = {}) {
        this.code = code
        this.name = name
        this.lot = Object.assign({
            lot: undefined,
            validity: undefined,
            date: undefined,
            unit: undefined, 
            amount: undefined, 
            user: undefined,
        }, options)
    }
}

module.exports = new Products()
