//init the game
var game = new Game();

//adding objects
//bg
var bg = new Entity(0, 0, "img/bg.png", window.innerWidth, window.innerHeight);
game.add(bg);

//player
var player = new Entity(0, 0, "img/player.png", 64, 64);
player.Speed = 256;
player.Type = "player";
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
        bullet.Type = "bullet";
        bullet.update = function (modifier){ 
            bullet.x += bullet.Speed * modifier; 
            if(bullet.x > window.innerWidth){
                game.remove(bullet);
            }

        };
        game.add(bullet);
    }

    for(obj in game.Objects){
        if (game.Objects[obj].Alive && game.Objects[obj].Type == "npc" && game.touching(player, game.Objects[obj])) {
            //kill npc
            player.Alive = false;
        }
    }
};
game.add(player);


var npcLauncher = new Entity(game.canvas.width - 64, 0, "img/monster.png", 64, 64);
npcLauncher.Speed = 256;
npcLauncher.Type = "npcLauncher";
npcLauncher.update = function(modifier){
    if (38 in keysDown) { // Player holding up
            npcLauncher.y -= npcLauncher.Speed * modifier;
        }
        if (40 in keysDown) { // Player holding down
            npcLauncher.y += npcLauncher.Speed * modifier;
        }

        if (37 in keysDown) { // Player holding left
            //sample npc
            var npc = new Entity(game.canvas.width - 64, 0, "img/monster.png", 64, 64);
            npc.Speed = 256;
            npc.Type = "npc";
            npc.x = npcLauncher.x;
            npc.y = npcLauncher.y;
            npc.update = function (modifier){
                npc.x -= npc.Speed * modifier;
                npc.y += Math.sin(npc.x/100);

                if(npc.x < -npc.Width){
                    npc.x = game.canvas.width - 64;
                }

                // Are they touching?
                for(obj in game.Objects){
                    if (game.Objects[obj].Alive && game.Objects[obj].Type == "bullet" && game.touching(npc, game.Objects[obj])) {
                        //kill npc
                        game.remove(npc);
                        game.remove(game.Objects[obj]);
                    }
                }
            };
            game.add(npc);
        }
};
game.add(npcLauncher);

//starting the game loop
var then = Date.now();//so game knows when it og started
setInterval(function(){ game.main();}, 1); //calls main as fast as it can