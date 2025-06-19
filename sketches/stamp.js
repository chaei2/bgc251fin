// 입술 도장, 입술 바깥쪽, 안쪽 수치화 및 그림, 나타내기
// 지금해야할 일: 스탬프 사라지기

class LipStamp {
  constructor(width, height, seqOuter, seqInner, lips) {
    this.lipLayer = createGraphics(width, height);
    this.lipLayer.clear();
    this.seqOuter = seqOuter;
    this.seqInner = seqInner;
    this.alpha = 200;
    this.drawStamp(lips);
  }

  drawStamp(lips) {
    this.lipLayer.fill(178, 34, 34, this.alpha);
    this.lipLayer.noStroke();
    this.lipLayer.beginShape();

    let cX = 0;
    let cY = 0;

    // 중심점 좌표 계산
    for (let idx = 0; idx < this.seqOuter.length; idx++) {
      let kp = lips.keypoints[this.seqOuter[idx]];
      cX += kp.x;
      cY += kp.y;
    }

    cX /= this.seqOuter.length;
    cY /= this.seqOuter.length;

    let scaleLips = 2.5;

    // 입술 바깥쪽 그림
    for (let n = 0; n < this.seqOuter.length; n++) {
      let kpIdx = this.seqOuter[n];
      let kp = lips.keypoints[kpIdx];
      let x = (kp.x - cX) * scaleLips + cX;
      let y = (kp.y - cY) * scaleLips + cY;

      this.lipLayer.vertex(x, y);
    }

    this.lipLayer.beginContour();
    // 입술 안쪽 그림과 동시에 역으로 부름
    for (let num = this.seqInner.length - 1; num >= 0; num--) {
      let kpIdx = this.seqInner[num];
      let kp = lips.keypoints[kpIdx];
      let x = (kp.x - cX) * scaleLips + cX;
      let y = (kp.y - cY) * scaleLips + cY;
      this.lipLayer.vertex(x, y);
    }

    this.lipLayer.endContour();
    this.lipLayer.endShape(CLOSE);

    // if (this.alpha < 0) this.alpha = 0;
  }
  update() {
    this.alpha -= 5;
  }
  display() {
    tint(255, this.alpha);
    image(this.lipLayer, 0, 0);
    noTint();
  }

  isDead() {
    return this.alpha <= 0;
  }
}
