/*
 * controller.js
 * Controls the state of the daytrader app
 */

var MKT = new Market('market-1', 'container', ['goog']);
var INV = new Investor('chris', 1000);
//var MKT2 = new Market('market-2', 'container', ['appl']);

MKT.addInvestor(INV);
//MKT2.addInvestor(INV);

//MKT.start();
//MKT2.start();