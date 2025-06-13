const { Responsive, Scroll, Title, References } = P5jsTemplate;

function setup() {
  Responsive.createResponsiveCanvas(
    800,
    200,
    '#canvas-container',
    'cover',
    false
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
}

function draw() {
  background('#000000');
  noStroke();
  fill('red');
  circle(mouseX, mouseY, 100);
  Responsive.drawReferenceGrid('#ffffff');
}

function mouseWheel() {
  console.log('wheel');
}
