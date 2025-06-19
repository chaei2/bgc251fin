class Bubble {
  constructor(x, y) {
    this.p = createVector(x, y);
    this.alpha = 200;
    this.v = createVector(random(-0.5, 0.5), random(-1, -4));
    this.size = random(10, 40);
  }

  update() {
    this.p.add(this.v);
    this.alpha -= 3;
  }
  display() {
    noStroke();
    fill(255, 255, 255, this.alpha);
    ellipse(this.p.x, this.p.y, this.size);
  }
  isDead() {
    return this.alpha <= 0;
  }
}
