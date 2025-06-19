const { Responsive } = P5Template;

let faceMesh;
// facemMesh를 쓰기위한 옵션 오브제
const option = {
  maxFaces: 1,
  refineLandmarks: false,
  flipHorizontal: true,
};
let faces = [];
let video;
let lipStamp;
let lipStampObj;
let bubbles = [];
let stamps = [];

let frameCounter = 0;

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
  // 캔버스 바꿔줘야함
  new Responsive().createResponsiveCanvas(1440, 1080, 'contain', true);

  lipStamp = createGraphics(width, height);
  lipStamp.clear();
  // "contain" | "fill" | "cover" | "none" | "scale-down"

  // 비디오
  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  // size: 640, 480
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);

  // 입술 번호 출력
  textSize(8);
}

function draw() {
  background('#0000cd');
  image(video, 0, 0, width, height);

  // lip 텍스트 적기
  textStyle(BOLDITALIC);
  textSize(70);
  textAlign(CENTER);
  fill('white');
  text('Lips', width / 2, height / 7);

  frameCounter++;
  // 그리드
  // Responsive.drawReferenceGrid('#ffffff');

  // 버블
  for (let cnt = 0; cnt < faces.length; cnt++) {
    let face = faces[cnt];
    let lips = face.lips;

    if (lips) {
      lipStampObj = new LipStamp(width, height, seqOuter, seqInner, lips);
    }

    // if (frameRate % 5 === 0) {
    // }
    if (frameCounter % 10 === 0) {
      stamps.push(new LipStamp(width, height, seqOuter, seqInner, lips));
    }

    let lipsOpen = dist(
      lips.keypoints[13].x,
      lips.keypoints[13].y,
      lips.keypoints[14].x,
      lips.keypoints[14].y
    );
    if (lipsOpen > 15) {
      bubbles.push(new Bubble(lips.keypoints[13].x, lips.keypoints[13].y));
    }
  }

  for (let num = bubbles.length - 1; num >= 0; num--) {
    bubbles[num].update();
    bubbles[num].display();
    if (bubbles[num].isDead()) {
      bubbles.splice(num, 1);
    }
  }

  for (let lipNum = stamps.length - 1; lipNum >= 0; lipNum--) {
    stamps[lipNum].update();
    stamps[lipNum].display();
    if (stamps[lipNum].isDead()) {
      stamps.splice(lipNum, 1);
    }
  }

  // 마지막에 와야함 윗 코드들을 다 실행 후 이미지로 되야하기 때문
  // image(lipStamp, 0, 0);
  if (lipStampObj) {
    lipStampObj.display();
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
