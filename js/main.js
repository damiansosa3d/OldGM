
const nes = new jsnes.NES({
  onFrame: function(frameBuffer) {
    const canvas = document.getElementById('nes-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, 256, 240);

    for (let i = 0; i < frameBuffer.length; i++) {
      imageData.data[i * 4 + 0] = frameBuffer[i] & 0xFF;
      imageData.data[i * 4 + 1] = frameBuffer[i] >> 8;
      imageData.data[i * 4 + 2] = frameBuffer[i] >> 16;
      imageData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  },
});

function loadSelectedROM() {
  const game = document.getElementById('gameSelect').value;
  fetch('roms/' + game)
    .then(res => res.arrayBuffer())
    .then(buffer => {
      nes.loadROM(buffer);
      startEmulator();
    });
}

function startEmulator() {
  setInterval(() => nes.frame(), 1000 / 60);
}

function saveScore() {
  const name = document.getElementById('username').value;
  const score = parseInt(document.getElementById('score').value);
  if (!name || isNaN(score)) return;

  const scores = JSON.parse(localStorage.getItem('scores') || '[]');
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('scores', JSON.stringify(scores));
  renderScores();
}

function renderScores() {
  const scores = JSON.parse(localStorage.getItem('scores') || '[]');
  const list = document.getElementById('score-list');
  list.innerHTML = '';
  scores.slice(0, 10).forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.name}: ${s.score}`;
    list.appendChild(li);
  });
}

renderScores();
