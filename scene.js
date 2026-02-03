var scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
// Fog add pannuna graphics better-ah theriyaum
scene.fog = new THREE.FogExp2(0x87ceeb, 0.015); 

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.8, 10);

var renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('game-canvas'), 
    antialias: true // Graphics smooth-ah irukka
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Shadows enable panniyachu

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
var sun = new THREE.DirectionalLight(0xffffff, 1.0);
sun.position.set(50, 100, 50);
sun.castShadow = true; 
scene.add(sun);

// High Quality Pixel Texture logic
function pixelTexture(c1, c2, size = 16) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = c1; ctx.fillRect(0,0,size,size);
    ctx.fillStyle = c2;
    for(var i=0; i<30; i++) ctx.fillRect(Math.random()*size, Math.random()*size, 1, 1);
    var tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    return tex;
}

var grassMat = new THREE.MeshLambertMaterial({ map: pixelTexture("#5fa83c", "#4a8b2c", 32) });
var floor = new THREE.Mesh(new THREE.PlaneGeometry(250, 250), grassMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

var voxels = [floor];
var cloudGroup = new THREE.Group();
var cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
for (var i = 0; i < 25; i++) {
    var cloud = new THREE.Mesh(new THREE.BoxGeometry(15, 2, 10), cloudMat);
    cloud.position.set(Math.random()*400-200, 35, Math.random()*400-200);
    cloudGroup.add(cloud);
}
scene.add(cloudGroup);