function randomBalloon(){
  const balloonColors = [{type:'red',color:`rgba(255,0,0,1)`},{type:'green',color:`rgba(0,255,0,1)`},{type:'blue',color:`rgba(0,0,255,1)`},{type:'yellow',color:`rgba(255,255,0,1)`}];
  return balloonColors[Math.floor(Math.random()*4)];
}

function Balloon() {
  this.generateBalloon = randomBalloon()
  this.color = this.generateBalloon.color;
  this.type = this.generateBalloon.type;
  this.radius = 35;
  this.x = this.radius * Math.floor(Math.random()*3)+this.radius;
  this.y = this.radius * Math.floor(Math.random()*5)+this.radius;
  this.dy = Math.random() * 2;
  this.dx = Math.round((Math.random() - 0.5) * 10);
  this.vel = Math.random() / 20;
  this.update = function() {
    let gradient = ctx.createLinearGradient(this.x-this.radius,this.y+this.radius,this.x+this.radius,this.y-this.radius)
    gradient.addColorStop(0,this.color);
    gradient.addColorStop(0.6,this.color);
    gradient.addColorStop(0.8,'white');
    gradient.addColorStop(.9,this.color);
    gradient.addColorStop(1,this.color);
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2* Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke()
    ctx.beginPath();
    ctx.moveTo(this.x,this.y+35);
    ctx.bezierCurveTo(
      this.x,this.y+70, // first control point
      this.x+40,this.y+50, // second control point
      this.x+35,this.y+70 // finish coords
      );
    ctx.stroke();
  }
}

const difficultyCal = {
  easy: 8,
  hard: 15,
  pro: 25,
  god: 30
}

function loadBalloons(){
  gameActive = true;
  for(let i=0; i<difficultyCal[difficulty];i++) {
    balloons.push(new Balloon());
  }
}

function moveBalloons() {
  if (tx!== gameWindowCont.offsetWidth || ty !== gameWindowCont.offsetHeight) {
    tx = gameWindowCont.offsetWidth;
    ty = gameWindowCont.offsetHeight;
    canvas.width = tx;
    canvas.height = ty;
  }
  animationFrame = requestAnimationFrame(moveBalloons);
  ctx.clearRect(0,0,tx,ty);
  for (let i = 0; i < balloons.length; i++) {
    if(!balloons.length) return;
    balloons[i].update();
    balloons[i].y += balloons[i].dy;
    balloons[i].x += balloons[i].dx;
    const speedUpChance = () => Math.random() < .6;
    if (speedUpChance()) {
      balloons[i].dy += balloons[i].vel
    } else {
      balloons[i].dy -= balloons[i].vel;
    }
    if (balloons[i].x + balloons[i].radius > tx || balloons[i].x - balloons[i].radius < 0) {
      balloons[i].dx = -balloons[i].dx
    }
    if (balloons[i].y + balloons[i].radius > ty || balloons[i].y - balloons[i].radius < 0) {
      balloons[i].dy = -balloons[i].dy
    }
  }
}


// moveBalloons();
// balloons.forEach(balloon => balloon.update())