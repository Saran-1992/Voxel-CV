var headAngles = { yaw: 0, pitch: 0 };
var video = document.getElementById('input-video');
var canvasElement = document.getElementById('debug-canvas');
var canvasCtx = canvasElement.getContext('2d');

var faceMesh = new FaceMesh({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`});
faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5 });

faceMesh.onResults((res) => {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(res.image, 0, 0, canvasElement.width, canvasElement.height);
    
    if (res.multiFaceLandmarks && res.multiFaceLandmarks.length > 0) {
        var nose = res.multiFaceLandmarks[0][1];
        if (nose) {
            // Signs swapped to fix Left-Right and Up-Down inversion
            headAngles.yaw = (nose.x - 0.5) * 2.8;   // Horizontal fix
            headAngles.pitch = -(nose.y - 0.5) * 1.8; // Vertical fix
        }
    }
    canvasCtx.restore();
});

var cam = new Camera(video, { onFrame: async () => await faceMesh.send({image: video}), width: 640, height: 480 });
cam.start();