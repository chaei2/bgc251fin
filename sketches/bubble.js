// 버블 생성, 업뎃, 화면에 뜨고, 죽기
class Bubble {
  constructor(x, y) {
    this.p = createVector(x, y);
    this.alpha = 180;
    this.v = createVector(random(-0.5, 0.5), random(-1, -4));
    this.size = random(30, 100);
  }

  update() {
    this.p.add(this.v);
    this.alpha -= 3;
  }
  display() {
    noStroke();
    fill(200, random(100, 255), random(100, 255), this.alpha);
    ellipse(this.p.x, this.p.y, this.size);
  }
  isDead() {
    return this.alpha <= 0;
  }
}
