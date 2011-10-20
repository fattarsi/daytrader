/*
 * market.js
 * Defines a Market class
 */

//defaults
DELAY=100;
INITIAL_PRICE=100;
STEP_SIZE=4;

function Market(canvas_id, numberOfStocks) {
    this.day = 1;
    this.time = 0;
    this.canvas = document.getElementById(canvas_id);
    this.timeInDay = this.canvas.getAttribute('width');
    this.is_open = false;
    this.stocks = new Object();
    
    //TODO: ability to have multiple stocks
    this.stocks['goog'] = new Stock(this.canvas, 'goog', INITIAL_PRICE);
}

//clear the canvas
Market.prototype.clear = function () {
    for (var key in this.stocks) {
        this.stocks[key].reset();
    }
}

//start a day
Market.prototype.start = function () {
    this.time = 0;
    this.clear();
    this.is_open = true;
    this.tick();
}

//market pulse to update all stocks
Market.prototype.tick = function () {
    if (this.time < this.timeInDay) {
        //update stocks
        for (var key in this.stocks) {
            this.stocks[key].step(STEP_SIZE);
        }
        this.time += STEP_SIZE;
        setTimeout(function(thisObj) {thisObj.tick();}, DELAY, this);
    }
}