//init the game
var game = new Game();

//adding objects
var bg = new Entity(0, 0, "img/bg.png", window.innerWidth, window.innerHeight);
var player = new Entity(0, 0, "img/player.png", 16, 16);
var npc = new Entity(32 + (Math.random() * (game.canvas.width - 64)), 32 + (Math.random() * (game.canvas.height - 64)), "img/monster.png", 32, 32);

game.add(bg);
game.add(player);
game.add(npc);

// Update game objects
game.update = function (modifier) {
    if (38 in keysDown) { // Player holding up
        player.y -= player.Speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        player.y += player.Speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        player.x -= player.Speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        player.x += player.Speed * modifier;
    }

    // Are they touching?
    if (game.touching(player, npc)) {
        game.ctx.fillText("hey can you help me out? y/n/w", 10, 10);
        if(89 in keysDown){
            game.ctx.fillText("fetch me some badger.",10, 50);
        }else if(78 in keysDown){
            game.ctx.fillText("fine, be like that.",10, 50);
        }else if(87 in keysDown){
            game.ctx.fillText("i don't even know if know anymore.",10, 50);
        }
    }
};

var then = Date.now();//so game knows when it og started
setInterval(function(){ game.main();}, 1); //calls main as fast as it can