const introCard = document.getElementById("introCard");
const indicatorWave = document.getElementById("indicatorWave");
const guessCard = document.getElementById("guessCard");
const guessInput = document.getElementById("guessInput");
const btGuess = document.getElementById("btGuess");
const gameOverCard = document.getElementById("gameOverCard");
const winCard = document.getElementById("winCard");
const canvas = document.getElementById("canvas");
const lbPrompt = document.getElementById("lbPrompt");

const tmpIndicatorDisplatType = indicatorWave.style.display;
const tmpGuessCardDisplatType = guessCard.style.display;

// disable indicatorWave
indicatorWave.style.display = "none";
// disable guessCard
guessCard.style.display = "none";
//disable gameOverCard
gameOverCard.style.display = "none";
//disable winCard
winCard.style.display = "none";

let mysteryNumber = Math.floor(Math.random() * 100) + 1;
let live = 5;

introCard.onclick = () => {
  new Audio("./assets/title.mp3").play();
  mysteryNumber = Math.floor(Math.random() * 100) + 1;
  console.log(mysteryNumber);
  live = 5;
  document.documentElement.style.setProperty(
    "--tube-percentage",
    (5 - live) * 20 + "%"
  );
  // start the game
  introCard.classList.add("zoomOutAndFadeOut");
  setTimeout(() => {
    introCard.style.display = "none";
    indicatorWave.style.display = tmpIndicatorDisplatType;
    guessCard.style.display = tmpGuessCardDisplatType;
    gameOverCard.style.display = "none";
    winCard.style.display = "none";
    canvas.style.display = "none";
  }, 1000);
};

btGuess.onclick = () => {
  const guess = parseInt(guessInput.value);
  // set css variables --tube-percentage
  document.documentElement.style.setProperty(
    "--tube-percentage",
    (5 - live) * 20 + "%"
  );

  if (guess === mysteryNumber) {
    guessCard.style.display = "none";
    //   gameOverCard.style.display = tmpGuessCardDisplatType;
    winCard.style.display = tmpGuessCardDisplatType;
    let lbResultOnWin = document.getElementById("lbResultOnWin");
    lbResultOnWin.innerHTML = `The number was ${mysteryNumber}`;

    new Audio("./assets/correct.mp3").play();
    startConfetti();
  } else if (guess < mysteryNumber) {
    lbPrompt.innerHTML = "Your guess is too low";
    // play sound wrong.mp3
    new Audio("./assets/wrong.mp3").play();
  } else {
    lbPrompt.innerHTML = "Your guess is too high";

    new Audio("./assets/wrong.mp3").play();
  }
  live--;
  if (live === 0) {
    guessCard.style.display = "none";
    gameOverCard.style.display = tmpGuessCardDisplatType;
    let lbResultOnOver = document.getElementById("lbResultOnOver");
    lbResultOnOver.innerHTML = `The number was ${mysteryNumber}`;
  }

  console.log(guess);
};

function restartGame() {
  mysteryNumber = Math.floor(Math.random() * 100) + 1;
  live = 5;
  document.documentElement.style.setProperty(
    "--tube-percentage",
    (5 - live) * 20 + "%"
  );
  introCard.classList.remove("zoomOutAndFadeOut");
  introCard.style.display = tmpGuessCardDisplatType;
  indicatorWave.style.display = "none";
  guessCard.style.display = "none";
  gameOverCard.style.display = "none";
  winCard.style.display = "none";
  guessInput.value = "";
}

btRestart.onclick = () => {
  console.log("restart");
  restartGame();
};

function startConfetti() {
  let W = window.innerWidth;
  let H = window.innerHeight;
  const canvas = document.getElementById("canvas");
  canvas.style.display = "block";
  const context = canvas.getContext("2d");
  const maxConfettis = 150;
  const particles = [];

  const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson",
  ];

  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  function confettiParticle() {
    this.x = Math.random() * W; // x
    this.y = Math.random() * H - H; // y
    this.r = randomFromTo(11, 33); // radius
    this.d = Math.random() * maxConfettis + 11;
    this.color =
      possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function () {
      context.beginPath();
      context.lineWidth = this.r / 2;
      context.strokeStyle = this.color;
      context.moveTo(this.x + this.tilt + this.r / 3, this.y);
      context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
      return context.stroke();
    };
  }

  function Draw() {
    const results = [];

    // Magical recursive functional love
    requestAnimationFrame(Draw);

    context.clearRect(0, 0, W, window.innerHeight);

    for (var i = 0; i < maxConfettis; i++) {
      results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < maxConfettis; i++) {
      particle = particles[i];

      particle.tiltAngle += particle.tiltAngleIncremental;
      particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
      particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

      if (particle.y <= H) remainingFlakes++;

      // If a confetti has fluttered out of view,
      // bring it back to above the viewport and let if re-fall.
      if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
        particle.x = Math.random() * W;
        particle.y = -30;
        particle.tilt = Math.floor(Math.random() * 10) - 20;
      }
    }

    return results;
  }

  window.addEventListener(
    "resize",
    function () {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    false
  );

  // Push new confetti objects to `particles[]`
  for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
  }

  // Initialize
  canvas.width = W;
  canvas.height = H;
  Draw();
}

function stopConfetti() {
  let W = window.innerWidth;
  let H = window.innerHeight;
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  // clear canvas
  context.clearRect(0, 0, W, H);
}
