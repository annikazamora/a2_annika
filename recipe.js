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
  background(235, 223, 226);
  imageMode(CENTER);
  image(allimg[4], width / 2, height / 2, width, height); // recipe background image
  image(allimg[3], width / 2, 440, 1200, 650); // recipe image

  fill(0);
  textAlign(LEFT, CENTER);
  textSize(25);

  // Game instructions
  text("Today we are making my", 240, 300);
  text("favourite sourdough bread!", 240, 335);
  text("We have 3 orders,", 240, 400);
  text("but we might not be able", 240, 435);
  text("to make them all today.", 240, 470);
  text("Balancing our energy is", 240, 535);
  text("just as important as", 240, 570);
  text("filling orders!", 240, 605);

  // Ingredients
  text("Collect the following", 760, 200);
  text("items from the pantry.", 760, 235);
  text("Ingredients:", 760, 290);
  text("- Flour: " + flourCounter + "/3", 760, 340);
  text("- Water: " + waterCounter + "/2", 760, 390);
  text("- Starter: " + starterCounter + "/1", 760, 440);
  text("- Salt: " + saltCounter + "/1", 760, 490);

  // Instructions
  text("Combine all the ingredients", 760, 555);
  text("on the workbench, then", 760, 590);
  text("bake the dough in the oven.", 760, 625);
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
