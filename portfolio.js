/*
 * portfolio.js
 * Defines a Portfolio class
 */

function Portfolio() {
    this.stocks = new Object();
}

Portfolio.prototype.add = function (symbol, qty) {
    //case for first purchase
    if (!this.stocks[symbol]) {
        this.stocks[symbol] = qty;
        return;
    }
    
    this.stocks[symbol] += qty;
}

Portfolio.prototype.del = function (symbol, qty) {
    //case if stock is not owned
    if (!this.stocks[symbol]) {
        return;
    }
    
    //case if stock owned is less than qty to sell
    if (this.stocks[symbol] - qty < 0) {
        return;
    }
    
    this.stocks[symbol] -= qty;
}