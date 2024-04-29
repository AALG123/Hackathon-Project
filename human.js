let humanDropped = false;
class Human {
constructor() {
this.walk = false;
this.rot = 0;
this.direction = 'backward';
this.pos = {
x: 0,
y: 0,
z: 0
}
}
drawHead() {
push();
texture(textures.human.head);
plane(1, 1);
translate(0.5, 0, 0.5);
rotateX(-HALF_PI);
rotateY(HALF_PI);
texture(textures.human.face);
plane(1, 1);
translate(0.5, 0, -0.5);
rotateY(HALF_PI);
texture(textures.human.head);
plane(1, 1);
translate(0.5, 0, -0.5);
rotateY(HALF_PI);
texture(textures.human.head);
plane(1, 1);
translate(0.5, 0, -0.5);
rotateY(HALF_PI);
texture(textures.human.head);
plane(1, 1);
translate(0, -0.5, -0.5);
rotateX(HALF_PI);
texture(textures.human.head);
plane(1, 1);
pop();
push();
translate(0, 0, 5);
fill(0, 0, 255);
box(1, 1, 1);
pop();
}
drawBody() {
push();
translate(0, 0, -0.7);
rotateX(PI);
texture(textures.human.body);
box(0.5, 1, 1.5);
pop();
}
drawArms() {
push();
translate(0, 0.7, -0.8);
rotateX(PI);
texture(textures.human.arm);
push();
if (this.walk) {
translate(0, 0, -0.7);
rotateY(sin(rot + PI));
translate(0, 0, 0.7);
}
box(0.5, 0.5, 1.5);
pop();
push();
translate(0, 1.4, 0);
if (this.walk) {
translate(0, 0, -0.7);
rotateY(sin(rot));
translate(0, 0, 0.7);
}
box(0.5, 0.5, 1.5);
pop();
pop();
}
drawLegs() {
push();
translate(0, 0.2, -2.2);
rotateX(PI);
texture(textures.human.leg);
push();
if (this.walk) {
translate(0, 0, -0.7);
rotateY(sin(rot));
translate(0, 0, 0.7);
rot += 0.1;
}
box(0.4, 0.5, 1.5);
pop();
push();
translate(0, 0.5, 0);
if (this.walk) {
translate(0, 0, -0.7);
rotateY(sin(rot + PI));
translate(0, 0, 0.7);
rot += 0.1;
}
box(0.4, 0.5, 1.5);
pop();
pop();
}
display() {
push();
scale(0.5);
noStroke();
translate(this.pos.x, this.pos.y, this.pos.z+1);
if (this.direction === 'forward') {
rotateZ(PI);
} else if (this.direction === 'backward') {
} else if (this.direction === 'left') {
rotateZ(HALF_PI);
} else if (this.direction === 'right') {
rotateZ(-HALF_PI);
}
this.drawHead();
this.drawBody();
this.drawArms();
this.drawLegs();
pop();
}
}
function dropTheHuman() {
if (!humanDropped) {

human.pos.x = 24;
human.pos.z = 28;
human.walk = true;
human.direction = 'forward';
humanDropped = true;
}
if (human.pos.z > 2) {
human.pos.z -= 0.2;
} else {
scene = 1;
}
}
function walk() {
if (human.pos.y < 24) {
human.direction = 'left';
human.pos.y += 0.2;
} else {
if (human.pos.x > 18) {
human.direction = 'forward';
human.pos.x -= 0.2;
} else {
human.walk = false;
scene = 2;
}
}
}function handleHumanPos() {
  if (!gameStart) return;
  const {pos} = human;
  const speed = 0.7; 

  if (keyIsDown(DOWN_ARROW)) {
    human.direction = 'backward';
    pos.x += speed;
  } else if (keyIsDown(UP_ARROW)) {
    human.direction = 'forward';
    pos.x -= speed;
  } else if (keyIsDown(RIGHT_ARROW)) {
    human.direction = 'right';
    pos.y -= speed;
  } else if (keyIsDown(LEFT_ARROW)) {
    human.direction = 'left';
    pos.y += speed;
  }

  
  const boundary = 40; 
  pos.x = constrain(pos.x, -boundary, boundary);
  pos.y = constrain(pos.y, -boundary, boundary);
}