//entity
//contructor
var Entity = function(x, y, img, width, height){
	this.x = x;
	this.y = y;
	this.Width = width;
	this.Height = height;
	this.Speed = 256;
	this.Img = new Image();
	this.Img.onload = function(){ this.Ready = true; }
	this.Img.src = img;
}
//drawing the entity to canvas
Entity.prototype.draw = function(ctx){
	if(this.Img.Ready)
		ctx.drawImage(this.Img, this.x, this.y, this.Width, this.Height);
}


var Game = function(){
	//init canvas
	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = window.innerWidth - 5;
	this.canvas.height = window.innerHeight - 5;
	document.body.appendChild(this.canvas);	
	this.Objects = new Array();
}

Game.prototype.add = function(obj){
	this.Objects[this.Objects.length] = obj;
}

Game.prototype.update = function(modifier){  }

Game.prototype.draw = function(){
	for(obj in this.Objects){
		this.Objects[obj].draw(this.ctx);
	}
}

Game.prototype.main = function () {
    var now = Date.now();
    var delta = now - then;
    this.update(delta / 1000);
    this.draw();
    then = now;
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);
