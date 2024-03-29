/*
 * stock.js
 * Defines a Stock class
 */

//defaults
OSD=true;
VOLITILE=true;
VOLITILE_LEVEL=1;
DELTA_RANGE=20;
INITIAL_PRICE=120;
COLORS = new Array("black", "blue", "gray", "purple", "brown");

 // constructor
function Stock(u_id, container_id, canvas, symbol) {
    this.u_id = u_id;
    this.container_id = container_id;
    this.symbol_id = this.u_id+'_symbol';
    this.price_id = this.u_id+'_price';
    this.change_id = this.u_id+'_change';
    this.shiftUp = 0;
    this.history = new Array();
    this.buildHtml();
    
    this.symbol = symbol;
    this.delta_range = DELTA_RANGE;
    this.is_volitile = VOLITILE;
    if (COLORS.length > 0) {
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        COLORS.splice(COLORS.indexOf(this.color),1);
    } else {
        this.color = 'black';
    }
    
    //stock cannot be below 0, if so it is bust
    if (INITIAL_PRICE <= 0) {
        this.price = 0;
        this.is_bust = true;
    } else {
        this.price = INITIAL_PRICE;
        this.is_bust = false;
    }
    
    this.last_change = 0;
    
    this.line = canvas.getContext('2d');
    //this.line.strokeStyle = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.line.lineWidth = 1.0;
    this.line.lineCap = 'round';
    this.line.lineJoin = 'round';
    this.line.beginPath();

    this.xmax = canvas.getAttribute('width');
    this.ymax = canvas.getAttribute('height');
    
    this.xpos = -STEP_SIZE;
    this.ypos = this.ymax - INITIAL_PRICE;
    this.threshold = Math.round(this.ymax * .10 * 100) / 100;
    this.line.moveTo(this.xpos, this.ypos);
    
    
}

Stock.prototype.buildHtml = function () {
    var parent = document.getElementById(this.container_id);
    
    //create stock container
    var stock = document.createElement('div');
    stock.setAttribute('id', this.u_id);
    stock.setAttribute('class', 'stock');
    parent.appendChild(stock);
    
    //node for symbol
    var node = document.createElement('div');
    node.setAttribute('id', this.symbol_id);
    node.setAttribute('class', 'stock-symbol');
    stock.appendChild(node);
    
    //node for price
    node = document.createElement('div');
    node.setAttribute('id', this.price_id);
    node.setAttribute('class', 'stock-price');
    stock.appendChild(node);
    
    //dead node to divide
    node = document.createElement('div');
    node.setAttribute('class', 'clear');
    stock.appendChild(node);
    
    //node for price change
    node = document.createElement('div');
    node.setAttribute('id', this.change_id);
    node.setAttribute('class', 'stock-change')
    stock.appendChild(node);
    
}

Stock.prototype.newDay = function () {
    this.xpos = 0;
    this.delta_range = DELTA_RANGE;
    //this.drawHistory();
    this.history = new Array();
    this.history.push([this.xpos,this.ypos]);
    this.line.moveTo(this.xpos, this.ypos);
}

//update graph to current state of stock
Stock.prototype.plot = function () {
    this.ypos = this.ymax - this.price;
    this.history.push([this.xpos,this.ypos]);
    if (OSD) {
        this.line.fillText(this.price, this.xpos - (40 * this.xpos/this.xmax), this.ypos+this.shiftUp);
        this.drawHistory();
    } else {
        this.line.lineTo(this.xpos, this.ypos+this.shiftUp);
        this.line.stroke(); 
    }

}

//return a change in stock price based on delta range and volitility
Stock.prototype.priceChange = function() {
    if (this.is_volitile) {
        this.delta_range += Math.floor(Math.random() * VOLITILE_LEVEL) -VOLITILE_LEVEL;
    }
    this.last_change = (Math.random() * this.delta_range) - (this.delta_range/2);
    this.last_change = Math.round(this.last_change*100) / 100;
    return this.last_change;
}

//drawHistory line from history
Stock.prototype.drawHistory = function () {
    this.line.beginPath();
    this.line.strokeStyle = this.color;
    for(var i=0 ; i<this.history.length ; i++) {
        this.line.lineTo(this.history[i][0],this.history[i][1]+this.shiftUp);
    }
    
    this.line.stroke();
}

//reset stock price
Stock.prototype.reset = function () {
    this.xpos = 0;
    this.ypos = this.ymax - INITIAL_PRICE;
    this.line.moveTo(this.xpos, this.ypos);

    this.price = INITIAL_PRICE;
    this.delta_range = DELTA_RANGE;
    this.is_bust = false;
    this.last_change = 0;
    this.newDay();
}

//update stock price and graph
Stock.prototype.step = function(step) {
    this.line.beginPath();
    this.line.strokeStyle = this.color;
    this.line.moveTo(this.xpos, this.ypos+this.shiftUp);
    if (this.xpos >= this.xmax) {
        this.plot();
        return;
    } else {
        this.xpos += step;
    }
    
    //if company is bust, just plot and return
    if (this.is_bust) {
        this.updateTicker();
        this.plot();
        return;
    }
    
    var delta = this.priceChange();
    this.price += delta;
    if (this.price <= 0) {
        this.price = 0;
        this.is_bust = true;
    }
    this.price = Math.round(this.price*100)/100;
    this.updateTicker();
    this.plot();
    
}

Stock.prototype.updateTicker = function () {
    var elm = document.getElementById(this.symbol_id);
    elm.style.color = this.color;
    elm.innerHTML = this.symbol;
    
    elm = document.getElementById(this.price_id);
    elm.innerHTML = this.price;
    
    elm = document.getElementById(this.change_id);
    elm.innerHTML = (this.last_change >=0) ? '+'+this.last_change : this.last_change;
    elm.className = (this.last_change >= 0) ? 'priceUp' : 'priceDown';
}
