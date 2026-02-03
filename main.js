var keys = {};
var mouse = new THREE.Vector2();
var upVector = new THREE.Vector3(0, 1, 0);

document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

window.addEventListener('mousemove', (e) => {
    document.getElementById('crosshair').style.left = e.clientX + 'px';
    document.getElementById('crosshair').style.top = e.clientY + 'px';
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('mousedown', () => {
    var ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);
    var hits = ray.intersectObjects(voxels);
    if (hits.length > 0) {
        var p = new THREE.Vector3().copy(hits[0].point).add(hits[0].face.normal.multiplyScalar(0.5));
        
        // Better Dirt Texture
        var dirtTex = pixelTexture("#8b5a2b", "#6e4621", 16);
        var b = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({map: dirtTex}));
        
        b.position.set(Math.round(p.x), Math.round(p.y), Math.round(p.z));
        b.castShadow = true;
        b.receiveShadow = true;
        scene.add(b);
        voxels.push(b);
    }
});

var last = performance.now();
function loop() {
    requestAnimationFrame(loop);
    var dt = (performance.now() - last) / 1000;
    last = performance.now();

    // Lerp factor increased for better responsiveness
    camera.rotation.y += (headAngles.yaw - camera.rotation.y) * 0.12;
    camera.rotation.x += (headAngles.pitch - camera.rotation.x) * 0.12;

    var dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0; dir.normalize();
    var sideDir = new THREE.Vector3().crossVectors(upVector, dir).normalize();

    var speed = 12 * dt; // Movement speed slightly increased
    if (keys['KeyW']) camera.position.addScaledVector(dir, speed);
    if (keys['KeyS']) camera.position.addScaledVector(dir, -speed);
    if (keys['KeyA']) camera.position.addScaledVector(sideDir, speed);
    if (keys['KeyD']) camera.position.addScaledVector(sideDir, -speed);

    // Boundary Logic
    var bound = 120;
    camera.position.x = Math.max(-bound, Math.min(bound, camera.position.x));
    camera.position.z = Math.max(-bound, Math.min(bound, camera.position.z));

    // Better Cloud Motion
    cloudGroup.children.forEach(c => {
        c.position.x += 1.5 * dt;
        if(c.position.x > 200) c.position.x = -200;
    });

    camera.position.y = 1.8;
    renderer.render(scene, camera);
}
loop();