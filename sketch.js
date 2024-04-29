let scene = 0;
let pov_mode = 0;
let sounds = {
  bgm: undefined,
  walk: undefined
}
let textures = {
  grass: undefined,
  maze: undefined,
  sky: undefined,
  human: {
    face: undefined,
    head: undefined,
    body: undefined,
    arm: undefined,
    leg: undefined
  }
}
  
let human;

let rot = 0;

let X = -160;  
let Y = -600;  
let Z = 500;  
let centerX = 0;
let centerY = -100;
let centerZ = 0;
let h = 20;

let spotPos, spotDir, modelPos;
let mrot, srot;

let gameStart = false;
let isCleared = false;

document.onselectstart = function () {
  window.getSelection().removeAllRanges();
};

function preload() {
  sounds.bgm = loadSound('assets/bgm.mp3');
  sounds.walk = loadSound('assets/walk.mp3');
  textures.grass = loadImage('assets/grass_texture.png');
  textures.maze = loadImage('assets/leaves_texture.png');
  textures.sky = loadImage('assets/sky_texture.png');
  textures.human.face = loadImage('assets/face.png');
  textures.human.head = loadImage('assets/head.png');
  textures.human.body = loadImage('assets/body.png');
  textures.human.arm = loadImage('assets/arm.png');
  textures.human.leg = loadImage('assets/leg.png');
}

function setup() {
  const blinder = document.getElementById('blinder');
  const game_info = document.getElementById('game-info');
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(RGB, 255, 255, 255, 1);


  spotPos = new p5.Vector(-1000, 2000, 200);
  modelPos = new p5.Vector(-200, 1000, 0);
  mrot = 0;
  srot = 0;

  generateMaze();
  console.log(maze);

  human = new Human();
  sounds.bgm.play();
  blinder.style.opacity = '0';
  game_info.innerText = '';
  
}

function draw() {
  
  background(0);

  lights();
  pointLight(100, 100, 100, sin(srot) * 4000, -1300, cos(srot) * 100 - 100);


  srot += 0.01;
  spotPos.x = 200 * cos(srot);
  spotPos.y = 200 * sin(srot);
  spotDir = p5.Vector.sub(modelPos, spotPos);
  spotLight(0, 100, 100, spotPos, spotDir, radians(90), 1);


  camera(X, Y, Z, centerX, centerY, centerZ, 0, 1, 0);

  if (scene === 0) {
    dropTheHuman();
  } else if (scene === 1) {
    walk();
  } else if (scene === 2) {
    closeEntrance();

  }

  drawMaze();

  if (!sounds.bgm.isPlaying()) {
    getAudioContext().resume();
    sounds.bgm.play();
  }

  handleKeyDown();
  handlePov();
  handleHumanPos();
  
  


}

function handlePov() {
  if (pov_mode === 0) {
    
  }
}

function handleDisplay() {
  const pov_info = document.getElementById('pov-info');
  const human_pos = document.getElementById('human-pos');
  const cam_pos = document.getElementById('cam-pos');
  const {x, y, z} = human.pos;
  pov_info.innerText = pov_mode === 0 ? 'Default POV (CAM 0)' : 'Human POV (CAM 1)';
  human_pos.innerText = 'Human Pos: (' + parseInt(x) + ', ' + parseInt(y) + ', ' + parseInt(z) + ')';
  cam_pos.innerText = 'CAM POS: (' + parseInt(X) + ', ' + parseInt(Y) + ', ' + parseInt(Z) + ')'
    + ' (' + parseInt(centerX) + ', ' + parseInt(centerY) + ', ' + parseInt(centerZ) + ')';
}

function handleKeyDown() {
  if (!gameStart) return;

  if (keyIsDown(UP_ARROW)) {
    human.direction = 'forward';
  } else if (keyIsDown(DOWN_ARROW)) {
    human.direction = 'backward';
  }
  if (keyIsDown(LEFT_ARROW)) {
    human.direction = 'left'
  } else if (keyIsDown(RIGHT_ARROW)) {
    human.direction = 'right';
  }
}

function keyPressed() {
  if (gameStart && keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    human.walk = true;
    handleHumanPos(keyCode);
    if (!sounds.walk.isPlaying()) {
      sounds.walk.play();
    }
  }
  if (keyCode === 80) {
    saveImage();
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    human.rot = 0;
    human.walk = false;
  }
}

function mouseClicked() {
  if (pov_mode === 0) {
    pov_mode = 1;
    X = -160;
    Y = -1160;
    Z = 1250;
    centerX = 0;
    centerY = -100;
    centerZ = 0;
  } else {
    pov_mode = 0;
    X = -160;  
    Y = -600;  
    Z = 500;  
    centerX = 0;
    centerY = -100;
    centerZ = 0;
  }
}
function saveImage() {
  saveCanvas("image", "jpg");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
