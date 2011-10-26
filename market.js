/*
 * market.js
 * Defines a Market class
 */

//defaults
DELAY=1000;
STEP_SIZE=5;

//return x,y coordinates of e
function getLocation(elm,e) {
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    }
    x -= elm.offsetLeft;
    y -= elm.offsetTop;
    return [x,y];
}

// constructer
function Market(u_id, container_id, stock_symbols) {
    var th = this;
    this.delay = DELAY;
    this.day = 1;
    this.time = 0;
    this.is_open = false;
    this.number_of_stocks = stock_symbols.length;
    this.shiftUp = 0;
    this.investors = new Array();
    
    this.u_id = u_id;
    this.container_id = container_id;
    this.stock_container_id = this.u_id+'_stocks';
    this.investor_container_id = this.u_id+'_investors';
    this.canvas_id = this.u_id+'_canvas';
    this.buildHtml();
    
    this.canvas = document.getElementById(this.canvas_id);
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.getAttribute('width');
    this.height = this.canvas.getAttribute('height');
    this.timeInDay = this.width;
    
    //create stocks
    this.stocks = new Object();
    for (var i=0 ; i<stock_symbols.length ; i++) {
        this.stocks[stock_symbols[i]] = new Stock(this.u_id+'_stock-'+i, this.stock_container_id, this.canvas, stock_symbols[i]);
    }
    
    this.drawGridLines();
    
    if (this.number_of_stocks == 1) {
        this.canvas.addEventListener("click",function (e) {th.clickToTrade(e);} , false);
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
    node.setAttribute('id', inv_id+'-cash');
    elm.appendChild(node);
    node.innerHTML = investor.cash;
    
    //worth
    node = document.createElement('div');
    node.setAttribute('id', inv_id+'-worth');
    elm.appendChild(node);
    node.innerHTML = investor.cash;
    
    //buy / sell buttons for each stock
    for (var key in this.stocks) {
        var outer = document.createElement('div');
        outer.setAttribute('class', 'investor-stock-container');
        elm.appendChild(outer);
        
        //symbol
        node = document.createElement('div');
        node.setAttribute('id', inv_id+'-symbol-'+key);
        node.setAttribute('class', 'investor-symbol');
        outer.appendChild(node);
        node.innerHTML = this.stocks[key].symbol + 'x';
        
        //qty
        node = document.createElement('div');
        node.setAttribute('id', inv_id+'-qty-'+key);
        node.setAttribute('class', 'investor-qty');
        outer.appendChild(node);
        node.innerHTML = investor.qtyOf(this.stocks[key]);

        //buy / sell buttons
        node = document.createElement('button');
        node.onclick = function () {th.stockBuy(investor_number,key,1);}
        outer.appendChild(node);
        node.innerHTML = 'buy';
        
        node = document.createElement('button');
        node.onclick = function () {th.stockSell(investor_number,key,1);}
        outer.appendChild(node);
        node.innerHTML = 'sell';
    }
    
    this.updateInvestorData();
    
}

//build html for a market, append to id=this.container_id
Market.prototype.buildHtml = function () {
    var th = this;
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
    
    //start button
    node = document.createElement('button');
    node.onclick = function () {th.start();}
    sidebar.appendChild(node);
    node.innerHTML = 'start';
    
    //reset button
    node = document.createElement('button');
    node.onclick = function () {th.reset();}
    sidebar.appendChild(node);
    node.innerHTML = 'reset';
    
    //speed controls
    node = document.createElement('div');
    node.setAttribute('class', 'clear');
    sidebar.appendChild(node);
    
    node = document.createElement('div');
    node.setAttribute('class', 'button');
    node.onclick = function () {th.speedSlower();}
    sidebar.appendChild(node);
    node.innerHTML = '<';
    
    node = document.createElement('div');
    node.setAttribute('class', 'button');
    node.onclick = function () {th.speedPause();}
    sidebar.appendChild(node);
    node.innerHTML = 'pause';
    
    node = document.createElement('div');
    node.setAttribute('class', 'button');
    node.onclick = function () {th.speedFaster();}
    sidebar.appendChild(node);
    node.innerHTML = '>';
    
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
    this.context.clearRect(0,0,this.width,this.height);
    this.drawGridLines();
}

//click to trade only works if there is one stock, so
//it will assume user is referring to first one
//buy stock if touched above or equal to current stock price
//sell if stock is below current stock price
Market.prototype.clickToTrade = function (e) {
    var elm = document.getElementById(this.container_id);
    var location = getLocation(elm,e);
    var price;
    var sym;
    for (var sym in this.stocks) {
        price = this.stocks[sym].ypos+this.stocks[sym].shiftUp;
        sym=sym;
        break;
    }
    
    if(location[1] <= price) {
        this.stockBuy(0,sym,1);
    } else {
        this.stockSell(0,sym,1);
    }
}

Market.prototype.drawGridLines = function () {
    this.context.beginPath();
    this.context.strokeStyle = '#eee';
    for (var x=0 ; x<this.width ; x+=STEP_SIZE) {
        this.context.moveTo(x, 0);
        this.context.lineTo(x, this.width);
    }
    
    for (var y=0 ; y<this.height ; y+=50) {
        this.context.moveTo(0, y);
        this.context.lineTo(this.width, y);
        if (y % 50 == 0) {
            this.context.fillText(this.height-y+this.shiftUp, 0, y);
        }
    }
    
    this.context.stroke();
}
//return the price of stock given its symbol
Market.prototype.priceOf = function (sym) {
    return this.stocks[sym].price;
}

//reset market
Market.prototype.reset = function () {
    this.time = 0;
    this.is_open = false;
    this.day = 0;
    for (var sym in this.stocks) {
        this.stocks[sym].reset();
    }
    this.clear();
}

//Functions to control market speed
Market.prototype.speedFaster = function () {
    this.delay /= 5;
}

Market.prototype.speedPause = function () {
    this.is_open = (this.is_open) ? false : true;
    if (this.is_open) {
        this.tick();
    }
}

Market.prototype.speedSlower = function () {
    this.delay *= 5;
}

//start a day
Market.prototype.start = function () {
    this.time = 0;
    this.clear();
    this.is_open = true;
    for (var sym in this.stocks) {
        this.stocks[sym].newDay();
    }
    this.tick();
}

//purchase stock
Market.prototype.stockBuy = function (investor_number, symbol, qty) {
    //get price
    var price = this.stocks[symbol].price;
    var totalPrice = price * qty;
    
    //cannot buy if stock is bust
    if (this.stocks[symbol].is_bust) {
        return;
    }
    
    //get investor and check if can afford purchase
    var investor = this.investors[investor_number];
    if (!investor.canAfford(totalPrice)) {
        return;
    }
    
    //purchase
    investor.debit(totalPrice);
    investor.portfolio.add(symbol,qty);
    
    this.updateInvestorData();
    
}

//sell stock
Market.prototype.stockSell = function (investor_number, symbol, qty) {
    //get price
    var price = this.stocks[symbol].price;
    var totalPrice = price * qty;
    
    //get investor
    var investor = this.investors[investor_number];
    
    //if investor doesnt own stock, return
    if (investor.qtyOf(symbol) <= 0) {
        return;
    }
    
    //purchase
    investor.credit(totalPrice);
    investor.portfolio.del(symbol,qty);
    
    this.updateInvestorData();    
}

//market pulse to update all stocks
Market.prototype.tick = function () {
    if (this.time < this.timeInDay && this.is_open) {
        this.clear();
        //update stocks
        for (var key in this.stocks) {
            this.stocks[key].step(STEP_SIZE);
            
            //check if stock is past upper threshold
            if (this.stocks[key].threshold > this.stocks[key].ypos + this.stocks[key].shiftUp) {
                this.shiftUp += Math.round(this.height/2 * 100) / 100;
                this.stocks[key].shiftUp = this.shiftUp;
                this.clear();
                this.stocks[key].drawHistory();
            }
            
            //check if stocks is past lower threshold
            if (this.shiftUp > 0 && this.stocks[key].ypos + this.stocks[key].shiftUp > this.height - this.stocks[key].threshold) {
                this.shiftUp -= Math.round(this.height/2 * 100) / 100;
                this.stocks[key].shiftUp = this.shiftUp;
                this.clear();
                this.stocks[key].drawHistory();               
            }
        }
        this.time += STEP_SIZE;
        setTimeout(function(thisObj) {thisObj.tick();}, this.delay, this);
    } else {
        this.is_open = false;
    }
    
    this.updateInvestorData();
}

//update investor cash, qty data
Market.prototype.updateInvestorData = function () {
    for (var i=0 ; i<this.investors.length ; i++) {
        var inv = this.investors[i];
        var inv_id = this.u_id+'_investor-1';
        var worth = 0;
        
        //cash
        var node = document.getElementById(inv_id+'-cash');
        node.innerHTML = inv.cash;
        
        worth = inv.cash;
        
        //iterate through stocks in portfolio
        //update worth
        //if stock is bust, remove shares
        for (var sym in inv.portfolio.stocks) {        
            //qty
            node = document.getElementById(inv_id+'-qty-'+sym);
            node.innerHTML = inv.qtyOf(sym);
            
            if (this.stocks[sym].is_bust) {
                inv.portfolio.del(sym, inv.qtyOf(sym));
            }
            
            worth += inv.qtyOf(sym) * this.priceOf(sym);
        }
        
        node = document.getElementById(inv_id+'-worth');
        node.innerHTML = Math.round(worth*100)/100;

    }
}