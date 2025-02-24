class Enemy {
  constructor(x, y, z) {
    this.z = z;
    this.dz = 0.06;//speed of the mobs
    this.health = 100;

    // model pool
    const models = [
      { id: "#sonicrun", scale: "0.25 0.25 0.25"},
      { id: "#gokuwalk", scale: "2 2 2"}
    ];

    // sets goku or sonic
    const selectedModel = models[Math.floor(Math.random() * models.length)];
    console.log("Selected Model:", selectedModel.id); 

    // makes model
    this.obj = document.createElement("a-gltf-model");
    this.obj.setAttribute("src", selectedModel.id);
    this.obj.setAttribute("animation-mixer", { timeScale: 2.0 });
    this.obj.setAttribute("scale", selectedModel.scale);
    this.obj.setAttribute("position", { x: x, y: 0, z: this.z });
    this.obj.setAttribute("rotation", { x: 0, y: 90, z: 0 });
    this.obj.addEventListener("model-loaded", () => {
      if (selectedModel.id === "#gokuwalk") {
        this.obj.object3D.rotation.set(0, THREE.MathUtils.degToRad(45), 0); // rotate 45
      } else {
        this.obj.object3D.rotation.set(0, THREE.MathUtils.degToRad(90), 0); // normal rotation
      }
    });
    // hitbox
    this.box = document.createElement("a-box");
    this.box.setAttribute("scale", "0.8 3 0.8");
    this.box.setAttribute("position", { x: x, y: 1.3, z: this.z });
    this.box.setAttribute("material", " opacity: 0; transparent: true");



    // healthbar bg (green)
    this.healthBar = document.createElement("a-box");
    this.healthBar.setAttribute("scale", "1 0.2 0.05");
    this.healthBar.setAttribute("position", { x: x, y: 5, z: this.z });
    this.healthBar.setAttribute("material", "color: lime");

    scene.append(this.obj);
    scene.append(this.box);
    scene.append(this.healthBarBG);
    scene.append(this.healthBar);
  }

  walk() {
      this.z += this.dz;
      this.obj.object3D.position.z = this.z;
      this.box.object3D.position.z = this.z;
      // this.healthBarBG.object3D.position.z = this.z;
      this.healthBar.object3D.position.z = this.z;

      // makes healthbar face player
      let cameraPos = camera.object3D.position;
      let enemyPos = this.obj.object3D.position;

      // angle calc
      let angle = Math.atan2(cameraPos.x - enemyPos.x, cameraPos.z - enemyPos.z);

      // convert to degrees and sets rotation
      let rotationY = THREE.MathUtils.radToDeg(angle);
      // this.healthBarBG.setAttribute("rotation", { x: 0, y: rotationY, z: 0 });
      this.healthBar.setAttribute("rotation", { x: 0, y: rotationY, z: 0 });

      if (this.z > 15){
        this.respawn();
        health -= 15;
      }
  }

  attack() {
    health -= 10;
    this.respawn();
    
  }

  die() {
    health += 5;
    kill += 1;
    t += 5;
    this.respawn();
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    } else {
      this.updateHealthBar();
    }
  }

  updateHealthBar() {
    let scaleX = this.health / 100; // healthbar shrink
    this.healthBar.setAttribute("scale", `${scaleX} 0.1 0.05`);

    // healthbar scaling
    let offset = (1 - scaleX) / 2;
    this.healthBar.object3D.position.x = this.obj.object3D.position.x - offset;
  }

  respawn() {
    let x = rnd(-8, 8);
    this.z = -120 + rnd(-5, 5);
    this.health = 100; // health reset

    // random model
    const models = [
      { id: "#sonicrun", scale: "0.25 0.25 0.25" },
      { id: "#gokuwalk", scale: "2 2 2" } 
    ];
    const selectedModel = models[Math.floor(Math.random() * models.length)];
    console.log("Respawning with Model:", selectedModel.id); 
    
    this.box.setAttribute("scale", "0.8 3 0.8");
    this.box.setAttribute("position", { x: x, y: 1.3, z: this.z });
    this.box.setAttribute("material", " opacity: 0; transparent: true");
    this.obj.setAttribute("src", selectedModel.id);
    this.obj.setAttribute("scale", selectedModel.scale);

    this.obj.setAttribute("src", selectedModel.id);
    this.obj.setAttribute("animation-mixer", { timeScale: 2.0 });
    this.obj.setAttribute("scale", selectedModel.scale);
    this.obj.setAttribute("position", { x: x, y: 0, z: this.z });
    this.obj.setAttribute("rotation", { x: 0, y: 90, z: 0 });
    this.obj.addEventListener("model-loaded", () => {
      if (selectedModel.id === "#gokuwalk") {
        this.obj.object3D.rotation.set(0, THREE.MathUtils.degToRad(45), 0); // rotate 45
      } else {
        this.obj.object3D.rotation.set(0, THREE.MathUtils.degToRad(90), 0); // normal rotation
      }
    });
  
    this.updateHealthBar(); //bar reset
  }
}
