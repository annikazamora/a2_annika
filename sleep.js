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
function drawSleep() {
  background(29, 24, 74);

  fill(255);
  textAlign(CENTER);

  // Bread type
  textSize(40);
  text("One day closer to culinary school!", width / 2, height / 2);
}

// ------------------------------
// Mouse input for recipe screen
// ------------------------------
// Any mouse click returns the player to the start screen
// (no buttons needed for this simple end state)
function sleepMousePressed() {
  currentScreen = "start";
}

// ------------------------------
// Keyboard input for recipe screen
// ------------------------------
// R is commonly used for “restart” in games
function sleepKeyPressed() {
  if (key === "r" || key === "R") {
    currentScreen = "start";
  }
}
