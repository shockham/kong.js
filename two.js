//--Entity--
//contructor
var Entity = function(x, y, img, width, height){
	this.x = x;
	this.y = y;
	this.Width = width;
	this.Height = height;
	this.Speed = 256; //how fast the entity travels
	this.Type = ""; //for determing what the entity is
	this.Alive = true;
	this.Img = new Image();
	this.Img.onload = function(){ this.Ready = true; }
	this.Img.src = img;
}
//Empty update function to start with
Entity.prototype.update = function(modifier){}
//drawing the entity to canvas
Entity.prototype.draw = function(ctx){
	if(this.Img.Ready)
		ctx.drawImage(this.Img, this.x, this.y, this.Width, this.Height);
}
//--state--
//constructor
var State = function(){
	this.Objects = new Array();
}
//function to add items to game
State.prototype.add = function(obj){
	this.Objects[this.Objects.length] = obj;
}
//function to remove items from game
State.prototype.remove = function(obj){
	this.Objects.splice(this.Objects.indexOf(obj),1);
}
//by default calls all the objects update methods
State.prototype.update = function(modifier){ 
	for(obj in this.Objects){
		if(this.Objects[obj].Alive)
			this.Objects[obj].update(modifier);
	}
}
//handles the drawing of everything added to game
State.prototype.draw = function(){
	for(obj in this.Objects){
		if(this.Objects[obj].Alive)
			this.Objects[obj].draw(document.getElementById("game_canvas").getContext("2d"));
	}
}
//--Game--
//contructor
var Game = function(){
	//init canvas
	this.canvas = document.createElement("canvas");
	this.canvas.id = "game_canvas";
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = window.innerWidth - 5;
	this.canvas.height = window.innerHeight - 5;
	document.body.appendChild(this.canvas);	
	this.State = new State();
	//text formatting stuff
	this.ctx.font = '40px Monofett';
    this.ctx.textBaseline = 'top';
}

//by default calls all the objects update methods
Game.prototype.update = function(modifier){ 
	this.State.update(modifier);
}
//handles the drawing of everything added to game
Game.prototype.draw = function(){
	this.State.draw();
}
//called as fast as can handles updates
Game.prototype.main = function () {
    var now = Date.now();
    var delta = now - then;
    this.draw();
    this.update(delta / 1000);
    then = now;
}
//function to test if two objects are touching
Game.prototype.touching = function (a, b){
	if (
        a.x <= (b.x + b.Width)
        && b.x <= (a.x + a.Width)
        && a.y <= (b.y + b.Height)
        && b.y <= (a.y + a.Height)
    ) {
        return true;
    }else{
    	return false;
    }
}
//--music--
//constructor
var Music = function(file){
    this.music = document.createElement("audio");
    this.music.src = file;
    this.music2 = document.createElement("audio");
    this.music2.src = file;
}
//start a single playthrough
Music.prototype.play = function(){
	this.music.play();
}
//start the looping
Music.prototype.loop = function(length){
	var m = this;
    this.music.play();
    setInterval(function(){m.music.play();}, length);
	setInterval(function(){m.music2.play();}, length);
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);
