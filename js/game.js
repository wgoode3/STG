/* The main game file, I really should modularize this a bit more */

/* Item class - items have position and a value */
function Item(x, y, value){
    this.x = x;
    this.y = y;
    this.value = value;
}

/* Bullet class - bullets have position and speed */
function Bullet(x, y, vx, vy, type){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    this.phi = 0;
}

/* Enemy class - has position and health */
function Enemy(x, y, vx, vy, hp, type, path, spot, state){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.hp = hp;
    this.type = type;
    this.path = path;
    this.spot = spot;
    this.state = state;
}

/* Purely cosmetic leaves */
function Leaf(x,y, state){
    this.x = x;
    this.y = y;
    this.state = state;
    this.vy = 1;
}

/* Moves the enemies about */

// TODO: this looks like it could be refactored

function moveEnemies(){
    let output = '';
    for(let i=0; i<enemies.length; i++){
        if(enemies[i].path == "l-r" || enemies[i].path == "tl-rb"){
            // left to right
            enemies[i].x += enemies[i].vx
            enemies[i].y += enemies[i].vy
            enemies[i].y += 0.5*Math.floor(Math.cos(enemies[i].state++*(Math.PI/40)));
            enemies[i].state = enemies[i].state % 80;
            output += `<div class="enemy" style="position:absolute;top:${enemies[i].y}px;left:${enemies[i].x}px;"></div>`;
            if(enemies[i].hp <= 0){
                hit.play();
                enemies.splice(i, 1);
                count++;
            }else if(enemies[i].x > borders.width){
                enemies.splice(i, 1);
            }else if(enemies[i].x > enemies[i].spot){
                enemies[i].shoot();
                enemies[i].spot += randInt(500);
            }
        }else if(enemies[i].path == "r-l" || enemies[i].path == "tr-lb"){
            // right to left
            enemies[i].x += enemies[i].vx
            enemies[i].y += enemies[i].vy
            enemies[i].y += 0.5*Math.floor(Math.cos(enemies[i].state++*(Math.PI/40)));
            enemies[i].state = enemies[i].state % 80;
            output += `<div class="enemy" style="position:absolute;top:${enemies[i].y}px;left:${enemies[i].x}px;"></div>`;
            if(enemies[i].hp <= 0){
                hit.play();
                enemies.splice(i, 1);
                count++
            }else if(enemies[i].x < 0){
                enemies.splice(i, 1);
            }else if(enemies[i].x < enemies[i].spot){
                enemies[i].shoot();
                enemies[i].spot -= randInt(500);
            }
        }else if(enemies[i].path == "t-p"){
            // top to player, bonzai charge fairy
            let fairySpeed = 4;
            let px = player.position.x;
            let py = player.position.y;
            let Dx = px-enemies[i].x;
            let Dy = py-enemies[i].y;
            let distance = Math.pow((Math.pow(Dx, 2) + Math.pow(Dy, 2)), 0.5)
            enemies[i].x += (Dx/distance)*fairySpeed;
            enemies[i].y += (Dy/distance)*fairySpeed;
            output += `<div class="enemy" style="position:absolute;top:${enemies[i].y}px;left:${enemies[i].x}px;"></div>`;
            if(enemies[i].state-- <= 0){
                enemies[i].state = randInt(100);
                enemies[i].shoot();
            }
            if(enemies[i].hp <= 0){
                hit.play();
                enemies.splice(i, 1);
                count++
            }

        }
    }
    document.getElementById("enemies").innerHTML = output;
}

