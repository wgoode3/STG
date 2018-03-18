/* Prevent accidental refresh */
window.onbeforeunload = function () {
    return false;
}

/* Set the playfield to be the window size */
const borders = {
    'width': window.innerWidth,
    'height': window.innerHeight 
}

/* Enemy Move Patterns */
const paths = {
    'rtl': {
        'spawn': {
            x: borders.width + 50,
            y: 100
        },
        'velocity': {
            vx:-5,
            vy:-1
        }
    }
}

const player = {
    'position': {
        'x': borders.width/2,
        'y': borders.height/2
    },
    'power': 'spread'
}

let paused = false;

/* Item class - items have position and a value */
function Item(x, y, value){
    this.x = x;
    this.y = y;
    this.value = value;
}

/* Bullet class - bullets have position and speed */
function Bullet(x, y, vx, vy){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
}

/* Enemy class - has position and health */
function Enemy(x, y, v, hp, type, path, spot){
    this.x = x;
    this.y = y;
    this.v = v;
    this.hp = hp;
    this.type = type;
    this.path = path;
    this.spot = spot;
}

/* Should move the enemies about*/
function moveEnemies(){
    let output = '';
    for(let i=0; i<enemies.length; i++){
        if(enemies[i].path == "l-r"){
            // left to right
            enemies[i].x += enemies[i].v
            output += `<div class="enemy" style="position:absolute;top:${enemies[i].y}px;left:${enemies[i].x}px;"></div>`;
            if(enemies[i].hp <= 0){
                hit.play();
                enemies.splice(i, 1);
                count++;
            }else if(enemies[i].x > borders.width){
                enemies.splice(i, 1);
            }else if(enemies[i].x > enemies[i].spot){
                enemies[i].shoot();
                enemies[i].spot += 150;
            }
        }else if(enemies[i].path == "r-l"){
            // right to left
            enemies[i].x += enemies[i].v
            output += `<div class="enemy" style="position:absolute;top:${enemies[i].y}px;left:${enemies[i].x}px;"></div>`;
            if(enemies[i].hp <= 0){
                hit.play();
                enemies.splice(i, 1);
                count++
            }else if(enemies[i].x < 0){
                enemies.splice(i, 1);
            }else if(enemies[i].x < enemies[i].spot){
                enemies[i].shoot();
                enemies[i].spot -= 150;
            }
        }else if(enemies[i].path == "tl-rb"){
            // top left to right bottom
        }else if(enemies[i].path == "tr-lb"){
            // top right to left bottom
        }else if(enemies[i].path == "t-p"){
            // top to player
        }
    }
    document.getElementById("enemies").innerHTML = output;
}

/* Make the enemies shoot at the player */
Enemy.prototype.shoot = function(){
    // multiple enemy shot types because sounds like fun

    if(Math.random() > 0.5){
        // direct shot
        let bulletSpeed = 6;
        let px = player.position.x;
        let py = player.position.y;
        let Dx = px-this.x;
        let Dy = py-this.y;
        let distance = Math.pow((Math.pow(Dx, 2) + Math.pow(Dy, 2)), 0.5)
        let vx = (Dx/distance)*bulletSpeed;
        let vy = (Dy/distance)*bulletSpeed;
        enemyBullets.push(new Bullet(this.x, this.y, vx, vy))
    }else{
        // curtain shot
        enemyBullets.push(new Bullet(this.x, this.y, 0, 3));
        enemyBullets.push(new Bullet(this.x, this.y, 2, 1));
        enemyBullets.push(new Bullet(this.x, this.y, -2, 1)); 
        enemyBullets.push(new Bullet(this.x, this.y, 1, -2));   
        enemyBullets.push(new Bullet(this.x, this.y, -1, -2));   
    }
}

function moveEnemyBullets(){
    let output = '';
    for(let i=0; i<enemyBullets.length; i++){
        if(enemyBullets[i].y < 0 || enemyBullets[i].y > borders.height){
            enemyBullets.splice(i, 1);
        } else if (enemyBullets[i].x < 0 || enemyBullets[i].x + 10 > borders.width) {
            enemyBullets.splice(i, 1);
        } else {
            output += `<div class="enemy-bullet" style="position:absolute;top:${enemyBullets[i].y+=enemyBullets[i].vy}px;left:${enemyBullets[i].x+=enemyBullets[i].vx}px;"></div>`;
        }
    }
    document.getElementById("enemy-bullets").innerHTML = output;
}

const waves = [
    {
        "size": 10,
        "type": "fairy",
        "path": "l-r",
        "hp": 3,
        "v": 4,
        "x": -50,
        "y": 150,
        "offset": 200,
        "spot": 150
    },
    {
        "size": 10,
        "type": "fairy",
        "path": "r-l",
        "hp": 3,
        "v": -4,
        "x": 50,
        "y": 150,
        "offset": 200,
        "spot": borders.width - 150
    },
];

let delay = 100;
function spawnEnemies(){
    while(enemies.length < 1 && delay-- <= 0){
        let wave = waves[Math.floor(Math.random()*waves.length)];
        // let wave = waves[1];
        for(var i=0; i<wave["size"]; i++){
            if(wave["path"] == "l-r"){
                enemies.push(new Enemy(
                    wave["x"] - i*wave["offset"], 
                    wave["y"],
                    wave["v"],
                    wave["hp"],
                    wave["type"],
                    wave["path"],
                    wave["spot"]
                ));
            }else if(wave["path"] == "r-l"){
                enemies.push(new Enemy(
                    wave["x"] + i*wave["offset"] + borders.width, 
                    wave["y"],
                    wave["v"],
                    wave["hp"],
                    wave["type"],
                    wave["path"],
                    wave["spot"]
                ));
            }
        }
        delay = 100;
    }
}

