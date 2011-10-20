/*
 * controller.js
 * Controls the state of the daytrader app
 */

var XSTART=0;
var YSTART=200;
var STEP=4;
var DELTA=20;
var DELAY=16;
var VOLITILE=true;


//400 x 280
var canvas = document.getElementById('graph');
var ctx = canvas.getContext('2d');

//draw the zero line
var divider = canvas.getContext('2d');
divider.lineWidth=0.1;
divider.beginPath();
divider.moveTo(XSTART,YSTART);
divider.lineTo(400,YSTART);
divider.stroke();

ctx.strokeStyle = 'black';
ctx.lineWidth = 1;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

ctx.beginPath();
ctx.moveTo(XSTART,YSTART);

function Plot(x,y,delta) {
    ctx.lineTo(x,y);
    ctx.stroke();
    document.getElementById('change').innerHTML = delta*-1;
    document.getElementById('price').innerHTML = YSTART -y;
}

function stockGraph() {
    ypos = YSTART;
    for (var x=XSTART; x<400; x+=STEP) {
        if (VOLITILE) {
            DELTA += Math.floor(Math.random() * 1) -1;
        }
        ydelta = Math.floor(Math.random() * DELTA) - (DELTA/2);
        ypos += ydelta;
        setTimeout("Plot("+x+","+ypos+","+ydelta+")", 100+(x*DELAY));
    }
    //ctx.stroke();
}

//drawRandomLine();
//setInterval(drawRandomLine, 500);
stockGraph();
//slowPlot();
//setTimeout("ctx.clearRect(0,0,400,280)",7000);

