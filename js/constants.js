/* Game constants to play around with */
const target_frame_time = 16,
      accel             = 4,
      deccel            = 8, 
      size              = 25,
      bullet_speed      = 16,
      cooldown_timer    = 8,
      bullets           = [],
      items             = [],
      enemies           = [],
      enemyBullets      = [],
      leaves            = [];

/* Player offset */
const player_height = 150,
      player_width  = 110;

/* Key Bindings */
const upKey    = 38, // up arrow
      downKey  = 40, // down arrow
      leftKey  = 37, // left arrow
      rightKey = 39, // right arrow
      shootKey = 90, // z
      bombKey  = 88, // x
      pauseKey = 80, // p
      focusKey = 16; // shift key

/* Set how often the debug stats update */
const rate = 5;

/* Set the playfield to be the window size */
const borders = {
    'width': window.innerWidth,
    'height': window.innerHeight 
}

/* Player position and current power */
const player = {
    'position': {
        'x': borders.width/2,
        'y': borders.height/2
    },
    'power': 'spread'
}

/* Speed can change based on focus mode */
let speed = 16;

/* Fairies defeated */
let count = 0;

/* tells if the game is paused */
let paused = false;