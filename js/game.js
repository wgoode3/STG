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
    'power': 'single'
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
function Enemy(x, y, hp, type, path){
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.type = type;
    this.path = path;
}

/* Make some items to test them out */
function genItems(){
    items.push(
        new Item(0.25*borders.width, 0.75*borders.height, 'single'),
        new Item(0.5*borders.width, 0.75*borders.height, 'double'), 
        new Item(0.75*borders.width, 0.75*borders.height, 'spread')
    );
}
genItems();

/* Make an enemy to display */
function spawnEnemies(){
    enemies.push(new Enemy(0.5*borders.width, 0.15*borders.height, 10, "", 'rtl'));
}
spawnEnemies();

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

    document.getElementById("player").style["top"] = `${player.position.y}px`;
    document.getElementById("player").style["left"] = `${player.position.x}px`;

}

/* Fires one of multiple types of shot */
let cooldown = 0;
function fire(){
    /* Starting power */
    function single(){
        bullets.push(
            new Bullet(player.position.x + 10, player.position.y + 10, 0, -bullet_speed)
        );
    }
    /* Shoots two bullets */
    function double(){
        bullets.push(
            new Bullet(player.position.x + 5, player.position.y + 10, 0, -bullet_speed), 
            new Bullet(player.position.x + 15, player.position.y + 10, 0, -bullet_speed)
        );
    }
    /* Shoots in a spread pattern */
    function spread(){
        bullets.push(
            new Bullet(player.position.x + 10, player.position.y + 10, 0, -bullet_speed), 
            new Bullet(player.position.x + 10, player.position.y + 10, 1, -bullet_speed), 
            new Bullet(player.position.x + 10, player.position.y + 10, -1, -bullet_speed)
        );
    }
    if (keyMap.shoot) { 
        if (cooldown <= 0){
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

/* check if the player will go out of bounds */
function checkBounds(dimension, bound, delta){
    bound -= size;
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

function detectBulletCollisions(){
    for(let i=0; i<enemies.length; i++){
        for(let j=0; j<bullets.length; j++){
            let ex = enemies[i].x;
            let bx = bullets[j].x;
            if (ex-10 < bx && ex+30 > bx) {
                let ey = enemies[i].y
                let by = bullets[j].y
                if (ey-30 < by && ey+30 > by) {
                    console.log("hit!");
                    bullets.splice(j, 1);
                }
            } 
        }
    }
}

/* Allows the user to pick up an item */
function pickUpItem(){
    for(let i=0; i<items.length; i++){
        let ix = items[i].x;
        let px = player.position.x;
        if (ix-10 < px && ix+30 > px) {
            let iy = items[i].y
            let py = player.position.y
            if (iy-20 < py && iy+20 > py) {
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

/* Game Loop, runs all te game logic in a set interval */
function gameLoop(){
    if (!document.hasFocus() && !paused ){
        pause();
    }
    if (!paused) {
        frameTime();
        movePlayer();
        pickUpItem();
        fire();
        moveBullets();
        displayEnemies();
        detectBulletCollisions();
    }
    highlightKeys();
}
setInterval(gameLoop, target_frame_time);