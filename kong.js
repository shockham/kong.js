//--Entity--
//contructor
var Entity = function(x, y, img, width, height, layer){
    this.x = x;
    this.y = y;
    this.Width = width;
    this.Height = height;
    this.Speed = 256; //how fast the entity travels
    this.Type = ""; //for determing what the entity is
    this.Alive = true;
    this.Img = new Image();
    this.Img.onload = function(){ this.Ready = true; };
    this.Img.src = img;
    this.Rotation = 0;
    this.layer = layer || 0;
};
//Empty update function to start with
Entity.prototype.update = function(modifier){};
//drawing the entity to canvas
Entity.prototype.draw = function(ctx){
    ctx.save();
    ctx.translate(this.x+this.Width/2, this.y+this.Height/2);
    ctx.rotate(this.Rotation);
    if(this.Img.Ready)
        ctx.drawImage(this.Img, -(this.Width/2), -(this.Height/2), this.Width, this.Height);
    ctx.restore();
};
//--Textity--
//constructor
var Textity = function(x, y, txt, colour, size, layer){
    this.x = x;
    this.y = y;
    this.Text = txt;
    this.Colour = colour;
    this.Size = size;
    this.Alive = true;
    this.layer = layer || 0;
};
//Empty update function
Textity.prototype.update = function(modifier){};
//draw function
Textity.prototype.draw = function(ctx){
    ctx.font= this.Size + "px 'VT323'";
    ctx.textAlign = 'center';
    ctx.fillStyle = this.Colour;
    ctx.fillText(this.Text, this.x, this.y);
};
//--Rectity--
//constructor
var Rectity = function(x, y, colour, width, height, layer){
    this.x = x;
    this.y = y;
    this.Width = width;
    this.Height = height;
    this.Colour = colour;
    this.Alive = true;
    this.layer = layer || 0;
};
//Empty update
Rectity.prototype.update = function(modifier){};
//draw function
Rectity.prototype.draw = function(ctx){
    ctx.fillStyle = this.Colour;
    ctx.fillRect(this.x, this.y, this.Width, this.Height);
};
//--Linety-
//constructor
var Linity = function(x, y, endX, endY, width, layer){
    this.x = x;
    this.y = y;
    this.EndX = endX;
    this.EndY = endY;
    this.Width = width;
    this.Colour = "#000000";
    this.Alive = true;
    this.layer = layer || 0;
};
//Empty update
Linity.prototype.update = function(modifier){};
//draw function
Linity.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle = this.Colour;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.EndX, this.EndY);
    ctx.lineWidth = this.Width;
    ctx.stroke();
    ctx.restore();
};
//--state--
//constructor
var State = function(){
    this.Objects = [];
};
//function to add items to game
State.prototype.add = function(obj){
    this.Objects[this.Objects.length] = obj;
};
//function to remove items from game
State.prototype.remove = function(obj){
    var rm_ind = this.Objects.indexOf(obj);
    if(rm_ind != -1) this.Objects.splice(rm_ind,1);
};
//by default calls all the objects update methods
State.prototype.update = function(modifier){
    for(var obj in this.Objects){
        if(this.Objects[obj].Alive)
            this.Objects[obj].update(modifier);
    }
};
//handles the drawing of everything added to game
State.prototype.draw = function(){
    var ctx = [];
    for(var i=0;i<=2;i++){
        ctx.push(document.getElementById("game_canvas_"+i).getContext("2d"));
        ctx[i].clearRect(0,0, ctx[i].canvas.width, ctx[i].canvas.height);
    }
    for(var obj in this.Objects){
        if(this.Objects[obj].Alive)
            this.Objects[obj].draw(ctx[this.Objects[obj].layer]);
    }
};
//--Game--
//contructor
var Game = function(resx, resy, sizex, sizey){
    //init canvases
    this.width = resx;
    this.height = resy;
    for (var i = 0; i <= 2; i++) {
        this.add_canvas(i, resx, resy, sizex, sizey);
    }
    this.State = new State();
};
//function to add canvases or layers
Game.prototype.add_canvas = function(layer_no, resx, resy, sizex, sizey){
    var cnv = document.createElement("canvas");
    cnv.id = "game_canvas_"+layer_no;
    cnv.width = resx;
    cnv.height = resy;
    cnv.style.width = sizex + "px";
    cnv.style.height = sizey + "px";
    cnv.style.position = 'absolute';
    cnv.style.backgroundColor = 'transparent';
    //text formatting stuff
    var context = cnv.getContext("2d");
    context.font = '40px Monofett';
    context.textBaseline = 'top';
    document.body.appendChild(cnv);
};

//by default calls all the objects update methods
Game.prototype.update = function(modifier){
    this.State.update(modifier);
};
//handles the drawing of everything added to game
Game.prototype.draw = function(){
    this.State.draw();
};
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
var _g_; //game reference
//called as fast as can handles updates
Game.prototype.main = function (g) {
    var now = Date.now();
    var delta = now - then;
    this.draw();
    this.update(delta / 1000);
    then = now;
    if (g) _g_ = g;
    window.requestAnimFrame(function(){_g_.main();});
};
//called to start the game
var then = Date.now();
Game.prototype.start = function(){
    //starting the playState loop
    then = Date.now();//so playState knows when it og started
    this.main(this);
};
//function to test if two objects are touching
Game.prototype.touching = function (a, b){
    if(a.x <= (b.x + b.Width) && b.x <= (a.x + a.Width) && a.y <= (b.y + b.Height) && b.y <= (a.y + a.Height))
        return true;
    else return false;
};
//collisions
Game.prototype.collide = function(a, b){
    if(a.x <= (b.x + b.Width) && b.x <= (a.x + a.Width) && a.y <= (b.y + b.Height) && b.y <= (a.y + a.Height)){
        var x_l = (b.x + b.Width) - a.x;
        var x_r = (a.x + a.Width) - b.x;
        var y_u = (b.y + b.Height) - a.y;
        var y_d = (a.y + a.Height) - b.y;
        if((x_l||x_r)>(y_u||y_d)){
            if(x_l < x_r){
                a.x = b.x + b.Width;
            }else{
                a.x = b.x - b.Width;
            }
        }else{
            if(y_u < y_d){
                a.y = b.y + b.Height;
            }else{
                a.y = b.y - b.Height;
            }
        }
    }
};
//--music--
//constructor
var Music = function(file){
    this.music = document.createElement("audio");
    this.music.src = file;
};
//start a single playthrough
Music.prototype.play = function(){
    this.music.play();
};
//start the looping
Music.prototype.loop = function(){
    this.music.loop = true;
    this.music.play();
};

Music.prototype.stop = function(){
    this.music.pause();
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function(e){
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e){
    delete keysDown[e.keyCode];
}, false);

// Handle touches
var touches = [];

addEventListener("touchstart", function(e){
    e.preventDefault();
    touches = e.touches;
}, false);

addEventListener("touchend", function(e){
    e.preventDefault();
    touches = e.touches;
}, false);

addEventListener("mousedown", function(e){
    touches[0] = e;
}, false);

addEventListener("mouseup", function(e){
    touches[0] = null;
}, false);
