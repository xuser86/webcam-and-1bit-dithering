const worker = new Worker("./js/worker.js");

const video0 = document.getElementsByTagName("video")[0];
const canvasTmp = document.getElementById("video-temp");
const canvas0 = document.getElementById("video-out");

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video0.srcObject = stream;
  video0.play();
});

function getVideoFrame() {
  canvasTmp.width = video0.videoWidth;
  canvasTmp.height = video0.videoHeight;
  canvasTmp
    .getContext("2d")
    .drawImage(video0, 0, 0, canvasTmp.width, canvasTmp.height);

  return canvasTmp
    .getContext("2d")
    .getImageData(0, 0, canvasTmp.width, canvasTmp.height);
}

function flipImage(imageData) {
  canvas0.width = imageData.width;
  canvas0.height = imageData.height;

  canvas0.getContext("2d").putImageData(imageData, 0, 0);
}

worker.onmessage = function(e) {
  if (e.data && e.data.image) {
    flipImage(e.data.image);

    worker.postMessage({image: getVideoFrame()});
  }
};

setTimeout(() => worker.postMessage({image: getVideoFrame()}), 1000);
