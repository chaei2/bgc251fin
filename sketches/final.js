const { Responsive } = P5Template;

let faceMesh;
const option = {
  maxFaces: 1,
  refineLandmarks: false,
  flipHorizontal: true,
};
let faces = [];
let video;

let seqOuter = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10,
];

let seqInner = [
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 41, 40, 39, 38, 37, 36, 35, 34, 33,
  32, 31, 22,
];

// preload(), set up보다 먼저 딱 한 번 실행되는 함수
function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(option);
}

function setup() {
  new Responsive().createResponsiveCanvas(1440, 1080, 'contain', true);

  // 비디오
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);

  // 입술 번호 출력
  textSize(8);
}

function draw() {
  background('#0000cd');

  // 그리드 색
  Responsive.drawReferenceGrid('#ffffff');

  // 디버깅용
  noStroke();
  fill('red');
  circle(mouseX, mouseY, 100);

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    let lips = face.lips;
    fill(200, 50, 30);
    noStroke();
    beginShape();
    for (let n = 0; n < seqOuter.length; n++) {
      let kpIdx = seqOuter[n];
      let keypoint = lips.keypoints[kpIdx];
      vertex(keypoint.x, keypoint.y);
    }

    // endShape(CLOSE);
    // 반시계
    beginContour();
    for (let num = seqInner.length - 1; num >= 0; num--) {
      let kpIdx = seqInner[num];
      let keypoint = lips.keypoints[kpIdx];
      vertex(keypoint.x, keypoint.y);
    }
    endContour();

    endShape(CLOSE);
  }
}

// 디버깅용2
function keyPressed() {
  if (key === 'a') {
    for (let i = 0; i < faces.length; i++) {
      // 얼굴 인식 확인
      let face = faces[i];
      console.log(i, face);

      // lips 인식 확인
      let lips = face.lips;
      console.log(i, lips);

      // 키 포인트 배열 구조 확인
      for (let kpIdx = 0; kpIdx < lips.keypoints.length; kpIdx++) {
        let keypoint = lips.keypoints[kpIdx];
        console.log(kpIdx, keypoint);
      }
    }
  }
}

function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
