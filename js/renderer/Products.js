class Products {

    constructor(code, name, lot) {
        this.code = code
        this.name = name
    }

}

class Product {

    constructor(code, lot, validity, date, unit, amount, user){
        this.code = code
        this.lot = lot
        this.validity = validity
        this.date = date
        this.unit = unit 
        this.amount = amount 
        this.user = user
    }

}

module.exports = {
    Products : Products,
    Product: Product,
}
