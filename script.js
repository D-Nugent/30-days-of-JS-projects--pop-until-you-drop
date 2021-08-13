// Element Selectors Start

const canvas = document.querySelector('.game-window');
const gameWindowCont = document.querySelector('.event-space__game-window')
const ctx = canvas.getContext('2d');
const difficultyControls = document.querySelectorAll('.setup__adjust-diff');
const difficultyDisplay = document.querySelector('.setup__current-diff')
const startGameBtn = document.querySelector('.setup__start');
const timer = document.querySelector('.timer-wrapper__timer');
const gameStatus = document.querySelector('.game-status');
const resetBtn = document.querySelector('.game-status__reset');
const audioPop = document.querySelector('audio');

// Element Selectors End

// Event Listeners Start

canvas.addEventListener('click',balloonPop);
difficultyControls.forEach(btn => btn.addEventListener('click',adjustDifficulty))
startGameBtn.addEventListener('click',startGame)
resetBtn.addEventListener('click',resetGame)

// Event Listeners End

// Default Config Script Start

let tx = gameWindowCont.offsetWidth
let ty = gameWindowCont.offsetHeight
canvas.width = tx;
canvas.height = ty;

// Default Config Script End

// Control Variables Start

let difficultyOptions = ['easy','hard','pro','god']
let difficulty = 'easy';
let balloons = [];
let mouseX = 0;
let mouseY = 0;
let gameActive = false;
let animationFrame;
let targetTime;
let timeDifference;

// Control Variables End

function adjustDifficulty(){
  let diffDirection = this.getAttribute('data-type');
  let currentDifIndex = difficultyOptions.findIndex(diff => diff == difficulty);
  if (diffDirection == 'increase' && currentDifIndex == difficultyOptions.length-1) return;
  if (diffDirection == 'decrease' && currentDifIndex == 0) return;
  diffDirection == 'increase'? difficulty = difficultyOptions[currentDifIndex+1]:difficulty = difficultyOptions[currentDifIndex-1];
  difficultyDisplay.innerText = difficulty;
}

function startGame(){
  cancelAnimationFrame(animationFrame)
  if(gameActive) {
    balloons.length = 0;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  loadBalloons();
  moveBalloons();
  startTimer();
  audioPop.muted = true;
  audioPop.currentTime = 0;
  audioPop.play()
  audioPop.muted = false;
}

function balloonPop(e){
  if(!gameActive) return;
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  let balloonIndex = balloons.findIndex(balloon => {
    let xStartRange = balloon.x - (balloon.radius);
    let xEndRange = balloon.x + (balloon.radius);
    let yStartRange = balloon.y - (balloon.radius);
    let yEndRange = balloon.y + (balloon.radius);
    if ((mouseX>xStartRange && mouseX<xEndRange) && (mouseY>yStartRange && mouseY<yEndRange)) {
      return true;
    }
  })
  const shotType = {
    red:({shiftKey,altKey,ctrlKey}) => {
      if(!shiftKey && !altKey && !ctrlKey){
        balloons.splice(balloonIndex,1);
        audioPop.currentTime = 0;
        audioPop.play()
      } else {
        subtractTime()
      }
    },
    green:({shiftKey}) => {
      if(shiftKey) {
        balloons.splice(balloonIndex,1);
        audioPop.currentTime = 0;
        audioPop.play()
      } else {
        subtractTime()
      }
    },
    blue:({altKey}) =>{
      if(altKey) {
        balloons.splice(balloonIndex,1);
        audioPop.currentTime = 0;
        audioPop.play()
      } else {
        subtractTime()
      }
    },
    yellow:({ctrlKey}) =>{
      if(ctrlKey){
        balloons.splice(balloonIndex,1);
        audioPop.currentTime = 0;
        audioPop.play()
      } else {
        subtractTime()
      }
    }
  }
  if (balloonIndex >= 0) {
    console.log(`The balloon removed is`,balloons[balloonIndex]);
    shotType[balloons[balloonIndex].type](e);
  }
  if (!balloons.length) {
    clearInterval(timeDifference)
    stopTimer()
  };
}

function subtractTime(){
  targetTime = new Date(targetTime.getTime() - 5000);
  timer.classList.add('--error');
  timer.addEventListener('transitionend',()=>timer.classList.remove('--error'))
  console.log(targetTime);
}


function startTimer(){
  timer.value = `01:00`
  let currentTime = new Date();
  targetTime = new Date(currentTime.getTime() + 1*60000);
  timeDifference = setInterval(() => {
    let timerState = Math.ceil((targetTime.getTime()-new Date().getTime())/1000)
    timer.value = `00:${timerState<10?`0${timerState}`:timerState}`;
    if(timerState <= 0) stopTimer();
  }, 1000);
}

function stopTimer(){
  clearInterval(timeDifference);
  gameActive = false;
  let msg = gameStatus.querySelector('h4');
  gameStatus.classList.add('--active');
  balloons.length == 0? msg.innerText = 'Congratulations!':msg.innerText = 'Times up! Better luck next time';
}

function resetGame(){
  clearInterval(timeDifference);
  gameActive = false;
  balloons.length = 0;
  gameStatus.classList.remove('--active');
  timer.value = `01:00`;
}