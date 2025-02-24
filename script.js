let rnd = (l,u) => Math.random() * (u-l) + l;
let scene, camera, ball, sball, enemies = [], time_text, score_text, health_text, winScreen, loseScreen;
let health = 100;
let kill = 0;
var t = 60;
var cooldown = false;
var viscooldown = false;
let isLeftGloveActive = false;
let isRightGloveActive = false;
let isBlocking = false;
let gameStarted = false;


window.onload = function(){
  scene = document.querySelector("a-scene");
  camera = document.querySelector("a-camera");
  leftGloveEl = document.getElementById("leftGlove");
  rightGloveEl = document.getElementById("rightGlove");

  let healthUI = document.querySelector("#health-ui");
  camera.appendChild(healthUI);  // attach bar to camera

  ball = new Ball();
  sball = new SBall();

  time_text = document.querySelector("#time");
  score_text = document.querySelector("#score");
  winScreen = document.querySelector("#missionComplete");
  loseScreen = document.querySelector("#gameOver");

  for(let z = 240; z > 20; z -= 20){
    let x = rnd(-7,7);
    let pz = z + rnd(-5, 5);
    enemies.push(new Enemy(x,-1,-pz));
  }

  window.addEventListener("keydown", function(e) {
    if (e.key === "q") {
      isLeftGloveActive = true;
      document.querySelector("#glovemover").setAttribute("visible", false);

      ball.shoot();

      const soundIndex = Math.floor(Math.random() * 3) + 1; 
      const soundEntity = document.querySelector(`#sound${soundIndex}`);
      if (soundEntity && soundEntity.components.sound) {
        soundEntity.components.sound.playSound();
      }
    }
    
  });

  window.addEventListener("keyup", function(e) {
    if (e.key === "q") {
      isLeftGloveActive = false;
      document.querySelector("#glovemover").setAttribute("visible", true);
    }
  });

  // RIGHT GLOVE (E) – hide it for cooldown duration 
  window.addEventListener("keydown", function(j) {
    if (j.key === "e" && !viscooldown) {
      isRightGloveActive = true;
      const rightGlove = document.querySelector("#rightglovemover");
      rightGlove.setAttribute("visible", false);

      sball.shoot();
      viscooldown = true;

      // play power punch sound
      const soundEntity = document.querySelector("#powerSound");
      if (soundEntity && soundEntity.components.sound) {
        soundEntity.components.sound.playSound();
      }

      // cooldown period (2 seconds)
      setTimeout(function() {
        viscooldown = false;
        rightGlove.setAttribute("visible", true);
      }, 2000);
    }
  });
  
  window.addEventListener("keydown", function(e) {
    // check if spacebar was pressed
    if (e.code === "Space") {
      // Prevents the broser from scrolling
      e.preventDefault();

      // if not already blocking, enable it and move gloves
      if (!isBlocking) {
        isBlocking = true;


        document.querySelector("#glovemover")
          .setAttribute("position", "-0.15 -0.2 -0.35");
        document.querySelector("#rightglovemover")
          .setAttribute("position", "0.15 -0.2 -0.35");
      }
    }
  });

  window.addEventListener("keyup", function(e) {
    // Check if spacebar was released
    if (e.code === "Space") {
      // Prevent browser from scrolling
      e.preventDefault();

      if (isBlocking) {
        isBlocking = false;

        // Move gloves back to their original positions
        document.querySelector("#glovemover")
          .setAttribute("position", "-0.3 -0.2 -0.4");
        document.querySelector("#rightglovemover")
          .setAttribute("position", "0.3 -0.2 -0.4");
      }
    }
  });
  const sceneEl = document.querySelector('a-scene');
  sceneEl.addEventListener('loaded', () => {
    setTimeout(() => {
      document.getElementById('loadingMessage').innerText = "Press Start when ready";
      document.getElementById('startButton').style.display = "block";
    }, 1000);
  });
  document.getElementById('startButton').addEventListener('click', () => {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.opacity = "0";
    setTimeout(() => { overlay.style.display = "none"; }, 500);

  

  loop();
  countdown();
  });
}

function countdown(){
  if(t > 0){
    t--;
  }else{
    health -= 5;
  }

  if(health > 0){
    setTimeout(countdown, 1000);
  }else{
    results();
  }
}

function updateHealthBar() {
  let healthBar = document.querySelector("#health-bar-inner");
  let shieldBar = document.querySelector("#shield-bar-addon");
  let shieldBorder = document.querySelector("#shield-border");
  let healthNumber = document.querySelector("#health-number");

  let maxHealth = 100;
  let healthWidth = Math.min(health, maxHealth) / maxHealth; 
  let shieldWidth = (health > maxHealth) ? (health - maxHealth) / maxHealth : 0;

  // update health bar
  healthBar.setAttribute("width", healthWidth);

  // update shield bar
  if (shieldWidth > 0) {
    shieldBar.setAttribute("width", shieldWidth);
    shieldBorder.setAttribute("width", shieldWidth + 0.05); // Make a bit larger for visibility
    shieldBar.setAttribute("position", `${-0.5 + healthWidth / 2 + shieldWidth / 2} 0 0.02`);
    shieldBorder.setAttribute("position", `${-0.5 + healthWidth / 2 + shieldWidth / 2} 0 0.03`);
  } else {
    shieldBar.setAttribute("width", 0);
    shieldBorder.setAttribute("width", 0);
  }

  // update health display
  healthNumber.setAttribute("value", `${health}`);
}

