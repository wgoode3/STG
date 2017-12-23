/* Game constants to play around with */
const target_frame_time = 16,
      accel             = 2,
      deccel            = 4, 
      size              = 25,
      bullet_speed      = 16,
      cooldown_timer    = 5,
      bullets           = [],
      items             = [],
      enemies           = [];

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

/* Speed can change based on focus mode */
let speed = 8;