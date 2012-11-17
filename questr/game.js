//init the game
var game = new Game();

//adding objects
var bg = new Entity(0, 0, "img/bg.png", window.innerWidth, window.innerHeight);
var player = new Entity(0, 0, "img/player.png", 16, 16);
var monster = new Entity(0, 0, "img/monster.png", 32, 32);

game.add(bg);
game.add(player);
game.add(monster);

var monstersCaught = 0;


// Reset the game when the player catches a monster
var reset = function () {
    // Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (game.canvas.width - 64));
    monster.y = 32 + (Math.random() * (game.canvas.height - 64));
};

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
    if (
        player.x <= (monster.x + monster.Width)
        && monster.x <= (player.x + player.Width)
        && player.y <= (monster.y + monster.Height)
        && monster.y <= (player.y + player.Height)
    ) {
        ++monstersCaught;
        reset();
    }
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(function(){ game.main();}, 1); // Execute as fast as possible​​