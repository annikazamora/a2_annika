// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawOven() → what the oven screen looks like
// 2) input handlers → how the player returns to the start screen

// ------------------------------------------------------------
// Main draw function for oven screen
// ------------------------------------------------------------
// drawOven() is called from main.js
// only when currentScreen === "oven"
function drawOven() {
  // Green-tinted background to communicate success
  background(200, 255, 200);

  fill(0);
  textAlign(CENTER, CENTER);

  // Main success message
  textSize(40);
  text("oven!", width / 2, 300);

  // Instruction text
  textSize(20);
  text("Click or press R to return to Start.", width / 2, 360);
}

// ------------------------------------------------------------
// Mouse input for oven screen
// ------------------------------------------------------------
// Any mouse click returns the player to the start screen
function ovenMousePressed() {
  currentScreen = "start";
}
