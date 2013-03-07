//init the game
var game = new Game(960, 480, 960, 480);

//init the menu state
var menuState = new State();
game.State = menuState;

menuState.update = function(modifier){
    if(32 in keysDown){
        game.State = playState;
    }
};

var menuBg = new Entity(0, 0, "img/bg.png", game.width, game.height, 0);
menuState.add(menuBg);

var title = new Textity(0,00, "iso", "#FFA500", 70, 2);
menuState.add(title);

var pressX = new Textity(0, game.height - 20, "press space to start", "#FFA500", 20, 2);
menuState.add(pressX);

//init the playState
var playState = new State();

//bg
playState.add(new Entity(0,0,"img/bg.png", game.width, game.height, 0));

//the isometric tilemap
var map_width=40, map_height=40;
var tile_width=24, tile_height=24;
var x_base = game.width/2 - tile_width/2;
//first layer
for(var x=0;x<map_width;x++){
    for(var y=0;y<map_height;y++){
        playState.add(
            new Entity(
                x_base+((y*(tile_height/2))+(x*(tile_width/2))), 
                (y*(tile_height/4))+(x*(tile_width/4)),
                "img/grass_block.png", tile_width, tile_height, 1)
            );
    }
    x_base -= tile_width;
}
//second layer
x_base = game.width/2 - tile_width/2;
for(var x=0;x<map_width;x++){
    for(var y=0;y<map_height;y++){
        if(x<=10||x>=30){
            playState.add(
                new Entity(
                    x_base+((y*(tile_height/2))+(x*(tile_width/2))), 
                    (y*(tile_height/4))+(x*(tile_width/4)) - ((tile_height/2)-1),
                    "img/grass_block.png", tile_width, tile_height, 1)
                );
        }
    }
    x_base -= tile_width;
}
//third layer
x_base = game.width/2 - tile_width/2;
for(var x=0;x<map_width;x++){
    for(var y=0;y<map_height;y++){
        if(x<=6||x>=34){
            playState.add(
                new Entity(
                    x_base+((y*(tile_height/2))+(x*(tile_width/2))), 
                    (y*(tile_height/4))+(x*(tile_width/4)) - ((tile_height)-2),
                    "img/grass_block.png", tile_width, tile_height, 1)
                );
        }
    }
    x_base -= tile_width;
}


//player
var player = new Entity(game.width/2, game.height/2, "img/player_tall.png", 24, 35, 2);
player.Speed = 100;
player.Type = "player";
player.Reloaded = true;
player.update = function (modifier){
    if (87 in keysDown && player.y > 0) { // Player holding up
        player.y -= (player.Speed * modifier)/2;
        player.x += player.Speed * modifier;
    }
    if (83 in keysDown && player.y + player.Height < game.height ) { // Player holding down
        player.y += (player.Speed * modifier)/2;
        player.x -= player.Speed * modifier;
    }
    if (65 in keysDown && player.x > 0) { // Player holding left
        player.x -= player.Speed * modifier;
        player.y -= (player.Speed * modifier)/2;
    }
    if (68 in keysDown && player.x + player.Width < game.width) { // Player holding right
        player.x += player.Speed * modifier;
        player.y += (player.Speed * modifier)/2;
    }
    var jumping = false;
    if(32 in keysDown && player.y + player.Height < game.height && player.y > 0 && !jumping ){
        var fall = false;
        jumping = true;
        var jump_height = 0;
        var jump_intr = setInterval(function(){
            player.y--;
            jump_height++;
            if(fall){
                clearInterval(jump_intr);
                jump_intr = setInterval(function(){
                    if(jump_height > 0){
                        jump_height--;
                        player.y++;
                    }else{
                        clearInterval(jump_intr);
                        jumping = false;
                    }
                }, 17);
            }
        }, 17)
        setTimeout(function(){ fall = true }, 200);
    }
}
playState.add(player);

//starting the playState loop
game.start();