function Leaf(x,y, state){
    this.x = x;
    this.y = y;
    this.state = state;
    this.vy = 1;
}

/* Make some items to test them out */
function genItems(){
    items.push(
        new Item(0.25*borders.width, 0.75*borders.height, 'single'),
        new Item(0.5*borders.width, 0.75*borders.height, 'double'), 
        new Item(0.75*borders.width, 0.75*borders.height, 'spread')
    );
}
// genItems();

function randX(){
    return Math.floor(Math.random()*(borders.width-50))+25;
}

function randY(){
    return Math.floor(Math.random()*(borders.height-50))+25;
}

function randInt(num){
    return Math.floor(Math.random()*(num))+1;
}

/* Make some leaves! */
function genLeaves(){
    while(leaves.length < 30){
        leaves.push(
            // turn over a new leaf, heh
            new Leaf(randX(), randY(), randInt(80))
        );
    }
}

/* Make an enemy to display */
// function spawnEnemies(){
//     enemies.push(new Enemy(0.5*borders.width, 0.15*borders.height, 10, "", 'rtl'));
// }
// spawnEnemies();

/* Moves the player around */
let delta = {x:0, y:0};
// let prev_delta = delta;
function movePlayer(){

    keyMap.focus ? speed = 4: speed = 8;

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

    /* if not moving left or right then slow down */
    if (!keyMap.left && !keyMap.right) {
        if (delta.x > 0) {
            delta.x -= deccel;
        } else if (delta.x < 0) {
            delta.x += deccel;
        }
    }

    /* if not moving up or down then slow down */
    if (!keyMap.up && !keyMap.down) {
        if (delta.y > 0) {
            delta.y -= deccel;
        } else if (delta.y < 0) {
            delta.y += deccel;
        }
    }

    /* only `accel` up to `speed` */
    if (Math.abs(delta.x) > speed) {
        delta.x > speed ? delta.x = speed: delta.x = -speed;
    }
    if (Math.abs(delta.y) > speed) {
        delta.y > speed ? delta.y = speed: delta.y = -speed;
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

    document.getElementById("player").style["top"] = `${Math.round(player.position.y)}px`;
    document.getElementById("player").style["left"] = `${Math.round(player.position.x)}px`;

}

/* Fires one of multiple types of shot */
let cooldown = 0;
function fire(){
    
    const l_offset = (player_width/2) + 10
    const h_offset = 20

    /* Starting power */
    function single(){
        bullets.push(
            new Bullet(player.position.x + l_offset, player.position.y + h_offset, 0, -bullet_speed)
        );
    }
    /* Shoots two bullets */
    function double(){
        bullets.push(
            new Bullet(player.position.x + l_offset-15, player.position.y + h_offset, 0, -bullet_speed), 
            new Bullet(player.position.x + l_offset+15, player.position.y + h_offset, 0, -bullet_speed)
        );
    }
    /* Shoots in a spread pattern */
    function spread(){
        bullets.push(
            new Bullet(player.position.x + l_offset, player.position.y + h_offset, 0, -bullet_speed), 
            new Bullet(player.position.x + l_offset-15, player.position.y + h_offset, -2, -bullet_speed), 
            new Bullet(player.position.x + l_offset+15, player.position.y + h_offset, 2, -bullet_speed)
        );
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
            output += `<div class="bullet" style="position:absolute;top:${bullets[i].y+=bullets[i].vy}px;left:${bullets[i].x+=bullets[i].vx}px;"></div>`;
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

/* Display the enemies */
function displayEnemies(){
    let output = ''
    for(let i=0; i<enemies.length; i++){
        output += `<div class="enemy" style="position:absolute;top:${enemies[i].y}px;left:${enemies[i].x}px;"></div>`
    }
    document.getElementById("enemies").innerHTML = output;
}

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
    let hitbox = 40; 

    for(let i=0; i<enemyBullets.length; i++){
        let ex = enemyBullets[i].x;
        let px = player.position.x;
        if(ex-hitbox-10 < px && ex-10 > px){
            let ey = enemyBullets[i].y;
            let py = player.position.y;
            if(ey-90 < py && ey-50 > py){
                console.log("You should try easy mode.");
                alert(`You have defeated ${count} fairies!`);
                location.reload();
                count = 0;
                enemyBullets.splice(i, 1);
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
    document.querySelector("body").style.backgroundPosition = `0px ${start}px`;
    start < 450 ? start+=2 : start=0;
}

function showHitbox(){
    if(keyMap["focus"]){
        var ele = `<div class="hitbox" style="position:absolute;top:${player.position.y+50}px;left:${player.position.x+20}px;"></div>`
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
    }
    highlightKeys();
    showHitbox();
}
setInterval(gameLoop, target_frame_time);

/* plays the BGM on a loop */
var audio = new Audio('sound/bgm/[08]FallofFall~AkimekuTaki.mp3');
audio.play();

var hit = new Audio('sound/effects/160760__cosmicembers__object-hit.mp3');
var shot = new Audio('sound/effects/263595__porkmuncher__swoosh.mp3');

var is_playing = true;
var audioPause = document.getElementById("audio-pause");
audioPause.addEventListener("click", function(){
    if(is_playing){
        audio.pause();
        audioPause.innerHTML = "▶";
    }else{
        audio.play();
        audioPause.innerHTML = "⏸";
    }
    is_playing = !is_playing;
});