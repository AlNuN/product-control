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

class QueryBuilder extends Product {

    constructor(code, lot, unit, amount, user, dateType, initialDate, finalDate, name){
        super(code, lot, unit, amount, user)
        this.initialDate =  initialDate
        this.finalDate = finalDate
        this.dateType = dateType
        this.name = name
    }

}

module.exports = {
    Products : Products,
    Product: Product,
    QueryBuilder: QueryBuilder
}
