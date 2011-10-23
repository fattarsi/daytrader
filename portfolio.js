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