function loop(){
  ball.move();
  sball.move();
  let cooldownText = document.querySelector("#cooldownText");
  if (cooldown) {
    cooldownText.setAttribute("value", "SBall Cooldown Active");
  } else {
    cooldownText.setAttribute("value", "");
  }

  for(let enemy of enemies){
    enemy.walk();
    if(distance(enemy.box, ball.obj) < 1){
      ball.fire = false;
      ball.setOpacity(0);
      enemy.takeDamage(1.5);
    }
    if(distance(enemy.box, sball.obj) < 1){
      sball.fire = false;
      enemy.takeDamage(4);
      sball.fade();
      cooldown = true;
      setTimeout(() => { cooldown = false; }, 9000);
    }

    if (distance(enemy.box, camera) < 4) {
      let damage = 0.5;
      if (isBlocking) {
        damage *= 0.5; // take 50% of the normal damage if blocking
      }
      if (isLeftGloveActive && isRightGloveActive) {
        damage = 2; // both gloves active
      } else if (isLeftGloveActive || isRightGloveActive) {
        damage = 1; // one glove active
      }

      // temporarily set damage to 1 when the right glove is activated
      if (isRightGloveActive) {
        damage = 1;

        setTimeout(() => {
          if (!isLeftGloveActive) {
            damage = 0.5; // reset to normal if left glove isn't active
          }
        }, 2000);
      }

      health -= damage;
    }
  }

  time_text.setAttribute("value", `Time: ${t}`);
  updateHealthBar();
  score_text.setAttribute("value", `Kills: ${kill}`);

  if(kill > 50) {
    results();
    return;
  } else if(health > 0) {
    window.requestAnimationFrame(loop);
  } else {
    results();
  }
}

function results() {
  // stop the background music
  const bgSound = document.querySelector("#bg_sound");
  if (bgSound && bgSound.components.sound) {
    bgSound.components.sound.stopSound();
  }

  const resultText = document.getElementById("resultText");
  const statsText = document.getElementById("statsText");

  // win or lose outcome reults
  if (health > 0 && kill > 15) {
    resultText.innerText = "You Win!";
    const winSound = document.querySelector("#win_sound");
    if (winSound && winSound.components.sound) {
      winSound.components.sound.playSound();
    }
  } else {
    resultText.innerText = "Game Over";
    const loseSound = document.querySelector("#lose_sound");
    if (loseSound && loseSound.components.sound) {
      loseSound.components.sound.playSound();
    }
  }

  statsText.innerText = `Kills: ${kill} | Time: ${t} seconds`;
  document.getElementById("endScreen").style.display = "block";

  document.getElementById("playAgainBtn").addEventListener("click", () => {
    window.location.reload();
  });
}




function distance(obj1,obj2){
  let x1 = obj1.object3D.position.x;
  let y1 = obj1.object3D.position.y;
  let z1 = obj1.object3D.position.z;
  let x2 = obj2.object3D.position.x;
  let y2 = obj2.object3D.position.y;
  let z2 = obj2.object3D.position.z;

  return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2) + Math.pow(z1-z2,2));
}
//headbob, edit line 296 for the power of the bob
window.addEventListener('DOMContentLoaded', () => {
  AFRAME.registerComponent('head-bob', {
    schema: { amplitude: { type: 'number', default: 0.25 }, frequency: { type: 'number', default: 8 } },
    init() {
      const pos = this.el.getAttribute('position');
      this.initialY = pos.y;
      this.lastPos = { ...pos };
      this.bobTime = 0;
    },
    tick(time, deltaTime) {
      const currentPos = this.el.getAttribute('position');
      const movement = Math.sqrt(Math.pow(currentPos.x - this.lastPos.x, 2) + Math.pow(currentPos.z - this.lastPos.z, 2));
      if (movement > 0.001) this.bobTime += deltaTime / 1000;
      this.el.setAttribute('position', { ...currentPos, y: this.initialY + Math.sin(this.bobTime * this.data.frequency) * this.data.amplitude });
      this.lastPos = { ...currentPos };
    }
  });
});
// track which keys are currently held down
const movementKeysDown = new Set();

// listen for keydown
document.addEventListener("keydown", (event) => {
  // Convert to lowercase to handle uppercase as well
  const key = event.key.toLowerCase();

  // if it's a movement key, add to the set
  if (["w", "a", "s", "d"].includes(key)) {
    movementKeysDown.add(key);

    // grab the walk sound entity
    const walkSoundEntity = document.querySelector("#walkSound");
    // if it's not already playing, play it
    if (walkSoundEntity && !walkSoundEntity.components.sound.isPlaying) {
      walkSoundEntity.components.sound.playSound();
    }
  }
});

// listen for keyup
document.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();

  // if it's a movement key, remove from the set
  if (["w", "a", "s", "d"].includes(key)) {
    movementKeysDown.delete(key);

    // if no movement keys are held, stop the sound
    if (movementKeysDown.size === 0) {
      const walkSoundEntity = document.querySelector("#walkSound");
      if (walkSoundEntity && walkSoundEntity.components.sound.isPlaying) {
        walkSoundEntity.components.sound.stopSound();
      }
    }
  }
});