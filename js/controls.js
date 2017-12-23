/* Keep track of which keys are pressed  */
const keyMap = {
    'up':    false,
    'left':  false,
    'down':  false,
    'right': false,
    'shoot': false,
    'focus': false
}

/* Detect pressing a key */
document.onkeydown = function(a){
    if (a.keyCode == leftKey) {
        keyMap.left = true;
    }
    if (a.keyCode == rightKey) {
        keyMap.right = true;
    } 
    if (a.keyCode == upKey) {
        keyMap.up = true;
    }
    if (a.keyCode == downKey) {
        keyMap.down = true;
    }
    if (a.keyCode == shootKey) {
        keyMap.shoot = true;
    }
    if (a.keyCode == bombKey) {
        keyMap.bomb = true;
    }
    if (a.keyCode == pauseKey) {
        keyMap.pause = true;
        pause();
    }
    if (a.keyCode == focusKey) {
        keyMap.focus = true;
    }
}

/* Detect key being lifted */
document.onkeyup = function(a){
    if (a.keyCode == leftKey) {
        keyMap.left = false;
    }
    if (a.keyCode == rightKey) {
        keyMap.right = false;
    } 
    if (a.keyCode == upKey) {
        keyMap.up = false;
    }
    if (a.keyCode == downKey) {
        keyMap.down = false;
    }
    if (a.keyCode == shootKey) {
        keyMap.shoot = false;
    }
    if (a.keyCode == bombKey) {
        keyMap.bomb = false;
    }
    if (a.keyCode == pauseKey) {
        keyMap.pause = false;
    }
    if (a.keyCode == focusKey) {
        keyMap.focus = false;
    }
}

/* Show which keys are pressed */
function highlightKeys(){
    if (keyMap.left) {
        document.getElementById("left").classList.add('highlight');
    } else {
        document.getElementById("left").classList.remove('highlight');
    }
    if (keyMap.right) {
        document.getElementById("right").classList.add('highlight');
    } else {
        document.getElementById("right").classList.remove('highlight');
    }
    if (keyMap.up) {
        document.getElementById("up").classList.add('highlight');
    } else {
        document.getElementById("up").classList.remove('highlight');
    }
    if (keyMap.down) {
        document.getElementById("down").classList.add('highlight');
    } else {
        document.getElementById("down").classList.remove('highlight');
    }
    if (keyMap.shoot) {
        document.getElementById("shoot").classList.add('highlight');
    } else {
        document.getElementById("shoot").classList.remove('highlight');
    }
    if (keyMap.bomb) {
        document.getElementById("bomb").classList.add('highlight');
    } else {
        document.getElementById("bomb").classList.remove('highlight');
    }
    if (keyMap.pause) {
        document.getElementById("pause").classList.add('highlight');
    } else {
        document.getElementById("pause").classList.remove('highlight');
    }
    if (keyMap.focus) {
        document.getElementById("focus").classList.add('highlight');
    } else {
        document.getElementById("focus").classList.remove('highlight');
    }
}