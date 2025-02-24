class Ball {
  constructor() {
    this.obj = document.createElement("a-gltf-model");
    this.obj.setAttribute("src", "#glove");
    this.obj.setAttribute("scale", "0.1 0.1 0.1");
    scene.append(this.obj);

    this.obj.addEventListener("model-loaded", () => {
      this.setOpacity(0);
    });
  }

  move() {
    if (this.fire) {
      this.x += this.dx;
      this.z += this.dz;
      this.obj.setAttribute("position", { x: this.x, y: this.y, z: this.z });

      this.distanceTraveled += Math.sqrt(this.dx * this.dx + this.dz * this.dz);

      if (this.distanceTraveled >= 15) {
        this.fire = false;
        this.setOpacity(0);
      }
    }
  }

  shoot() {
    this.fire = true;
    this.distanceTraveled = 0;

    this.x = camera.object3D.position.x;
    this.y = 2;
    this.z = camera.object3D.position.z;

    let cameraRotation = new THREE.Euler();
    cameraRotation.copy(camera.object3D.rotation); 

    // set rotation to match the camera but keep X at 90 degrees
    this.obj.object3D.rotation.set(
      THREE.MathUtils.degToRad(-90), 
      cameraRotation.y,
      cameraRotation.z
    );

    let angle = cameraRotation.y + Math.PI;
    this.dx = Math.sin(angle) / 2;
    this.dz = Math.cos(angle) / 2;

    this.setOpacity(1);
  }

  setOpacity(value) {
    let mesh = this.obj.getObject3D("mesh");
    if (mesh) {
      mesh.traverse((node) => {
        if (node.isMesh) {
          node.material.transparent = value < 1;
          node.material.opacity = value;
          node.material.needsUpdate = true;
        }
      });
    }
  }
}



class SBall {
  constructor() {
    this.fire = false; 

    this.obj = document.createElement("a-entity");
    this.obj.setAttribute("gltf-model", "#fireball");
    this.obj.setAttribute("rotation", { x: 0, y: 90, z: 0 });
    this.obj.setAttribute("visible", false); // hide initially

    scene.append(this.obj);
  }

  move() {
    if (this.fire) {
      this.x += this.dx;
      this.z += this.dz;
      this.obj.setAttribute("position", { x: this.x, y: this.y, z: this.z });

    }
  }

  shoot() {
    this.fire = true;

    // position the fireball at the player's location
    this.x = camera.object3D.position.x;
    this.y = 2;
    this.z = camera.object3D.position.z;

    let angle = camera.object3D.rotation.y + Math.PI;
    this.dx = Math.sin(angle) / 2;
    this.dz = Math.cos(angle) / 2;

    // match rotation with camera's Y rotation
    let adjustedYRotation = THREE.MathUtils.radToDeg(camera.object3D.rotation.y) + 90;
    this.obj.setAttribute("rotation", { x: 0, y: adjustedYRotation, z: 0 });

    // make fireball visible
    this.obj.setAttribute("visible", true);
  }

  fade() {
    this.fire = false; // stop movement 
    this.obj.setAttribute("visible", false); // hide fireball
  }
}
