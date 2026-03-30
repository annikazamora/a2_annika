// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawShop() → what the shop screen looks like
// 2) input handlers → how the player returns to the start screen

// ------------------------------
// Main draw function for shop screen
// ------------------------------
// drawShop() is called from main.js
// only when currentScreen === "shop"
function drawShop() {
  // Red-tinted background to communicate failure
  background(235, 223, 226);
  imageMode(CENTER);
  image(allimg[4], width / 2, height / 2, width, height); // shop background image
}

// ------------------------------
// Mouse input for shop screen
// ------------------------------
// Any mouse click returns the player to the start screen
// (no buttons needed for this simple end state)
function shopMousePressed() {
  // intentionally empty
}