/* Make the enemies shoot at the player */
Enemy.prototype.shoot = function(){
    if(Math.random() > 0.5){
        let bulletSpeed = 8;
        let px = player.position.x;
        let py = player.position.y;
        let Dx = px-this.x;
        let Dy = py-this.y;
        let distance = Math.pow((Math.pow(Dx, 2) + Math.pow(Dy, 2)), 0.5)
        let vx = (Dx/distance)*bulletSpeed;
        let vy = (Dy/distance)*bulletSpeed;
        /* line of bullets directed at the player */
        enemyBullets.push(new Bullet(this.x, this.y, vx, vy, "bullet1"));
        enemyBullets.push(new Bullet(this.x, this.y, vx*0.9, vy*0.9, "bullet1"));
        enemyBullets.push(new Bullet(this.x, this.y, vx*0.8, vy*0.8, "bullet1"));
        enemyBullets.push(new Bullet(this.x, this.y, vx*0.7, vy*0.7, "bullet1"));
        enemyBullets.push(new Bullet(this.x, this.y, vx*0.6, vy*0.6, "bullet1"));
    }else{
        /* curtain of bullets */
        enemyBullets.push(new Bullet(this.x, this.y, 0, 2.5, "bullet2"));
        enemyBullets.push(new Bullet(this.x, this.y, 1.5, 2, "bullet2"));
        enemyBullets.push(new Bullet(this.x, this.y, -1.5, 2, "bullet2")); 
        enemyBullets.push(new Bullet(this.x, this.y, 0.75, 2.4, "bullet2"));   
        enemyBullets.push(new Bullet(this.x, this.y, -0.75, 2.4, "bullet2"));   
    }
}

/* Make the enemy bullets move */
function moveEnemyBullets(){
    let output = '';
    for(let i=0; i<enemyBullets.length; i++){
        if(enemyBullets[i].y < 0 || enemyBullets[i].y > borders.height){
            enemyBullets.splice(i, 1);
        } else if (enemyBullets[i].x < 0 || enemyBullets[i].x + 10 > borders.width) {
            enemyBullets.splice(i, 1);
        } else {
            output += `<div class="${enemyBullets[i].type}" style="position:absolute;top:${enemyBullets[i].y+=enemyBullets[i].vy}px;left:${enemyBullets[i].x+=enemyBullets[i].vx}px;"></div>`;
        }
    }
    document.getElementById("enemy-bullets").innerHTML = output;
}

/* queues up various types of enemy attack waves */
const waves = [
    {
        "size": 10, "type": "fairy", "path": "l-r", "hp": 3, "vx": 4, "vy": 0, "x": -50, "y": 150, "offset": 200, "spot": randInt(150)
    },
    {
        "size": 10, "type": "fairy", "path": "r-l", "hp": 3, "vx": -4, "vy": 0, "x": 50, "y": 150, "offset": 200, "spot": borders.width - randInt(150)
    },
    {
        "size": 8, "type": "fairy", "path": "tl-rb", "hp": 3, "vx": 5, "vy": 1, "x": -50, "y": 50, "offset": 150, "spot": randInt(150)
    },
    {
        "size": 8, "type": "fairy", "path": "tr-lb", "hp": 3, "vx": -5, "vy": 1, "x": 50, "y": 50, "offset": 150, "spot": borders.width - randInt(150)
    },
    {
        "size": 1, "type": "fairy", "path": "t-p", "hp": 30, "vx": 0, "vy": 3, "x": null, "y": -50, "offset": null, "spot": null
    }
];

/* Spawns enemy waves */
let delay = 100;
function spawnEnemies(){
    while(enemies.length < wave_size && delay-- <= 0){
        let wave = waves[Math.floor(Math.random()*waves.length)];
        for(var i=0; i<wave["size"]; i++){
            if(wave["path"] == "l-r" || wave["path"] == "tl-rb"){
                var x = wave["x"] - i*wave["offset"];
                var state = randInt(100);
            }else if(wave["path"] == "r-l" || wave["path"] == "tr-lb"){
                var x = wave["x"] + i*wave["offset"] + borders.width;
                var state = randInt(100);
            }else if(wave["path"] == "t-p"){
                var x = borders.width / 2 >> 0;
                var state = randInt(100);
            }
            enemies.push(
                new Enemy(
                    x, wave["y"], wave["vx"], wave["vy"], wave["hp"], wave["type"], wave["path"], wave["spot"], state
                )
            );
        }
        delay = delay_constant;
    }
}


/* Make some items (power ups) to test them out */
// genItems();
function genItems(){
    items.push(
        new Item(0.25*borders.width, 0.75*borders.height, 'single'),
        new Item(0.5*borders.width, 0.75*borders.height, 'double'), 
        new Item(0.75*borders.width, 0.75*borders.height, 'spread')
    );
}

