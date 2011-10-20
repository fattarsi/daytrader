/*
 * stock.js
 * Defines a Stock class
 */

//defaults
VOLITILE=false;
DELTA_RANGE=20;

 // constructor
function Stock(canvas, symbol, initial) {
    this.symbol = symbol;
    this.delta_range = DELTA_RANGE;
    this.is_volitile = VOLITILE;
    
    //stock cannot be below 0, if so it is bust
    if (initial <= 0) {
        this.price = 0;
        this.is_bust = true;
    } else {
        this.price = initial;
        this.is_bust = false;
    }
    
    this.line = canvas.getContext('2d');
    this.line.strokeStyle = 'black';
    this.line.lineWidth = 1.0;
    this.line.lineCap = 'round';
    this.line.lineJoin = 'round';
    this.line.beginPath();

    this.xmax = canvas.getAttribute('width');
    this.ymax = canvas.getAttribute('height');
    
    this.xpos = 0;
    this.ypos = this.ymax - initial;
    this.line.moveTo(this.xpos, this.ypos);
    
    
}

//update graph to current state of stock
Stock.prototype.plot = function () {
    this.ypos = this.ymax - this.price;
    this.line.lineTo(this.xpos, this.ypos);
    this.line.stroke();
}

//return a change in stock price based on delta range
Stock.prototype.priceChange = function() {
    return Math.floor(Math.random() * this.delta_range) - (this.delta_range/2);
}

//reset stock for a new day
Stock.prototype.reset = function () {
    this.line.clearRect(0,0,this.xmax,this.ymax);
    this.xpos = 0;
}

//update stock price and graph
Stock.prototype.step = function(step) {
    if (this.xpos + step > this.xmax) {
        return;
    } else {
        this.xpos += step;
    }
    
    //if company is bust, just plot and return
    if (this.is_bust) {
        this.plot();
        return;
    }
    
    var delta = this.priceChange();
    this.price += delta;
    if (this.price <= 0) {
        this.price = 0;
        this.is_bust = true;
    }
    this.plot();
    
}
