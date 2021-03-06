//init the game
var game = new Game(960, 480, 960, 480);

var menuState = new State();
game.State = menuState;

menuState.update = function(modifier){
    if(32 in keysDown){
        game.State = playState;
    }
};

var menuBg = new Entity(0, 0, "img/bg.png", game.width, game.height, 0);
menuState.add(menuBg);

var title = new Textity(0,00, "twoduga", "#FFA500", 70, 2);
menuState.add(title);

var pressX = new Textity(0, game.height - 20, "press space to start", "#FFA500", 20, 2);
menuState.add(pressX);

//init the playState
var playState = new State();

//adding objects
//bg
var bg = new Entity(0, 0, "img/bg.png", game.width, game.height, 0);
playState.add(bg);

var stars = new Entity(0, 0, "img/stars.png", game.width*2, game.height, 0);
stars.update = function(modifier){
    stars.x -= 100*modifier;
    if(stars.x < -stars.Width) stars.x = (stars.Width/2);
};
var stars_ol = new Entity(stars.Width, 0, "img/stars.png", game.width*2, game.height, 0);
stars_ol.update = function(modifier){
    stars_ol.x -= 100*modifier;
    if(stars_ol.x < -stars_ol.Width) stars_ol.x = (stars_ol.Width/2);
};
playState.add(stars);
playState.add(stars_ol);

var oneTime = 30;
var txtOne = new Textity(10, 0, oneTime, "#FFA500", 20, 2);
var twoTime = 30;
var txtTwo = new Textity(game.width - 45, 0, twoTime, "#FFA500", 20, 2);
var timer = setInterval(function(){
    oneTime -= 1;
    txtOne.Text = oneTime;
    twoTime -= 1;
    txtTwo.Text = twoTime; 
 }, 1000);

//player
var player = new Entity(0, game.height/2, "img/ship.png", 24, 24, 1);
player.Speed = 400;
player.Type = "player";
player.Reloaded = true;
player.update = function (modifier){
    if (87 in keysDown && player.y > 0) { // Player holding up
        player.y -= player.Speed * modifier;
    }
    if (83 in keysDown && player.y + player.Height < game.height ) { // Player holding down
        player.y += player.Speed * modifier;
    }
    if (65 in keysDown && player.x > 0) { // Player holding left
        player.x -= player.Speed * modifier;
    }
    if (68 in keysDown && player.x + player.Width < game.width) { // Player holding right
        player.x += player.Speed * modifier;
    }

    if(32 in keysDown && player.Reloaded){
        var bullet = new Entity(player.x + player.Width, player.y + player.Height/2, "img/bullet.png", 6, 2, 1);
        bullet.Speed = 600;
        bullet.Type = "bullet";
        bullet.update = function (modifier){ 
            bullet.x += bullet.Speed * modifier; 
            if(bullet.x > window.innerWidth){
                playState.remove(bullet);
            }
        };
        playState.add(bullet);
        player.Reloaded = false;
        setTimeout(function(){player.Reloaded = true;}, 100);
    }

    for(obj in playState.Objects){
        if (playState.Objects[obj].Alive 
            && (playState.Objects[obj].Type == "npc" || playState.Objects[obj].Type == "enemy_bullet") 
            && game.touching(player, playState.Objects[obj])) {
            if(playState.Objects[obj].interval !== undefined){
                clearInterval(playState.Objects[obj].interval);
            }
            playState.remove(playState.Objects[obj]);
            oneTime -= 2;
            txtOne.Text = oneTime;
            twoTime += 3;
            txtTwo.Text = twoTime;
        }
    }
    if(oneTime <= 0){
        var oneLose = new Textity(0, 0, "Player Two wins", "#FFA500", 50, 2);
        playState.add(oneLose);
        playState.remove(player);
        playState.remove(txtOne);
        playState.remove(txtTwo);
        clearInterval(timer);
    }
};
playState.add(player);

