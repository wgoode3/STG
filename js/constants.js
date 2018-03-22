/* Game constants to play around with */
const target_frame_time = 16,
      accel             = 3,
      deccel            = 6, 
      size              = 25,
      bullet_speed      = 12,
      angular_velocity  = 15,
      cooldown_timer    = 8,
      bullets           = [],
      items             = [],
      enemies           = [],
      enemyBullets      = [],
      leaves            = [];

/* Player offset */
const player_height = 130,
      player_width  = 72;

/* Key Bindings */
const upKey    = 38, // up arrow
      downKey  = 40, // down arrow
      leftKey  = 37, // left arrow
      rightKey = 39, // right arrow
      shootKey = 90, // z
      bombKey  = 88, // x
      pauseKey = 27, // p 80 esc 27
      focusKey = 16; // shift key

/* Set how often the debug stats update */
const rate = 5;

/* Set the playfield to be the window size */
// const borders = {
//     'width': window.innerWidth,
//     'height': window.innerHeight 
// }
/* Set the playfield to be size of the div with id="field" */
const borders = {
    'width': document.getElementById("field").clientWidth,
    'height': document.getElementById("field").clientHeight 
}

/* number of leaves based on screen size */
const numLeaves = borders.width * borders.height / 25000 >> 0;

/* Player position and current power */
const player = {
    'position': {
        'x': borders.width/2,
        'y': borders.height*0.7
    },
    'power': 'spread',
    'state': 0,
    'lives': 3
}

/* Max player speed */
let top_speed = 6;

/* Speed can change based on focus mode */
let speed = 6;

/* Fairies defeated */
let count = 0;

/* Delay between waves */
let delay_constant = 400;

/* Wave size */
let wave_size = 12;

/* tells if the game is paused */
let paused = false;

/* confirmed */
let confirmed = false;