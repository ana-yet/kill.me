const paw = document.getElementById("paw"),
  mouse = document.getElementById("mouse"),
  scoreDisplay = document.getElementById("score"),
  victoryPopup = document.getElementById("victory");

let score = 0,
  gameOver = false,
  isDamaged = false,
  moveInterval,
  pawMoveInterval,
  canscore = true,
  followCursor = false,
  clickCount = 0;

const centerX = window.innerWidth / 2,
  centerY = window.innerHeight / 2,
  pawSpeed = 3;

let pawX = centerX,
  pawY = centerY,
  mouseX = Math.random() * (window.innerWidth - 100),
  mouseY = Math.random() * (window.innerHeight - 100),
  speedX = 3,
  speedY = 2,
  pawDirectionX = 0,
  pawDirectionY = 0,
  pawMoving = false;

paw.style.left = `${pawX}px`;
paw.style.top = `${pawY}px`;

// Load sound effects
const hitSounds = [
  new Audio("blast.wav"),
  new Audio("m1.mp3"),
  new Audio("m2.mp3"),
  new Audio("m3.mp3"),
  new Audio("m4.mp3"),
];

let currentHitSound = null; // Track currently playing sound

function playHitSound() {
  if (currentHitSound) {
    currentHitSound.pause();
    currentHitSound.currentTime = 0; // Reset previous sound
  }
  const soundIndex = score % hitSounds.length; // Cycle through sounds
  currentHitSound = hitSounds[soundIndex];
  currentHitSound.play();
}

function moveMouse() {
  if (gameOver || isDamaged) return;
  mouseX += speedX;
  mouseY += speedY;
  if (mouseX <= 0 || mouseX >= window.innerWidth - 100) speedX *= -1;
  if (mouseY <= 0 || mouseY >= window.innerHeight - 100) speedY *= -1;
  mouse.style.left = `${mouseX}px`;
  mouse.style.top = `${mouseY}px`;
}

function movePaw() {
  if (!pawMoving || gameOver) return;
  pawX += pawDirectionX * pawSpeed;
  pawY += pawDirectionY * pawSpeed;
  if (
    pawX < 0 ||
    pawX > window.innerWidth - 50 ||
    pawY < 0 ||
    pawY > window.innerHeight - 50
  ) {
    respawnPaw();
    return;
  }
  paw.style.left = `${pawX}px`;
  paw.style.top = `${pawY}px`;
  checkCollision();
}

function respawnPaw() {
  pawMoving = false;
  paw.style.display = "none";
  setTimeout(() => {
    pawX = centerX;
    pawY = centerY;
    paw.style.left = `${pawX}px`;
    paw.style.top = `${pawY}px`;
    paw.style.display = "block";
    clickCount = 0;
    followCursor = false;
  }, 300);
}

function checkCollision() {
  const pawRect = paw.getBoundingClientRect(),
    mouseRect = mouse.getBoundingClientRect();

  if (
    pawRect.left < mouseRect.right &&
    pawRect.right > mouseRect.left &&
    pawRect.top < mouseRect.bottom &&
    pawRect.bottom > mouseRect.top
  ) {
    if (!canscore) return;
    score++;
    scoreDisplay.innerText = "Score: " + score;
    canscore = false;
    isDamaged = true;
    mouse.src = "./damage.png";

    playHitSound(); // Play new hit sound

    if (score >= 5) {
      gameOver = true;
      clearInterval(moveInterval);
      clearInterval(pawMoveInterval);
      mouse.src = "./win.jpg";
      mouse.classList.add("dead");

      bgm.pause();
      bgmt.play(); // Play game-over music

      setTimeout(() => {
        victoryPopup.style.display = "block";
      }, 500);
    } else {
      clearInterval(moveInterval);
      setTimeout(() => {
        mouse.src = "./sahid.png";
        isDamaged = false;
        canscore = true;
        moveInterval = setInterval(moveMouse, 20);
      }, 1000);
    }
  }
}

function followCursorMovement(event) {
  if (!followCursor) return;
  pawX += (event.clientX - pawX) * 0.2;
  pawY += (event.clientY - pawY) * 0.2;
  paw.style.left = `${pawX}px`;
  paw.style.top = `${pawY}px`;
}

document.addEventListener("click", (event) => {
  if (gameOver || isDamaged) return;
  clickCount++;
  if (clickCount === 0) {
    followCursor = true;
    document.addEventListener("mousemove", followCursorMovement);
  } else if (clickCount === 1) {
    followCursor = false;
    document.removeEventListener("mousemove", followCursorMovement);
    const cursorX = event.clientX,
      cursorY = event.clientY;
    pawDirectionX = -(cursorX - centerX) / 10;
    pawDirectionY = -(cursorY - centerY) / 10;
    pawMoving = true;
  }
});

moveInterval = setInterval(moveMouse, 20);
pawMoveInterval = setInterval(movePaw, 20);

let bgmt = document.getElementById("bgmt");
let bgm = document.getElementById("bgm");

document.addEventListener("click", function startBGM() {
  bgm.play().catch((error) => console.log("Autoplay blocked:", error));
  document.removeEventListener("click", startBGM);
});

// document.addEventListener("visibilitychange", function () {
//   if (document.hidden) {
//     bgm.pause();
//   } else {
//     bgm.play().catch((error) => console.log("Autoplay blocked:", error));
//   }
// });
// Set the background music volume when it starts
document.addEventListener("click", function startBGM() {
  bgm.volume = 0.5; // Set volume to 50% (range is 0.0 to 1.0)
  bgm.play().catch((error) => console.log("Autoplay blocked:", error));
  document.removeEventListener("click", startBGM);
});
