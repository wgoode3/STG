let frame = 0;
let prev_time = Date.now();
let avg_fps = 0;
let avg_ftime = 0;

/* Kind of displays performance information */
function frameTime(){
    let t = Date.now();
    let time_delta = t - prev_time;
    prev_time = t;
    let fps = 1000/time_delta;
    frame++;
    avg_fps += fps;
    avg_ftime += time_delta;
    if (frame % rate == 0){
        avg_fps = `${avg_fps/rate}`;
        if (avg_fps.length > 2) {
            avg_fps = avg_fps.substring(0,4);
        }
        avg_ftime = `${avg_ftime/rate}`;
        if (avg_ftime.length > 2) {
            avg_ftime = avg_ftime.substring(0,4);
        }
        document.getElementById("frame").innerHTML = `frame: ${frame}`;
        document.getElementById("time").innerHTML = `frame time: ${avg_ftime}`;
        document.getElementById("fps").innerHTML = `fps: ${avg_fps}`;
        avg_fps = 0;
        avg_ftime = 0;
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
};
debug();