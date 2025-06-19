// 입술 도장, 입술 바깥쪽, 안쪽 수치화 및 그림, 나타내기
class LipStamp {
  constructor(width, height, seqOuter, seqInner) {
    this.lipLayer = createGraphics(width, height);
    this.lipLayer.clear();
    this.seqOuter = seqOuter;
    this.seqInner = seqInner;
  }
  drawStamp(lips) {
    this.lipLayer.fill('#b22222a9');
    this.lipLayer.noStroke();
    this.lipLayer.beginShape();

    // 입술 바깥쪽 그림
    for (let n = 0; n < this.seqOuter.length; n++) {
      let kpIdx = this.seqOuter[n];
      let keypoint = lips.keypoints[kpIdx];
      this.lipLayer.vertex(keypoint.x, keypoint.y);
    }

    this.lipLayer.beginContour();
    // 입술 안쪽 그림과 동시에 역으로 부름
    for (let num = this.seqInner.length - 1; num >= 0; num--) {
      let kpIdx = this.seqInner[num];
      let keypoint = lips.keypoints[kpIdx];
      this.lipLayer.vertex(keypoint.x, keypoint.y);
    }

    this.lipLayer.endContour();
    this.lipLayer.endShape(CLOSE);
  }

  show() {
    image(this.lipLayer, 0, 0);
  }
}
