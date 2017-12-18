/* Game constants to play around with */
const target_frame_time = 16;
const accel = 3;
const deccel = 6; 
const speed = 12;
const size = 25;
const bullet_speed = 24;
const cooldown_timer = 5;

/* Set the playfield to be the window size */
let borders = {
    'width': window.innerWidth,
    'height': window.innerHeight 
}

let player = {
    'position': {
        'x': borders.width/2,
        'y': borders.height/2
    },
    'power': 'single'
}

let keyMap = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'space': false
}

let paused = false;
let bullets = [];
let items = [];

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

/* Make some items to test them out */
function genItems(){
    items.push(
        new Item(0.25*borders.width, 0.75*borders.height, 'single'),
        new Item(0.5*borders.width, 0.75*borders.height, 'double'), 
        new Item(0.75*borders.width, 0.75*borders.height, 'spread')
    );
}
genItems();

/* Prevent accidental refresh */
window.onbeforeunload = function () {
    return false;
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
    }
    highlightKeys();
}
setInterval(gameLoop, target_frame_time);

/* Kind of displays performance information */
let frame = 0;
let prev_time = Date.now();
function frameTime(){
    let t = Date.now();
    let time_delta = t - prev_time;
    prev_time = t;
    let fps = `${1000/time_delta}`;
    if (fps.length > 2) {
        fps = fps.substring(0,4);
    }
    document.getElementById("frame").innerHTML = `frame: ${frame++}`;
    document.getElementById("time").innerHTML = `frame time: ${time_delta}`;
    document.getElementById("fps").innerHTML = `fps: ${fps}`;
}

/* Shows which keys are pressed */
function highlightKeys(){
    if (keyMap.a) {
        document.getElementById("a").classList.add('highlight');
    } else {
        document.getElementById("a").classList.remove('highlight');
    }
    if (keyMap.d) {
        document.getElementById("d").classList.add('highlight');
    } else {
        document.getElementById("d").classList.remove('highlight');
    }
    if (keyMap.w) {
        document.getElementById("w").classList.add('highlight');
    } else {
        document.getElementById("w").classList.remove('highlight');
    }
    if (keyMap.s) {
        document.getElementById("s").classList.add('highlight');
    } else {
        document.getElementById("s").classList.remove('highlight');
    }
    if (keyMap.space) {
        document.getElementById("space").classList.add('highlight');
    } else {
        document.getElementById("space").classList.remove('highlight');
    }
}

/* Detects pressing a key */
document.onkeydown = function(a){
    if (a.keyCode == 65) {
        keyMap.a = true;
    }
    if (a.keyCode == 68) {
        keyMap.d = true;
    } 
    if (a.keyCode == 87) {
        keyMap.w = true;
    }
    if (a.keyCode == 83) {
        keyMap.s = true;
    }
    if (a.keyCode == 32) {
        keyMap.space = true;
    }
    if (a.keyCode == 80) {
        pause();
    }
}

/* Detects key being lifted */
document.onkeyup = function(a){
    if (a.keyCode == 65) {
        keyMap.a = false;
    }
    if (a.keyCode == 68) {
        keyMap.d = false;
    } 
    if (a.keyCode == 87) {
        keyMap.w = false;
    }
    if (a.keyCode == 83) {
        keyMap.s = false;
    }
    if (a.keyCode == 32) {
        keyMap.space = false;
    }
}

/* Moves the player around */
let delta = {x:0, y:0};
// let prev_delta = delta;
function movePlayer(){

    if (keyMap.a) { delta.x -= accel; }
    if (keyMap.d) { delta.x += accel; }
    if (keyMap.w) { delta.y -= accel; }
    if (keyMap.s) { delta.y += accel; }

    /* if not moving left or right then slow down */
    if (!keyMap.a && !keyMap.d) {
        if (delta.x > 0) {
            delta.x -= deccel;
        } else if (delta.x < 0) {
            delta.x += deccel;
        }
    }

    /* if not moving up or down then slow down */
    if (!keyMap.w && !keyMap.s) {
        if (delta.y > 0) {
            delta.y -= deccel;
        } else if (delta.y < 0) {
            delta.y += deccel;
        }
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
        delta.x *= 0.71; // (2^-2)/2
        delta.y *= 0.71; // (2^-2)/2
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
            new Bullet(player.position.x + 10, player.position.y + 10, 2, -bullet_speed), 
            new Bullet(player.position.x + 10, player.position.y + 10, -2, -bullet_speed)
        );
    }
    if (keyMap.space) { 
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

/* Displays the items in items */
function displayItem(){
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
displayItem();

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
                displayItem();
            }
        }
    }
}

/* Show the debug section if the checkbox is checked */
function debug(){
    let active = document.getElementById("debug-select").checked;

    if (active) {
        document.getElementById("debug").classList.remove('hidden');
    } else {
        document.getElementById("debug").classList.add('hidden');
    }
}

/* Pauses the game */
function pause(){
    paused = !paused;
    document.getElementById("pause").style["left"] = `${borders.width - 250}px`;
    if (paused) {
        document.getElementById("pause").classList.remove('hidden');
    } else {
        document.getElementById("pause").classList.add('hidden');
    }
}