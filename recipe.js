// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawRecipe() → what the recipe screen looks like
// 2) input handlers → how the player returns to the start screen

// ------------------------------
// Main draw function for recipe screen
// ------------------------------
// drawRecipe() is called from main.js
// only when currentScreen === "recipe"
function drawRecipe() {
  // Red-tinted background to communicate failure
  background(255, 210, 210);

  fill(0);
  textAlign(CENTER, CENTER);

  // Main message
  textSize(40);
  text("recipe!", width / 2, 300);

  // Instruction text
  textSize(20);
  text("Click or press R to return to Start.", width / 2, 360);
}

// ------------------------------
// Mouse input for recipe screen
// ------------------------------
// Any mouse click returns the player to the start screen
// (no buttons needed for this simple end state)
function recipeMousePressed() {
  currentScreen = "start";
}

// ------------------------------
// Keyboard input for recipe screen
// ------------------------------
// R is commonly used for “restart” in games
function recipeKeyPressed() {
  if (key === "r" || key === "R") {
    currentScreen = "start";
  }
}
