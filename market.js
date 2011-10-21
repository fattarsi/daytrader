/*
 * market.js
 * Defines a Market class
 */

//defaults
DELAY=100;
INITIAL_PRICE=120;
STEP_SIZE=4;

// constructer
function Market(u_id, container_id, stock_symbols) {
    this.day = 1;
    this.time = 0;
    this.is_open = false;
    this.number_of_stocks = stock_symbols.length;
    
    this.u_id = u_id;
    this.container_id = container_id;
    this.stock_container_id = this.u_id+'_stocks';
    this.canvas_id = this.u_id+'_canvas';
    this.buildHtml();
    
    this.canvas = document.getElementById(this.canvas_id);
    this.timeInDay = this.canvas.getAttribute('width');
    
    //create stocks
    this.stocks = new Object();
    for (var i=0 ; i<stock_symbols.length ; i++) {
        this.stocks[stock_symbols[i]] = new Stock(this.u_id+'_stock-'+i, this.stock_container_id, this.canvas, stock_symbols[i], INITIAL_PRICE);
    }
}

//build html for a market, append to id=this.container_id
Market.prototype.buildHtml = function () {
    var parent = document.getElementById(this.container_id);
    
    //market container
    var mkt = document.createElement('div');
    mkt.setAttribute('id', this.u_id);
    mkt.setAttribute('class', 'market');
    parent.appendChild(mkt);
    
    //side bar
    var sidebar = document.createElement('div');
    sidebar.setAttribute('id', this.u_id+'_sidebar');
    sidebar.setAttribute('class', 'sidebar');
    mkt.appendChild(sidebar);
    
    //container for stock prices, stats, etc
    var s = document.createElement('div');
    s.setAttribute('id', this.stock_container_id);
    sidebar.appendChild(s);
    
    //canvas
    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', this.canvas_id);
    canvas.setAttribute('width','400');
    canvas.setAttribute('height','280');
    mkt.appendChild(canvas);
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