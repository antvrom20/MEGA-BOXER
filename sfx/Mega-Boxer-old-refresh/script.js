let rnd = (l,u) => Math.floor(Math.random()*(u-l) + l);


window.onload = function(){
  //
  document.addEventListener("DOMContentLoaded", () => {
      let player = new Player("a-camera"); // Make sure Player is initialized
      document.addEventListener("keydown", (e) => {
          if (e.key === "k") {
              let hitbox = document.querySelector(".hitbox");
              if (hitbox) {
                  hitbox.dispatchEvent(new Event("punch"));
              } else {
                  console.error("Hitbox not found!");
              }
          }
      });

      function gameLoop() {
          player.update();
          requestAnimationFrame(gameLoop);
      }
      gameLoop();
  });

  //
  
  scene = document.querySelector("a-scene"); 
  console.log(1)
  player = new Player("a-camera");

  
//
   //


  
  for (let i = 0; i < 35; i++) {
    x = rnd(-20, 10);
    z = rnd(-30, -7);

    createPeople(x, -1, z);
  }


  for (let i = 0; i < 35; i++) {
    x = rnd(20, -10);
    z = rnd(30, 7);

    createPeople(x, -1, z);
  }


  for (let i = 0; i < 35; i++) {
    x = rnd(20, 10);
    z = rnd(-30, -7);

    createPeople(x, -1, z);
  }


  for (let i = 0; i < 35; i++) {
    x = rnd(-20, -10);
    z = rnd(30, 7);

    createPeople(x, -1, z);
  }

  for (let i = 0; i < 30; i++) {
    x = rnd(-20, -10);
    z = rnd(-10, 10);

    createPeople(x, -1, z);
  }

  for (let i = 0; i < 30; i++) {
    x = rnd(20, 10);
    z = rnd(-10, 10);

    createPeople(x, -1, z);
  }

  loop();
}
function createPeople(x, y, z){
  let people = document.createElement("a-entity");
  
  let body = document.createElement("a-cylinder");
  body.setAttribute("color","white");
  body.setAttribute("position","1 2 1");
  body.setAttribute("radius","0.5");
  body.setAttribute("height","2");
 
  people.append( body );

  let head = document.createElement("a-sphere");
  head.setAttribute("position","1 3.2 1");
  head.setAttribute("color","white");
  head.setAttribute("radius",".7");
  people.append( head );

  people.setAttribute("position",{x:x, y:y, z:z});
  scene.append( people )
} 

function loop(){
	player.update();
	window.requestAnimationFrame(loop);
}
window.addEventListener("keydown", (e) => {
    if (e.key === "k") {
        let punchEvent = new Event("punch");
        document.querySelector(".hitbox").dispatchEvent(punchEvent);
    }
});