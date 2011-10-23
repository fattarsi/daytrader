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
    this.investors = new Array();
    
    this.u_id = u_id;
    this.container_id = container_id;
    this.stock_container_id = this.u_id+'_stocks';
    this.investor_container_id = this.u_id+'_investors';
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

//adds an existing investor to the market
//adds buy/sell buttons to sidebar
Market.prototype.addInvestor = function (investor) {
    var th = this;
    this.investors.push(investor);
    
    //key in array for this investor
    var investor_number = this.investors.length -1;
    
    //reference to investor container
    var container = document.getElementById(this.investor_container_id);
    
    var inv_id = this.u_id+'_investor-1';
    
    //add investor node
    var elm = document.createElement('div');
    elm.setAttribute('id', inv_id);
    elm.setAttribute('class', 'investor');
    container.appendChild(elm);
    
    //set investor name
    var node = document.createElement('div');
    node.setAttribute('id', inv_id+'-name');
    elm.appendChild(node);
    node.innerHTML = investor.name;
    
    //set investor cash
    node = document.createElement('div');
    elm.appendChild(node);
    node.innerHTML = investor.cash;
    
    //buy / sell buttons for each stock
    for (var key in this.stocks) {
        var outer = document.createElement('div');
        outer.setAttribute('class', 'investor-stock-container');
        elm.appendChild(outer);
        
        //symbol
        node = document.createElement('div');
        node.setAttribute('class', 'investor-symbol');
        outer.appendChild(node);
        node.innerHTML = this.stocks[key].symbol + 'x';
        
        //qty
        node = document.createElement('div');
        node.setAttribute('class', 'investor-qty');
        outer.appendChild(node);
        node.innerHTML = investor.qtyOf(this.stocks[key]);
        
        //buy / sell buttons
        node = document.createElement('button');
        //node.setAttribute('onclick', 'stockBuy('+investor_number+',\''+key+'\', 1)');
        node.onclick = function () {th.stockBuy();}
        outer.appendChild(node);
        node.innerHTML = 'buy';
        
        node = document.createElement('button');
        node.setAttribute('onclick', 'stockSell('+investor_number+',\''+key+'\', 1)');
        outer.appendChild(node);
        node.innerHTML = 'sell';
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
    var node = document.createElement('div');
    node.setAttribute('id', this.stock_container_id);
    sidebar.appendChild(node);
    
    //container for investers
    node = document.createElement('div');
    node.setAttribute('id', this.investor_container_id);
    node.setAttribute('class', 'investor-container');
    sidebar.appendChild(node);
    
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

Market.prototype.stockBuy = function (investor_number, symbol, qty) {
    alert(this.u_id);
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