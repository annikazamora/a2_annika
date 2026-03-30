// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawSleep() → what the sleep screen looks like
// 2) input handlers → how the player returns to the start screen

// ------------------------------
// Main draw function for instructions screen
// ------------------------------
// drawSleep() is called from main.js
// only when currentScreen === "sleep"
let sleepTimer = 300; // timer to show the sleep screen for a few seconds before going back to home

function drawSleep() {
  game = false;
  background(29, 24, 74);
  fill(255);
  textAlign(CENTER);
  textSize(40);

  if (energy > 4 && sleepTimer > 0) {
    text("One day closer to culinary school!", width / 2, height / 2);
    sleepTimer--;
  } else if (energy <= 4 && sleepTimer > 0) {
    text(
      "You are too tired to continue, you'll have to take tomorrow off.",
      width / 2,
      height / 2,
    );
    text(
      "Remember, rest is just as important as working!",
      width / 2,
      height / 2 + 60,
    );
    sleepTimer--;
  } else {
    energy = int(random(70, 98));
    day++;
    currentScreen = "home";
    sleepTimer = 300;
    daytimer = 250;
    openday.play();
  }
}

// ------------------------------
// Mouse input for recipe screen
// ------------------------------
function sleepMousePressed() {}
