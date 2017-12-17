/* Game constants to play around with */
const target_frame_time = 16;
const accel = 3;
const deccel = 6; 
const speed = 12;
const size = 25;
const bullet_speed = 20;
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
    }
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

/* Game Loop, runs all te game logic in a set interval */
setInterval(gameLoop, target_frame_time);
function gameLoop(){
    if(!paused){
        frameTime();
        movePlayer();
        fire();
        moveBullets();
    }
    highlightKeys();
}

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

var delta = {x:0, y:0};
function movePlayer(){

    if (keyMap.a) { delta.x -= accel; }
    if (keyMap.d) { delta.x += accel; }
    if (keyMap.w) { delta.y -= accel; }
    if (keyMap.s) { delta.y += accel; }

    // if not moving left or right then slow down
    if (!keyMap.a && !keyMap.d) {
        if (delta.x > 0) {
            delta.x -= deccel;
        } else if (delta.x < 0) {
            delta.x += deccel;
        }
    }

    // if not moving up or down then slow down
    if (!keyMap.w && !keyMap.s) {
        if (delta.y > 0) {
            delta.y -= deccel;
        } else if (delta.y < 0) {
            delta.y += deccel;
        }
    }

    // only `accel` up to `speed`
    if (Math.abs(delta.x) > speed) {
        delta.x > 0 ? delta.x = speed: delta.x = -speed;
    }
    if (Math.abs(delta.y) > speed) {
        delta.y > 0 ? delta.y = speed: delta.y = -speed;
    }

    prev_delta = delta;

    // we can check position here for collisions
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

let cooldown = 0;
function fire(){
    if (keyMap.space) { 
        if (cooldown <= 0){
            bullets.push({x: player.position.x + 10, y: player.position.y + 10});
            cooldown = cooldown_timer;
        }
        cooldown--;
    }
}

function moveBullets(){
    let output = '';
    for(let i=0; i<bullets.length; i++){
        if(bullets[i].y < 0 || bullets[i].y > borders.height){
            bullets.splice(i, 1);
        } else {
            bullets[i].y -= bullet_speed;
            output += `<div class="bullet" style="position:absolute;top:${bullets[i].y}px;left:${bullets[i].x}px;"></div>`;
        }
    }
    document.getElementById("bullets").innerHTML = output;
}

function checkBounds(dimension, bound, delta){
    bound -= size;
    let pos = player.position[dimension] + delta;
    return pos < bound && pos > 0;
}

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
    if (a.keyCode == 80){
        pause();
    }
}

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

function debug(){
    let active = document.getElementById("debug-select").checked;

    if (active) {
        document.getElementById("debug").classList.remove('hidden');
    } else {
        document.getElementById("debug").classList.add('hidden');
    }
}

function pause(){
    paused = !paused;
    document.getElementById("pause").style["left"] = `${borders.width - 350}px`;
    if (paused) {
        document.getElementById("pause").classList.remove('hidden');
    } else {
        document.getElementById("pause").classList.add('hidden');
    }
}