const { Responsive, Scroll, Title, References } = P5jsTemplate;

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

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(option);
}

function setup() {
  Responsive.createResponsiveCanvas(
    640,
    480,
    '#canvas-container',
    'cover',
    true
  );
  Scroll.init();
  Title.init('감자빵', '백채이', '2025');
  References.init([
    {
      title: 'What was Coding like 40 years ago?',
      authors: ['Daniel Shiffman', 'someone'],
      year: '2022',
      publisher: 'The Coding Train - YouTube',
      url: 'https://www.youtube.com/watch?v=7r83N3c2kPw',
    },
    {
      title: '250425a',
      authors: ['Okazz'],
      year: '2025',
      publisher: 'OpenProcessing',
      url: 'https://openprocessing.org/sketch/2625827',
    },
    {
      title:
        'Nature of Code 자연계 법칙을 디지털 세계로 옮기는 컴퓨터 프로그래밍 전략',
      authors: ['다니엘 쉬프만'],
      translator: ['윤인성'],
      year: '2015',
      publisher: '한빛미디어',
    },
  ]);

  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  textSize(8);
}

function draw() {
  background('white');
  // image(video, 0, 0, width, height);
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    // for (let j = 0; j < face.keypoints.length; j++) {
    //   let keypoint = face.keypoints[j];
    //   fill(0, 255, 0);
    //   noStroke();
    //   circle(keypoint.x, keypoint.y, 5);
    // }
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
    // fill(0);
    // for (let kpIdx = 0; kpIdx < lips.keypoints.length; kpIdx++) {
    //   let keypoint = lips.keypoints[kpIdx];
    //   text(kpIdx, keypoint.x, keypoint.y);
    // }
  }
  // Responsive.drawReferenceGrid('#ffffff');
}

function keyPressed() {
  if (key === 'a') {
    for (let i = 0; i < faces.length; i++) {
      let face = faces[i];
      console.log(i, face);
      let lips = face.lips;
      console.log(i, lips);
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