/* Returns a random integer in the width of the play area */
function randX(){
    return Math.floor(Math.random()*(borders.width-50))+25;
}

/* Returns a random integer in the height of the play area */
function randY(){
    return Math.floor(Math.random()*(borders.height-50))+25;
}

/* Returns a random int from 1 to num */
function randInt(num){
    return Math.floor(Math.random()*(num))+1;
}

/* Make some leaves! */
function genLeaves(){
    while(leaves.length < numLeaves){
        leaves.push(
            // turn over a new leaf, heh
            new Leaf(randX(), randY(), randInt(80))
        );
    }
}

/* Moves the player around */
let delta = {x:0, y:0};
// let prev_delta = delta;
function movePlayer(){

    keyMap.focus ? speed = top_speed/2: speed = top_speed;

    if (keyMap.left) { 
        delta.x -= accel; 
    }
    if (keyMap.right) { 
        delta.x += accel; 
    }
    if (keyMap.up) { 
        delta.y -= accel; 
    }
    if (keyMap.down) { 
        delta.y += accel; 
    }

    // /* if not moving left or right then slow down */
    // if (!keyMap.left && !keyMap.right) {
    //     if (delta.x > 0) {
    //         delta.x -= deccel;
    //     } else if (delta.x < 0) {
    //         delta.x += deccel;
    //     }
    // }

    // /* if not moving up or down then slow down */
    // if (!keyMap.up && !keyMap.down) {
    //     if (delta.y > 0) {
    //         delta.y -= deccel;
    //     } else if (delta.y < 0) {
    //         delta.y += deccel;
    //     }
    // }

    /* stop abruptly */
    if (!keyMap.left && !keyMap.right) {
        delta.x = 0;
    }
    if (!keyMap.up && !keyMap.down) {
        delta.y = 0;
    }

    /* only `accel` up to `speed` */
    if (Math.abs(delta.x) > speed) {
        delta.x > 0 ? delta.x = speed: delta.x = -speed;
    }
    if (Math.abs(delta.y) > speed) {
        delta.y > 0 ? delta.y = speed: delta.y = -speed;
    }

    /* make diagonals move same speed as cardinal directions */
    if (Math.abs(delta.x) + Math.abs(delta.y) >= 2*speed) {
        delta.x *= Math.sqrt(2)/2;
        delta.y *= Math.sqrt(2)/2;
    }

    /* if the speed is close to zero make it zero */
    if (Math.abs(delta.x) < accel) {
        delta.x = 0;
    }
    if (Math.abs(delta.y) < accel) {
        delta.y = 0;
    }

    // prev_delta = delta;

    /* we can check position here for collisions */
    if (checkBounds('x', borders.width, delta.x)) {
        player.position.x += delta.x;
    } else {
        delta.x = 0;
    }
    if (checkBounds('y', borders.height, delta.y)) {
        player.position.y += delta.y;
    } else {
        delta.y = 0;
    }

    document.getElementById("player").style["top"] = `${player.position.y}px`;
    document.getElementById("player").style["left"] = `${player.position.x}px`;
    if(delta.x < 0){
        document.getElementById("player").style["transform"] = `rotate(-5deg)`; 
    }else if(delta.x > 0){
        document.getElementById("player").style["transform"] = `rotate(5deg)`; 
    }else{
        document.getElementById("player").style["transform"] = `rotate(0deg)`;
    }
}

