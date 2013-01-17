//init the game
var game = new Game(480, 240, 480, 240);

//init the playState
var playState = new State();
game.State = playState;

//adding objects
//bg
var bg = new Entity(0, 0, "img/bg.png", game.canvas.width, game.canvas.height);
playState.add(bg);

//player
var player = new Entity(0, 0, "img/ship.png", 24, 24);
player.Speed = 400;
player.Type = "player";
player.Reloaded = true;
player.update = function (modifier){
    if (87 in keysDown && player.y > 0) { // Player holding up
        player.y -= player.Speed * modifier;
    }
    if (83 in keysDown && player.y + player.Height < game.canvas.height ) { // Player holding down
        player.y += player.Speed * modifier;
    }
    if (65 in keysDown && player.x > 0) { // Player holding left
        player.x -= player.Speed * modifier;
    }
    if (68 in keysDown && player.x + player.Width < game.canvas.width) { // Player holding right
        player.x += player.Speed * modifier;
    }

    if(32 in keysDown && player.Reloaded){
        var bullet = new Entity(player.x + player.Width, player.y + player.Height/2, "img/bullet.png", 6, 2);
        bullet.Speed = 512;
        bullet.Type = "bullet";
        bullet.update = function (modifier){ 
            bullet.x += bullet.Speed * modifier; 
            if(bullet.x > window.innerWidth){
                playState.remove(bullet);
            }
        };
        playState.add(bullet);
        player.Reloaded = false;
        setTimeout(function(){player.Reloaded = true;}, 150);
    }

    for(obj in playState.Objects){
        if (playState.Objects[obj].Alive && (playState.Objects[obj].Type == "npc" || playState.Objects[obj].Type == "enemy_bullet") && game.touching(player, playState.Objects[obj])) {
            //kill npc
            player.Alive = false;
        }
    }
};
playState.add(player);

//the entity to launch all the other enemies from
var npcLauncher = new Entity(game.canvas.width - 24, 0, "img/enemy_launcher.png", 24, 24);
npcLauncher.Speed = 400;
npcLauncher.Type = "npcLauncher";
npcLauncher.Reloaded = true;
npcLauncher.update = function(modifier){
    if (38 in keysDown && npcLauncher.y > 0) { // Player holding up
        npcLauncher.y -= npcLauncher.Speed * modifier;
    }
    if (40 in keysDown && npcLauncher.y + npcLauncher.Height < game.canvas.height) { // Player holding down
        npcLauncher.y += npcLauncher.Speed * modifier;
    }

    if (37 in keysDown && npcLauncher.Reloaded) { // Player holding left
        //sample npc
        var npc = new Entity(game.canvas.width - 24, 0, "img/enemy.png", 24, 24);
        npc.Speed = 128;
        npc.Type = "npc";
        npc.x = npcLauncher.x;
        npc.y = npcLauncher.y;
        npc.interval = setInterval(function(){
            var bullet = new Entity(npc.x, npc.y + npc.Height/2, "img/enemy_bullet.png", 6, 2);
            bullet.Speed = 512;
            bullet.Type = "enemy_bullet";
            bullet.update = function (modifier){ 
                bullet.x -= bullet.Speed * modifier; 
                if(bullet.x < 0){
                    playState.remove(bullet);
                }
            };
            playState.add(bullet);
        }, 250);
        npc.update = function (modifier){
            npc.x -= npc.Speed * modifier;
            npc.y += Math.sin(npc.x/25);

            if(npc.x < -npc.Width){
                clearInterval(npc.interval);
                playState.remove(npc);
            }

            // Are they touching?
            for(obj in playState.Objects){
                if (playState.Objects[obj].Alive && playState.Objects[obj].Type == "bullet" && game.touching(npc, playState.Objects[obj])) {
                    clearInterval(npc.interval);
                    //kill npc
                    playState.remove(npc);
                    playState.remove(playState.Objects[obj]);
                }
            }
        };
        playState.add(npc);
        npcLauncher.Reloaded = false;
        setTimeout(function(){npcLauncher.Reloaded = true;}, 250);
    }
};
playState.add(npcLauncher);

//add the bgm
var music = new Music("snd/8bitDnB_Loop.mp3");
music.loop(48065);

//starting the playState loop
var then = Date.now();//so playState knows when it og started
setInterval(function(){ game.main();}, 1); //calls main as fast as it can