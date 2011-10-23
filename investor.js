/*
 * investor.js
 * Defines a Investor class
 */
 
 function Investor(name, cash) {
    this.name = name;
    this.cash = cash;
    
    this.portfolio = new Portfolio();
 }
 
 Investor.prototype.qtyOf = function (symbol) {
    if (!this.portfolio.stocks[symbol]) {
        return 0;
    }
    
    return this.portfolio.stocks[symbol];
 }