/* Fires one of multiple types of shot */
let cooldown = 0;
function fire(){
    
    const l_offset = (player_width/2) + 10
    const h_offset = 20

    /* Starting power */
    function single(){
        bullets.push(
            new Bullet(player.position.x + l_offset, player.position.y + h_offset, 0, -bullet_speed, "bullet")
        );
    }
    /* Shoots two bullets */
    function double(){
        bullets.push(
            new Bullet(player.position.x + l_offset-15, player.position.y + h_offset, 0, -bullet_speed, "bullet"), 
            new Bullet(player.position.x + l_offset+15, player.position.y + h_offset, 0, -bullet_speed, "bullet")
        );
    }
    /* Shoots in a spread pattern */
    function spread(){
        if(keyMap["focus"]){
            bullets.push(
                new Bullet(player.position.x + l_offset, player.position.y + h_offset, 0, -bullet_speed, "bullet"), 
                new Bullet(player.position.x + l_offset-15, player.position.y + h_offset, -0.5, -bullet_speed, "bullet"), 
                new Bullet(player.position.x + l_offset+15, player.position.y + h_offset, 0.5, -bullet_speed, "bullet")
            );
        }else{
            bullets.push(
                new Bullet(player.position.x + l_offset, player.position.y + h_offset, 0, -bullet_speed, "bullet"), 
                new Bullet(player.position.x + l_offset-15, player.position.y + h_offset, -2, -bullet_speed, "bullet"), 
                new Bullet(player.position.x + l_offset+15, player.position.y + h_offset, 2, -bullet_speed, "bullet")
            );
        }
    }
    if (keyMap.shoot) { 
        if (cooldown <= 0){
            // shot.play();
            if (player.power === 'single') {
                single();
            } else if(player.power === 'double') {
                double();
            } else if(player.power === 'spread') {
                spread();
            }
            cooldown = cooldown_timer;
        }
        cooldown--;
    }
}

/* Make the bullets move */
function moveBullets(){
    let output = '';
    for(let i=0; i<bullets.length; i++){
        if(bullets[i].y < 0 || bullets[i].y > borders.height){
            bullets.splice(i, 1);
        } else if (bullets[i].x < 0 || bullets[i].x + 10 > borders.width) {
            bullets.splice(i, 1);
        } else {
            bullets[i].phi += angular_velocity;
            output += `<div class="bullet spin" style="position:absolute;top:${bullets[i].y+=bullets[i].vy}px;left:${bullets[i].x+=bullets[i].vx}px;transform:rotate(${bullets[i].phi}deg);"></div>`;
        }
    }
    document.getElementById("bullets").innerHTML = output;

}

/* Moves the leaves */
function moveLeaves(){
    let output = '';
    for(let i=0; i<leaves.length; i++){
        if(leaves[i].y < 0 || leaves[i].y > borders.height - 50){
            leaves.splice(i, 1);
        }else{
            leaves[i].y += leaves[i].vy;
            leaves[i].x += Math.floor(2*Math.sin(leaves[i].state++*(Math.PI/40)));
            if(leaves[i].state >= 80){
                leaves[i].state = 0;
            }
            output += `<div class="leaf" style="position:absolute;top:${leaves[i].y}px;left:${leaves[i].x}px;"></div>`;
        }
    }
    document.getElementById("leaves").innerHTML = output;
}

/* check if the player will go out of bounds */
function checkBounds(dimension, bound, delta){
    dimension == 'x' ? bound -= player_width : bound -= player_height;
    let pos = player.position[dimension] + delta;
    return pos < bound && pos > 0;
}

/* Displays the items */
function displayItems(){
    let output = '';
    for(let i=0; i<items.length; i++){
        let colors = {
            'single': 'var(--orange)',
            'double': 'var(--cyan)',
            'spread': 'var(--green)'
        }
        output += `<div class="item" style="position:absolute;top:${items[i].y}px;left:${items[i].x}px;background-color:${colors[items[i].value]};"></div>`
    }
    document.getElementById("items").innerHTML = output;
}
displayItems();

