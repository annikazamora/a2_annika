// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawRecipe() → what the instructions screen looks like
// 2) input handlers → how the player returns to the start screen

// ------------------------------
// Main draw function for instructions screen
// ------------------------------
// drawInstructions() is called from main.js
// only when currentScreen === "instructions"
function drawInstructions() {
  game = false;

  // Red-tinted background to communicate failure
  background(235, 223, 226);
  imageMode(CENTER);
  image(allimg[4], width / 2, height / 2, width, height); // instructions background image
  image(allimg[51], width / 2, height / 2, 1200, 650); // instructions image

  fill(0);
  textAlign(LEFT, CENTER);
  textSize(25);
  stroke(0);

  // Game instructions
  strokeWeight(1);
  text("Goals:", 240, 150);
  text("Gameplay:", 760, 150);
  strokeWeight(0);

  // Goals
  text("Your culinary school", 240, 200);
  text("application is due in", 240, 235);
  text("10 days. You need", 240, 270);
  text("to raise $400 in ", 240, 305);
  text("order to submit it.", 240, 340);
  text("Every action costs energy.", 240, 395);
  text("You'll need to be strategic ", 240, 430);
  text("about what you click ", 240, 465);
  text("and how much.", 240, 500);

  // Gameplay
  text("Click around to find", 760, 200);
  text("ingredients. Combine all ", 760, 235);
  text("the ingredients in the bowl.", 760, 270);
  text("Bake and sell bread to", 760, 305);
  text("earn money.", 760, 340);

  const playBtn = {
    x: 925,
    y: 560,
    w: 300,
    h: 70,
    label: "START GAME",
  };

  // Draw all buttons
  drawButton(playBtn);
}

// ------------------------------
// Mouse input for instructions screen
// ------------------------------
// Any mouse click returns the player to the start screen
// (no buttons needed for this simple end state)
function instructionsMousePressed() {
  const playBtn = { x: 925, y: 560, w: 300, h: 70 };

  // If play button is clicked, go to the home screen
  if (isHover(playBtn)) {
    prevScreen = currentScreen;
    currentScreen = "home";
    ambiance.play();
    openday.play();
  }
}
