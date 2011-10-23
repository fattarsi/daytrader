/*
 * investor.js
 * Defines a Investor class
 */
 
 function Investor(name, cash) {
    this.name = name;
    this.cash = cash;
    
    this.portfolio = new Portfolio();
 }
 
 Investor.prototype.canAfford = function (amt) {
    return this.cash > amt;
 }
 
 Investor.prototype.credit = function (amt) {
    this.cash = Math.round((this.cash + amt)*100) /100;
 }
 
 Investor.prototype.debit = function (amt) {
    this.cash = Math.round((this.cash - amt)*100) /100;
 }
 
 Investor.prototype.qtyOf = function (symbol) {
    if (!this.portfolio.stocks[symbol]) {
        return 0;
    }
    
    return this.portfolio.stocks[symbol];
 }