/* Detects all bullet collisions */
function detectBulletCollisions(){
    for(let i=0; i<enemies.length; i++){
        for(let j=0; j<bullets.length; j++){
            let ex = enemies[i].x;
            let bx = bullets[j].x;
            if (ex-10 < bx && ex+70 > bx) {
                let ey = enemies[i].y
                let by = bullets[j].y
                if (ey-10 < by && ey+50 > by) {
                    bullets.splice(j, 1);
                    enemies[i].hp--;
                }
            } 
        }
    }

    let hitbox = 32; 
    for(let i=0; i<enemyBullets.length; i++){
        let ex = enemyBullets[i].x;
        let px = player.position.x;
        if(ex-hitbox+10 < px && ex-10 > px){
            let ey = enemyBullets[i].y;
            let py = player.position.y;
            if(ey-82 < py && ey-50 > py){
                alert(`You have defeated ${count} fairies!`);
                location.reload();
                count = 0;
                enemyBullets.splice(i, 1);
            }
        }  
    }

    for(let i=0; i<enemies.length; i++){
        let ex = enemies[i].x;
        let px = player.position.x;
        if(ex-hitbox+10 < px && ex-10 > px){
            let ey = enemies[i].y;
            let py = player.position.y;
            if(ey-82 < py && ey-50 > py){
                alert(`You have defeated ${count} fairies!`);
                location.reload();
                count = 0;
                enemies.splice(i, 1);
            }
        }  
    }
}

/* Allows the user to pick up an item */
function pickUpItem(){
    let l_offset = (player_width/2) + 10
    for(let i=0; i<items.length; i++){
        let ix = items[i].x;
        let px = player.position.x;
        if (ix- l_offset < px && ix+l_offset > px) {
            let iy = items[i].y
            let py = player.position.y
            if (iy-80 < py && iy-20 > py) {
                player.power = items[i].value;
                items.splice(i, 1);
                displayItems();
            }
        }
    }
}

/* Pauses the game */
function pause(){
    paused = !paused;
    document.getElementById("pauseOverlay").style["left"] = `${borders.width - 250}px`;
    if (paused) {
        document.getElementById("pauseOverlay").classList.remove('hidden');
    } else {
        document.getElementById("pauseOverlay").classList.add('hidden');
    }
}

/* Make the background appear to be moving */
let start = 0;
function scrollBackground(){
    document.getElementById("field").style.backgroundPosition = `0px ${start}px`;
    start < 450 ? start+=1 : start=0;
}

/* Displays the hitbix in focus mode */
function showHitbox(){
    if(keyMap["focus"]){
        var ele = `<div class="hitbox" style="position:absolute;top:${player.position.y+50}px;left:${player.position.x+28}px;"></div>`
        document.getElementById("hitbox").innerHTML = ele;
    }else{
        document.getElementById("hitbox").innerHTML = '';
    }
}

/* Game Loop, runs all te game logic in a set interval */
function gameLoop(){
    if (!document.hasFocus() && !paused ){
        pause();
    }
    if (!paused) {
        frameTime();
        scrollBackground();
        movePlayer();
        pickUpItem();
        fire();
        moveBullets();
        spawnEnemies();
        moveEnemies();
        moveEnemyBullets();
        detectBulletCollisions();
        genLeaves();
        moveLeaves();
        difficulty();
    }
    highlightKeys();
    showHitbox();
}
setInterval(gameLoop, target_frame_time);

/* Increases difficulty after 20, 50, and 100 kills */
function difficulty(){
    if(count == 20){
        console.log("normal");
        let wave_size = 15;
        let delay_constant = 300;
    }else if(count == 50){
        console.log("hard");
        let wave_size = 18;
        let delay_constant = 200;
    }else if(count == 100){
        console.log("lunatic");
        let wave_size = 21;
        let delay_constant = 100;
    }
}

/* sound effects */
var hit = new Audio('sound/effects/84803__djahren__plastic-bang.mp3');

/* plays the BGM on a loop */
var bgm = new Audio('sound/bgm/[08]FallOfFall~AkimekuTaki.mp3');
bgm.play();
bgm.loop = true;
bgm.volume = 0.5;

/* allows pausing the bgm */
var is_playing = true;
var audioPause = document.getElementById("audio-pause");
audioPause.addEventListener("click", function(){
    if(is_playing){
        bgm.pause();
        audioPause.innerHTML = "▶";
    }else{
        bgm.play();
        audioPause.innerHTML = "⏸";
    }
    is_playing = !is_playing;
});

/* Adjusts the volume */
function volume(){
    let v = document.getElementById("volume").value;
    bgm.volume = v;
    document.getElementById("volume%").innerHTML = `${v*100}%`;
}
