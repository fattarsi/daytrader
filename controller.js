/*
 * controller.js
 * Controls the state of the daytrader app
 */

var MKT = new Market('market-1', 'container', ['shares']);
var INV = new Investor('investor', 1000);

MKT.addInvestor(INV);
