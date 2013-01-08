//init the game
var game = new Game();

//adding objects
//bg
var bg = new Entity(0, 0, "img/bg.png", window.innerWidth, window.innerHeight);
game.add(bg);
//player
var player = new Entity(0, 0, "img/player.png", 64, 64);
player.Speed = 256;
player.update = function (modifier){
    if (87 in keysDown) { // Player holding up
        player.y -= player.Speed * modifier;
    }
    if (83 in keysDown) { // Player holding down
        player.y += player.Speed * modifier;
    }
    if (65 in keysDown) { // Player holding left
        player.x -= player.Speed * modifier;
    }
    if (68 in keysDown) { // Player holding right
        player.x += player.Speed * modifier;
    }

    // Are they touching?
    if (game.touching(player, npc)) {
        //kill player
    }
};
game.add(player);
//sample npc
var npc = new Entity(32 + (Math.random() * (game.canvas.width - 64)), 32 + (Math.random() * (game.canvas.height - 64)), "img/monster.png", 64, 64);
npc.update = function (modifier){
    if (38 in keysDown) { // Player holding up
        npc.y -= npc.Speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        npc.y += npc.Speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        npc.x -= npc.Speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        npc.x += npc.Speed * modifier;
    }

    // Are they touching?
    if (game.touching(npc, player)) {
        //kill player
    }
};
game.add(npc);

// Update game objects
game.update = function (modifier) {
    player.update(modifier);
    npc.update(modifier);
};

var then = Date.now();//so game knows when it og started
setInterval(function(){ game.main();}, 1); //calls main as fast as it can