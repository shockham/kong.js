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

    if(32 in keysDown){
        var bullet = new Entity(player.x + player.Width, player.y + player.Height/2, "img/bullet.png", 6, 2);
        bullet.Speed = 512;
        bullet.update = function (modifier){ bullet.x += bullet.Speed * modifier; };
        game.add(bullet);
    }

    // Are they touching?
    if (game.touching(player, npc)) {
        //kill player
    }
};
game.add(player);
//sample npc
var npc = new Entity(game.canvas.width - 64, 0, "img/monster.png", 64, 64);
npc.Speed = 256;
npc.Released = false;
npc.update = function (modifier){
    if (38 in keysDown) { // Player holding up
        npc.y -= npc.Speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        npc.y += npc.Speed * modifier;
    }

    if (37 in keysDown) { // Player holding left
        npc.Released = true;
    }

    if(npc.Released){
        npc.x -= npc.Speed * modifier;
    }

    if(npc.x < -npc.Width){
        npc.x = game.canvas.width - 64;
        npc.Released = false;
    }

    // Are they touching?
    if (game.touching(npc, player)) {
        //kill player
    }
};
game.add(npc);

// Update game objects
// game.update = function (modifier) {
//     player.update(modifier);
//     npc.update(modifier);
// };

var then = Date.now();//so game knows when it og started
setInterval(function(){ game.main();}, 1); //calls main as fast as it can