//the entity to launch all the other enemies from
var npcLauncher = new Entity(game.width - 24, game.height/2, "img/enemy_launcher.png", 24, 24, 1);
npcLauncher.Speed = 400;
npcLauncher.Type = "npcLauncher";
npcLauncher.Reloaded = true;
npcLauncher.update = function(modifier){
    if (38 in keysDown && npcLauncher.y > 0) { // Player holding up
        npcLauncher.y -= npcLauncher.Speed * modifier;
    }
    if (40 in keysDown && npcLauncher.y + npcLauncher.Height < game.height) { // Player holding down
        npcLauncher.y += npcLauncher.Speed * modifier;
    }

    if (37 in keysDown && npcLauncher.Reloaded) { // Player holding left
        //sample npc
        var npc = new Entity(game.width - 24, 0, "img/enemy.png", 24, 24, 1);
        npc.Speed = 400;
        npc.Type = "npc";
        npc.x = npcLauncher.x;
        npc.y = npcLauncher.y;
        npc.rate = 100 + Math.random() * 1000;
        npc.pattern = ~~(Math.random()*5);
        npc.reloaded = true;
        npc.fire = function(){
            npc.reloaded = false;
            var bullet = new Entity(npc.x, npc.y + npc.Height/2, "img/enemy_bullet.png", 6, 2, 1);
            bullet.Speed = 600;
            bullet.Type = "enemy_bullet";
            bullet.update = function (modifier){ 
                bullet.x -= bullet.Speed * modifier; 
                if(bullet.x < 0){
                    playState.remove(bullet);
                }
            };
            playState.add(bullet);
            setTimeout(function(){ npc.reloaded = true; }, npc.rate)
        };
        npc.update = function (modifier){
            switch(npc.pattern){
                case 1:
                    if(npc.x < game.width/3 && !npc.going_back) npc.going_back = true;
                    if(npc.going_back) npc.x += (npc.Speed * modifier);
                    else npc.x -= (npc.Speed * modifier);
                    npc.y += Math.sin(npc.x/50);
                    break;
                case 2:
                    npc.x -= npc.Speed * modifier;
                    npc.y -= 3;
                    break;
                case 3:
                    npc.x -= npc.Speed * modifier;
                    npc.y += Math.tan(npc.x/50);
                    break;
                case 4:
                    npc.x -= npc.Speed * modifier;
                    npc.y += 3;
                    break;
                default:
                    npc.x -= npc.Speed * modifier;
                    npc.y += Math.sin(npc.x/50);
                    break;
            }

            if(npc.x < -npc.Width || npc.x > (game.width + npc.Width)){
                playState.remove(npc);
            }

            // Are they touching?
            for(obj in playState.Objects){
                if (playState.Objects[obj].Alive && playState.Objects[obj].Type == "bullet" && game.touching(npc, playState.Objects[obj])) {
                    //kill npc
                    playState.remove(npc);
                    playState.remove(playState.Objects[obj]);
                    oneTime += 2;
                    txtOne.Text = oneTime;
                    twoTime -= 2;
                    txtTwo.Text = twoTime;
                }
            }
            if(npc.reloaded) npc.fire();
        };
        playState.add(npc);
        npcLauncher.Reloaded = false;
        setTimeout(function(){npcLauncher.Reloaded = true;}, 150);
    }
    if(twoTime <= 0){
        var twoLose = new Textity(0, 0, "Player One wins", "#FFA500", 50, 2);
        playState.add(twoLose);
        playState.remove(npcLauncher);
        playState.remove(txtOne);
        playState.remove(txtTwo);
        clearInterval(timer);
    }
};
playState.add(npcLauncher);

playState.add(txtOne);
playState.add(txtTwo);

//add the bgm
var music = new Music("snd/8bitDnB_Loop.mp3");
music.loop(48065);

//starting the playState loop
game.start();