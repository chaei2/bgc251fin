const { Responsive } = P5Template;

let faceMesh;
// facemMesh를 쓰기위한 옵션 오브제
const option = {
  maxFaces: 1,
  refineLandmarks: false,
  flipHorizontal: true,
};

let currentBg = '#0000cd';

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
  // textSize(8);
}

//  getNormalizedDistance()절대좌표 거리 구하는 함수
function getNormalizedDistance(a, b) {
  let ax = map(a.x, 0, video.width, 0, width);
  let ay = map(a.y, 0, video.height, 0, height);
  let bx = map(b.x, 0, video.width, 0, width);
  let by = map(b.y, 0, video.height, 0, height);
  return dist(ax, ay, bx, by);
}

function draw() {
  background(currentBg);
  // image(video, 0, 0, width, height);

  // lip 텍스트 적기
  textStyle(BOLDITALIC);
  textSize(60);
  textAlign(CENTER);
  fill('white');
  text('Lips & Bubbles', width / 2, height / 7);

  textStyle(ITALIC);
  textSize(20);
  textAlign(CENTER);
  fill('yellow');
  text('Please turn your head to the left and right', width / 2, height / 5.7);

  frameCounter++;
  // 그리드
  // Responsive.drawReferenceGrid('#ffffff');
  // 얼굴
  for (let cnt = 0; cnt < faces.length; cnt++) {
    let face = faces[cnt];
    let lips = face.lips;

    if (lips) {
      lipStampObj = new LipStamp(width, height, seqOuter, seqInner, lips);
    }

    if (frameCounter % 10 === 0) {
      stamps.push(new LipStamp(width, height, seqOuter, seqInner, lips));
    }

    // 스탬프
    for (let lipNum = stamps.length - 1; lipNum >= 0; lipNum--) {
      stamps[lipNum].update();
      stamps[lipNum].display();
      if (stamps[lipNum].isDead()) {
        stamps.splice(lipNum, 1);
      }

      // 버블
      for (let num = bubbles.length - 1; num >= 0; num--) {
        bubbles[num].update();
        bubbles[num].display();
        if (bubbles[num].isDead()) {
          bubbles.splice(num, 1);
        }
      }

      let a = lips.keypoints[13];
      let b = lips.keypoints[14];
      let d = dist(a.x, a.y, b.x, b.y);
      // let x = map((a.x + b.x) / 2, 0, video.width, 0, width);
      // let y = map((a.y + b.y) / 2, 0, video.height, 0, height);

      let top = lips.keypoints[13];
      let bottom = lips.keypoints[14];
      let left = lips.keypoints[0];
      let right = lips.keypoints[41];

      // let dx = bottom.x - top.x;
      // let dy = bottom.y - top.y;
      // console.log('left', left);
      // console.log('right', right);

      let mouthHeight = getNormalizedDistance(top, bottom);
      let mouthWidth = getNormalizedDistance(left, right);

      let ratio = mouthHeight / mouthWidth;

      if (ratio > 0.23 && frameCounter % 6 === 0) {
        currentBg = color(random(60, 100), random(60, 200), random(100, 255));
        textStyle(BOLDITALIC);
        textSize(100);
        textAlign(CENTER);
        fill(random(150, 255), random(150, 255), random(150, 255));
        text('Bubble!', width / 2, height / 3);
        let x = (top.x + bottom.x) / 2;
        let y = (top.y + bottom.y) / 2;
        bubbles.push(new Bubble(x, y));

        // 디버깅용
        // console.log(
        //   'mouthHeight:',
        //   mouthHeight,
        //   'mouthWidth:',
        //   mouthWidth,
        //   'ratio:',
        //   ratio
        // );
      }
    }
  }
}
// 마지막에 와야함 윗 코드들을 다 실행 후 이미지로 되야하기 때문
// image(lipStamp, 0, 0);
if (lipStampObj) {
  lipStampObj.display();
}

// 디버깅용2
// function keyPressed() {
//   if (key === 'a') {
//     for (let i = 0; i < faces.length; i++) {
//       // 얼굴 인식 확인
//       let face = faces[i];
//       console.log(i, face);

//       // lips 인식 확인
//       let lips = face.lips;
//       console.log(i, lips);

//       // 키 포인트 배열 구조 확인
//       for (let kpIdx = 0; kpIdx < lips.keypoints.length; kpIdx++) {
//         let keypoint = lips.keypoints[kpIdx];
//         console.log(kpIdx, keypoint);
//       }
//     }
//   }
// }

function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
